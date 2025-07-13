import os
import json
import time
import faiss
import numpy as np
from tqdm import tqdm
from math import ceil
from sklearn.cluster import KMeans
from sentence_transformers import SentenceTransformer
import requests
import torch

# ---------- CONFIG ----------
MODEL_NAME             = os.get('MODEL_NAME')
OPENROUTER_MODEL       = os.getenv('OPENROUTER_MODEL')
OPENROUTER_API_KEY     = os.getenv("OPENROUTER_API_KEY", "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")
CLUSTER_DIR            = os.getenv("CLUSTER_DIR")
INDEX_FILE             = os.getenv("INDEX_FILE")
METADATA_FILE          = os.getenv("METADATA_FILE")
MAX_COMMENTS_PER_TOPIC = 20
# ----------------------------

# ─── Thread/BLAS limiting for macOS ───────────────────────────────
os.environ["OMP_NUM_THREADS"]         = "4"
os.environ["OPENBLAS_NUM_THREADS"]    = "4"
os.environ["MKL_NUM_THREADS"]         = "4"
os.environ["VECLIB_MAXIMUM_THREADS"]  = "4"
os.environ["TOKENIZERS_PARALLELISM"]  = "false"

try:
    torch.set_num_threads(4)
    torch.set_num_interop_threads(1)
except:
    pass

# ─── OpenRouter Chat Function with Retry ──────────────────────────
def openrouter_chat(prompt, max_retries=5, backoff_factor=2):
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": OPENROUTER_MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7
    }

    for attempt in range(1, max_retries + 1):
        response = requests.post(url, headers=headers, json=payload)
        if response.status_code == 200:
            return response.json()['choices'][0]['message']['content'].strip()
        elif response.status_code == 429:
            wait = backoff_factor ** attempt
            print(f"⚠️ Rate limited. Retrying in {wait}s…")
            time.sleep(wait)
        else:
            print(f"❌ HTTP {response.status_code}: {response.text}")
            response.raise_for_status()
    raise Exception("❌ Failed after retries due to rate limits or errors.")

# ─── Load Clustered Comments ──────────────────────────────────────
def load_clusters(cluster_dir):
    topics = []
    for fname in sorted(os.listdir(cluster_dir)):
        if fname.startswith('topic_') and fname.endswith('.txt'):
            tid = int(fname.split('_')[1].split('.')[0])
            with open(os.path.join(cluster_dir, fname), 'r', encoding='utf-8') as f:
                comments = [l.strip() for l in f if l.strip()]
            if comments:
                topics.append((tid, comments))
    return topics

# ─── Choose Representative Comments per Topic ─────────────────────
def select_representative_comments(comments, top_k, embed_model):
    if len(comments) <= top_k:
        return comments
    emb = embed_model.encode(comments, normalize_embeddings=True)
    kmeans = KMeans(n_clusters=top_k, n_init='auto', random_state=42).fit(emb)
    centers = kmeans.cluster_centers_
    idxs = [int(np.argmin(np.linalg.norm(emb - c, axis=1))) for c in centers]
    seen = set()
    unique = [i for i in idxs if not (i in seen or seen.add(i))]
    return [comments[i] for i in unique]

def select_all_topics(topics, embed_model, top_k=MAX_COMMENTS_PER_TOPIC):
    print("[2] Selecting representative comments for each topic…")
    out = []
    for tid, comments in topics:
        reps = select_representative_comments(comments, top_k, embed_model)
        out.append((tid, reps))
    return out

# ─── Summarize Each Topic ─────────────────────────────────────────
def summarize_topic(topic_id, selected_comments):
    prompt = (
        "Summarize the following user opinions about a product into a single paragraph:\n\n"
        + "\n".join(selected_comments)
    )
    summary = openrouter_chat(prompt)
    return {
        "topic":   topic_id,
        "summary": summary,
        "comments": selected_comments
    }

def summarize_all(selected_topics):
    print(f"[3] Summarizing {len(selected_topics)} topics one-by-one...")
    summaries = []
    for tid, comments in tqdm(selected_topics, desc="🧠 Summarizing", unit="topic"):
        summary = summarize_topic(tid, comments)
        summaries.append(summary)
        time.sleep(2)
    return summaries

# ─── Build and Save FAISS Index ──────────────────────────────────
def build_faiss_index(embeddings):
    d = embeddings.shape[1]
    idx = faiss.IndexFlatL2(d)
    idx.add(embeddings)
    return idx

def save_outputs(index, metadata):
    print(f"[6] Writing FAISS index → {INDEX_FILE}")
    faiss.write_index(index, INDEX_FILE)
    print(f"[7] Writing metadata → {METADATA_FILE}")
    with open(METADATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(metadata, f, indent=2)

# ─── Main Execution ───────────────────────────────────────────────
def main():
    print("[1] Loading clusters…")
    raw = load_clusters(CLUSTER_DIR)
    if not raw:
        print("❌ No clusters found.")
        return

    print("[2] Loading embedder…")
    embedder = SentenceTransformer(MODEL_NAME)

    selected = select_all_topics(raw, embedder)

    summaries = summarize_all(selected)

    print("[4] Embedding summaries…")
    texts = [s["summary"] for s in summaries]
    embs = embedder.encode(
        texts,
        show_progress_bar=True,
        batch_size=32,
        normalize_embeddings=True
    )

    meta = [{
        "topic":    s["topic"],
        "summary":  s["summary"],
        "comments": s["comments"]
    } for s in summaries]

    idx = build_faiss_index(np.stack(embs).astype(np.float32))
    save_outputs(idx, meta)

    print("✅ Done. You can now query your FAISS+summaries!")

if __name__ == "__main__":
    main()
