import os
import time
import json
import requests
import numpy as np
import argparse
from sentence_transformers import SentenceTransformer
from sklearn.preprocessing import StandardScaler
from umap import UMAP
import hdbscan
from concurrent.futures import ThreadPoolExecutor
from keybert import KeyBERT

from dotenv import load_dotenv
load_dotenv()
# ---------- CONFIG ----------
INPUT_FILE = os.getenv("INPUT_FILE")
OUTPUT_DIR = "SparKaRag/clusters"
MODEL_NAME = os.getenv("MODEL_NAME_CLUSTERING")
BATCH_SIZE = 64
MAX_WORKERS = 4
MIN_CLUSTER_SIZE = 10
TOP_K_CLUSTERS = 20
# ----------------------------

def read_comments(path):
    with open(path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        comments = list(executor.map(lambda x: x.strip(), lines))
    return [c for c in comments if c]

def embed_comments(comments, model, batch_size=BATCH_SIZE):
    embeddings = []
    for i in range(0, len(comments), batch_size):
        batch = comments[i:i + batch_size]
        batch_embeddings = model.encode(batch, show_progress_bar=False)
        embeddings.append(batch_embeddings)
    return np.vstack(embeddings)

def cluster_with_hdbscan(embeddings, min_cluster_size=MIN_CLUSTER_SIZE):
    print("🔍 Reducing dimensionality with UMAP (parallel)...")
    reducer = UMAP(n_components=15, n_neighbors=15, metric='cosine', n_jobs=-1)
    reduced = reducer.fit_transform(embeddings)

    print("🔍 Running HDBSCAN clustering (parallel)...")
    clusterer = hdbscan.HDBSCAN(
        min_cluster_size=min_cluster_size,
        metric='euclidean',
        cluster_selection_method='eom',
        core_dist_n_jobs=-1
    )
    labels = clusterer.fit_predict(reduced)

    clusters = {}
    for idx, label in enumerate(labels):
        if label == -1:
            continue
        clusters.setdefault(label, []).append(idx)

    print(f"✅ Found {len(clusters)} clusters.")
    return list(clusters.values())

def label_cluster(comments_subset, kw_model):
    joined = " ".join(comments_subset[:20])
    keywords = kw_model.extract_keywords(joined, keyphrase_ngram_range=(1, 3), stop_words='english', top_n=1)
    if keywords:
        return keywords[0][0].replace(" ", "_")[:60].replace("/", "_")
    return "Unknown_Topic"

def save_clusters(clusters, comments, output_dir, model, top_k=TOP_K_CLUSTERS):
    os.makedirs(output_dir, exist_ok=True)
    clusters = sorted(clusters, key=lambda c: len(c), reverse=True)[:top_k]
    kw_model = KeyBERT(model)

    def write_cluster(idx_cluster):
        idx, cluster = idx_cluster
        cluster_comments = [comments[i] for i in cluster]
        label = label_cluster(cluster_comments, kw_model)
        filename = f"topic_{idx}_{label}.txt"
        with open(os.path.join(output_dir, filename), 'w', encoding='utf-8') as f:
            for c in cluster_comments:
                f.write(c + '\n')

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        executor.map(write_cluster, enumerate(clusters))

    print(f"Saved {len(clusters)} labeled topical chunks to: {output_dir}")

def main():
    parser = argparse.ArgumentParser(description='Topical chunking for product comments')
    parser.add_argument('--input', default=INPUT_FILE, help='Input comments file')
    args = parser.parse_args()

    print("[1] Reading comments...")
    comments = read_comments(args.input)
    if not comments:
        print("No comments found. Exiting.")
        return

    print("[2] Embedding comments...")
    model = SentenceTransformer(MODEL_NAME)
    embeddings = embed_comments(comments, model)

    print("[3] Clustering with HDBSCAN...")
    clusters = cluster_with_hdbscan(embeddings)

    if not clusters:
        print(" No clusters found. Exiting.")
        return

    print(f"[4] Saving top {TOP_K_CLUSTERS} clusters...")
    save_clusters(clusters, comments, OUTPUT_DIR, model)

if __name__ == "__main__":
    main()
