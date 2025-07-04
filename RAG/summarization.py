import os
import json
import faiss
import numpy as np
from tqdm import tqdm
from sentence_transformers import SentenceTransformer
import ollama

# ---------- CONFIG ----------
MODEL_NAME = 'all-MiniLM-L6-v2'
OLLAMA_MODEL = 'llama3'
CLUSTER_DIR = 'clusters'
INDEX_FILE = 'faiss_index.index'
METADATA_FILE = 'metadata.json'
# ----------------------------

def summarize_topic(topic_id, comments):
    joined_comments = "\n".join(comments)
    prompt = f"Summarize these user opinions about a product into a single paragraph:\n\n{joined_comments}"
    
    response = ollama.chat(model=OLLAMA_MODEL, messages=[
        {"role": "user", "content": prompt}
    ])
    
    return response['message']['content'].strip()

def embed_text(text, model):
    return model.encode([text])[0]

def load_clusters(cluster_dir):
    topics = []
    for fname in sorted(os.listdir(cluster_dir)):
        if fname.startswith('topic_') and fname.endswith('.txt'):
            topic_id = int(fname.split('_')[1].split('.')[0])
            with open(os.path.join(cluster_dir, fname), 'r', encoding='utf-8') as f:
                comments = [line.strip() for line in f if line.strip()]
                topics.append((topic_id, comments))
    return topics

def main():
    print("[1] Loading clusters...")
    topics = load_clusters(CLUSTER_DIR)

    print("[2] Loading embedding model...")
    embed_model = SentenceTransformer(MODEL_NAME)

    print("[3] Summarizing and embedding...")
    embeddings = []
    metadata = []

    for topic_id, comments in tqdm(topics):
        summary = summarize_topic(topic_id, comments)
        embedding = embed_text(summary, embed_model)
        embeddings.append(embedding)

        metadata.append({
            "topic": topic_id,
            "summary": summary,
            "comments": comments
        })

    print("[4] Building FAISS index...")
    dim = len(embeddings[0])
    index = faiss.IndexFlatL2(dim)
    index.add(np.array(embeddings))

    print(f"[5] Saving FAISS index to: {INDEX_FILE}")
    faiss.write_index(index, INDEX_FILE)

    print(f"[6] Saving metadata to: {METADATA_FILE}")
    with open(METADATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(metadata, f, indent=2)

    print("✅ Done. You can now query the summaries!")

if __name__ == "__main__":
    main()
