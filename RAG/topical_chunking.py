import pandas as pd
from sentence_transformers import SentenceTransformer
from sklearn.cluster import KMeans
import argparse
import os

# ---------- CONFIG ----------
N_CLUSTERS = 5  # You can tune this based on number of expected topics
MODEL_NAME = 'all-MiniLM-L6-v2'
# ----------------------------

def read_comments(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = [line.strip() for line in f if line.strip()]
    return lines

def embed_comments(comments, model_name=MODEL_NAME):
    model = SentenceTransformer(model_name)
    embeddings = model.encode(comments, show_progress_bar=True)
    return embeddings

def cluster_comments(comments, embeddings, n_clusters=N_CLUSTERS):
    kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init='auto')
    labels = kmeans.fit_predict(embeddings)
    clustered = {}
    for label, comment in zip(labels, comments):
        clustered.setdefault(label, []).append(comment)
    return clustered

def save_clusters(clustered, output_dir='clusters'):
    os.makedirs(output_dir, exist_ok=True)
    for topic, comments in clustered.items():
        with open(os.path.join(output_dir, f'topic_{topic}.txt'), 'w', encoding='utf-8') as f:
            for comment in comments:
                f.write(comment + '\n')
    print(f"Saved clustered topics to: {output_dir}")

def main(input_file):
    print("[1] Reading comments...")
    comments = read_comments(input_file)
    print(f"[2] Total comments: {len(comments)}")

    print("[3] Embedding comments...")
    embeddings = embed_comments(comments)

    print(f"[4] Clustering into {N_CLUSTERS} topics...")
    clustered = cluster_comments(comments, embeddings)

    print("[5] Saving output...")
    save_clusters(clustered)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Topical Chunking of Comments')
    parser.add_argument('--input', type=str, required=True, help='iphone15_comments.txt')
    args = parser.parse_args()
    
    main(args.input)
