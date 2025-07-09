#!/usr/bin/env python3
"""
ft1.py  -  Extract + cluster noun phrases, score sentiment, then
           classify each cluster with an LLM (entity / feature / ignore).

Outputs:
  • clustered.json            - every raw cluster
  • entities_clustered.json   - merged entity clusters
  • features_clustered.json   - merged feature clusters (+ relevance)
  • cluster_renames.json      - original_cluster → renamed_to
"""

from __future__ import annotations
import argparse, json, os
from pathlib import Path
from collections import Counter, defaultdict
from typing import List

from dotenv import load_dotenv
import feature_entity_utils as fe

load_dotenv()

# ────────────────────────────────────────────────────────────────────────────
def main() -> None:
    # ---------------- CLI ----------------
    cli = argparse.ArgumentParser()
    cli.add_argument("--comments",        required=True, help="txt file of comments")
    cli.add_argument("--product",         required=True, help="Exact product name")
    cli.add_argument("--product_type",    required=True, help="Human category (phone, shampoo…)")

    cli.add_argument("--top",       type=int,   default=80,
                     help="How many frequent phrases to keep before clustering")
    cli.add_argument("--threshold", type=float, default=0.75,
                     help="Agglomerative distance cutoff (1-cosine)")

    cli.add_argument("--model", default=os.getenv("LLM_MODEL", "groq/mixtral-8x7b"))
    cli.add_argument("--api_key", default=os.getenv("LLM_API_KEY"),
                     help="Optional override (else env var like GROQ_API_KEY)")

    cli.add_argument("--raw_output",      default="clustered.json")
    cli.add_argument("--entities_output", default="entities_clustered.json")
    cli.add_argument("--features_output", default="features_clustered.json")
    args = cli.parse_args()

    # ---------------- 1️⃣  Read + extract noun phrases ----------------
    comments: List[str] = fe.read_comments(args.comments)

    all_phrases = [
        phrase
        for comment in comments
        for phrase in fe.extract_phrases(comment)
    ]
    top_phrases = [p for p, _ in Counter(all_phrases).most_common(args.top)]
    if not top_phrases:
        raise SystemExit("❌  No usable noun phrases extracted.")

    # ---------------- 2️⃣  Cluster similar phrases ----------------
    clusters = fe.cluster_phrases(top_phrases, threshold=args.threshold)

    # ---------------- 3️⃣  Aggregate sentiment per cluster ----------------
    raw_clusters = fe.aggregate_clusters(comments, clusters)
    Path(args.raw_output).write_text(json.dumps(raw_clusters, indent=4), encoding="utf-8")
    print(f"📦  {len(raw_clusters)} raw clusters → {args.raw_output}")

    # ---------------- 4️⃣  LLM classification → label, rename, relevance ----------------
    label_map, rename_map, rel_map = fe.classify_clusters_with_llm(
        clusters,
        product=args.product,
        product_type=args.product_type,
        model=args.model,
        api_key=args.api_key,
    )

    # ---------------- 5️⃣  Group by renamed cluster ----------------
    grouped_entities: dict[str, dict] = defaultdict(lambda: {
        "count": 0,
        "sentiments": [],
        "examples": [],
        "original_clusters": []
    })

    grouped_features: dict[str, dict] = defaultdict(lambda: {
        "count": 0,
        "sentiments": [],
        "examples": [],
        "original_clusters": [],
        "relevance": 0.0
    })

    for original_key, payload in raw_clusters.items():
        key_lc  = original_key.lower()
        label   = label_map.get(key_lc, "ignore")
        renamed = rename_map.get(key_lc, original_key)

        if label == "entity":
            ent = grouped_entities[renamed]
            ent["count"] += payload["count"]
            ent["sentiments"].append(payload["avg_sentiment"])
            ent["examples"].append(payload["example"])
            ent["original_clusters"].append(original_key)

        elif label == "feature":
            feat = grouped_features[renamed]
            feat["count"] += payload["count"]
            feat["sentiments"].append(payload["avg_sentiment"])
            feat["examples"].append(payload["example"])
            feat["original_clusters"].append(original_key)
            feat["relevance"] = max(feat["relevance"], float(rel_map.get(key_lc, 0.0)))

        # ignore = skip

    # ---------------- 6️⃣  Finalize merged outputs ----------------
    def finalize_group(d: dict[str, dict], include_relevance=False) -> dict[str, dict]:
        out = {}
        for rename, data in d.items():
            avg_sent = sum(data["sentiments"]) / len(data["sentiments"]) if data["sentiments"] else 0.0
            entry = {
                "count": data["count"],
                "avg_sentiment": round(avg_sent, 4),
                "example": data["examples"][0],
                "original_clusters": data["original_clusters"],
            }
            if include_relevance:
                entry["relevance"] = round(data["relevance"], 4)
            out[rename] = entry
        return out

    final_entities = finalize_group(grouped_entities)
    final_features = finalize_group(grouped_features, include_relevance=True)

    # ---------------- 7️⃣  Save all outputs ----------------
    Path(args.entities_output ).write_text(json.dumps(final_entities, indent=4), encoding="utf-8")
    Path(args.features_output ).write_text(json.dumps(final_features, indent=4), encoding="utf-8")

    rename_path = Path(args.entities_output).with_name("cluster_renames.json")
    Path(rename_path).write_text(json.dumps(rename_map, indent=4), encoding="utf-8")

    print(f"✅  {len(final_entities)} merged entity clusters  → {args.entities_output}")
    print(f"✅  {len(final_features)} merged feature clusters → {args.features_output}")
    print(f"📝  Rename map saved                         → {rename_path}")

# ────────────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    main()