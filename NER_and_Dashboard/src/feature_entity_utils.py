"""
feature_entity_utils.py
-----------------------
Shared helper functions for ft1.py

This version assumes:
- .txt files are in ../txt_dumps/
- .json files are in ../json_dumps/
relative to the src/ directory.
"""

from __future__ import annotations
import re, json, datetime as dt
from pathlib import Path
from collections import Counter, defaultdict
from typing import List, Dict, Tuple

import spacy
from sentence_transformers import SentenceTransformer, util
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from sklearn.cluster import AgglomerativeClustering

# ────────────────────────────────────────────────────────────────────────────
# Global models
nlp = spacy.load("en_core_web_sm")          # keep parser for noun_chunks
embedder = SentenceTransformer("all-MiniLM-L6-v2")
sentiment_analyzer = SentimentIntensityAnalyzer()

# ────────────────────────────────────────────────────────────────────────────
# Regex helpers
NON_MEANINGFUL_RE = re.compile(
    r"""
    ^(
      \d+[a-z]*         |  # 128gb, 15
      \d+\s?(?:%|months?)|
      \d+[a-z]?[-/]\d+[a-z]?|
      [a-z]\d+
    )$
    """,
    re.I | re.X,
)

def read_comments(path: str | Path) -> List[str]:
    """
    Reads comments from a .txt file. If a relative path is provided and the file does not exist,
    it is assumed to be in ../txt_dumps/ relative to the script's location.
    """
    p = Path(path)
    if not p.is_absolute() and not p.exists():
        p = Path("../txt_dumps") / p
    with open(p, "r", encoding="utf-8") as f:
        return [c.strip() for c in f.read().split("\n\n") if c.strip()]

def clean_phrase(p: str) -> str | None:
    p = p.lower().strip()
    if NON_MEANINGFUL_RE.match(p):                       # numeric junk
        return None
    if len(p) < 3:
        return None
    return p

def extract_phrases(text: str) -> List[str]:
    doc = nlp(text)
    out = []
    for ch in doc.noun_chunks:
        p = clean_phrase(ch.text)
        if p:
            out.append(p)
    return out

def cluster_phrases(phrases: List[str], threshold: float = 0.75) -> List[List[str]]:
    if len(phrases) == 1:
        return [phrases]

    embs = embedder.encode(phrases, convert_to_tensor=True)
    sims = util.pytorch_cos_sim(embs, embs).cpu().numpy()

    # convert cosine sim to distance
    dist = 1 - sims
    clustering = AgglomerativeClustering(
        n_clusters=None, metric="precomputed", linkage="average", distance_threshold=1 - threshold
    )
    labels = clustering.fit_predict(dist)
    clusters: Dict[int, List[str]] = defaultdict(list)
    for phrase, lab in zip(phrases, labels):
        clusters[lab].append(phrase)
    return list(clusters.values())

def aggregate_clusters(
    comments: List[str],
    top_clusts: List[List[str]],
) -> Dict[str, Dict]:
    """
    Build dict { "phrase / phrase2": {count, avg_sentiment, example}}
    """
    cluster_map: Dict[Tuple[str, ...], List[str]] = defaultdict(list)
    for cm in comments:
        cm_low = cm.lower()
        for cl in top_clusts:
            if any(p in cm_low for p in cl):
                cluster_map[tuple(cl)].append(cm)
    out = {}
    for cl, cmts in cluster_map.items():
        scores = [sentiment_analyzer.polarity_scores(c)["compound"] for c in cmts]
        out[" / ".join(cl)] = {
            "count": len(cmts),
            "avg_sentiment": sum(scores) / len(scores) if scores else 0,
            "example": cmts[0],
        }
    return out

def save_json(data: dict, filename: str):
    """
    Saves a dictionary as a JSON file in ../json_dumps/.
    """
    out_path = Path("../json_dumps") / filename
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(data, indent=2), encoding="utf-8")

def classify_clusters_with_llm(
    clusters: List[List[str]],
    product: str,
    product_type: str,
    model: str,
    api_key: str | None,
) -> Tuple[Dict[str, str], Dict[str, str], Dict[str, float]]:
    """
    Returns three maps keyed by the *literal* cluster string (lower‑cased):
      label_map   : 'entity' | 'feature' | 'ignore'
      rename_map  : nicer human name
      relevance   : 0‑1 float (only meaningful for label=='feature')
    """
    import litellm, os, json, re
    provider_key = api_key or os.getenv("GROQ_API_KEY") or os.getenv("OPENAI_API_KEY")

    system_prompt = (
        "You are a senior product-feedback analyst.\n"
        "You will be provided with a list of CLUSTERS — each cluster is a group of phrases extracted from real user comments about a specific product.\n"
        "For *each* cluster, return a JSON object with the following fields:\n\n"
        "  {\n"
        "    \"label\"     : \"entity\" | \"feature\" | \"ignore\",\n"
        "    \"rename\"    : A concise, human-readable name for the cluster,\n"
        "    \"relevance\" : A float between 0 and 1 indicating how important this feature is for a potential buyer considering this product.\n"
        "                  For example, core differentiators like 'camera quality' or 'battery life' might have high relevance (e.g., 0.9),\n"
        "                  while less impactful features (like 'SIM tray') should have lower scores (e.g., 0.2).\n"
        "                  For clusters labeled as 'entity' or 'ignore', always assign relevance = 0.\n"
        "  }\n\n"
        "Label meanings:\n"
        "• ENTITY   → brand, model, manufacturer, or competitor (e.g., 'Apple', 'Samsung')\n"
        "• FEATURE  → specific attribute, hardware spec, performance aspect, or user experience element (e.g., 'charging speed', 'display resolution')\n"
        "• IGNORE   → anything too vague, generic, irrelevant, or numeric (e.g., 'amazing', '128GB', '10/10')\n\n"
        "Important:\n"
        "• If multiple clusters refer to the same concept (e.g., 'price', 'cost', 'pricing'), assign them the **same 'rename' value** so they can be grouped.\n"
        "• Output exactly ONE valid JSON object mapping each original cluster string to its classification data.\n"
        "• Do not wrap your response in markdown or include explanatory text — only return the raw JSON object."
    )

    header = f"Product: '{product}'  (category: '{product_type}')"
    cluster_strings = [" / ".join(c) for c in clusters]
    user_payload = json.dumps(cluster_strings, indent=2)

    rsp = litellm.completion(
        model=model,
        api_key=provider_key,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user",   "content": f"{header}\n\nClusters:\n{user_payload}"},
        ],
        max_tokens=2048,
        temperature=0.0,
    ).choices[0].message.content.strip()

    # ------- parse -------
    try:
        m = re.search(r"``````", rsp, re.S)
        data = json.loads(m.group(1) if m else re.search(r"{.*}", rsp, re.S).group())
        label_map, rename_map, rel_map = {}, {}, {}
        for k, v in data.items():
            kl = k.lower()
            label_map [kl] = v["label"].strip().lower()
            rename_map[kl] = v["rename"].strip()
            rel_map  [kl] = float(v.get("relevance", 0))
        return label_map, rename_map, rel_map
    except Exception as e:
        print("⚠️  LLM parse failed → default scores 0", e, flush=True)
        lower = [s.lower() for s in cluster_strings]
        return (
            {k: "ignore" for k in lower},
            {k: k for k in lower},
            {k: 0.0 for k in lower},
        )
