import json
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
import ollama

# ---------- CONFIG ----------
MODEL_NAME = 'all-MiniLM-L6-v2'
OLLAMA_MODEL = 'llama3'
INDEX_FILE = 'faiss_index.index'
METADATA_FILE = 'metadata.json'
TOP_K = 3
# ----------------------------

def embed_text(text, model):
    return model.encode([text])[0]

def load_faiss_index(path):
    return faiss.read_index(path)

def load_metadata(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def retrieve_top_k(query, model, index, metadata, k=TOP_K):
    query_embedding = embed_text(query, model).reshape(1, -1)
    D, I = index.search(query_embedding, k)
    return [metadata[i] for i in I[0]]

def generate_answer(query, retrieved_chunks):
    context_parts = []
    for chunk in retrieved_chunks:
        topic_id = chunk['topic']
        summary = chunk['summary']
        comments = chunk['comments']  # limit to 5 comments to avoid context overflow
        comment_block = "\n".join([f'- "{c}"' for c in comments])
        
        block = (
            f"Topic {topic_id} Summary:\n{summary}\n\n"
            f"Representative Comments:\n{comment_block}"
        )
        context_parts.append(block)

    context = "\n\n---\n\n".join(context_parts)

    prompt = f"""You are a product assistant helping answer customer questions based on Reddit reviews.

Use a structured, clear format with bolded section titles or bullet points where relevant. Do not include phrases like "Based on the provided..." or "According to user opinions." Just provide the answer naturally and professionally. 
{context}

Question: {query}
Answer:"""

    response = ollama.chat(model=OLLAMA_MODEL, messages=[
        {"role": "user", "content": prompt}
    ])
    return response['message']['content'].strip()


def main():
    query = input("🔍 Enter your product-related question: ")

    print("[1] Loading embedding model...")
    model = SentenceTransformer(MODEL_NAME)

    print("[2] Loading FAISS index and metadata...")
    index = load_faiss_index(INDEX_FILE)
    metadata = load_metadata(METADATA_FILE)

    print("[3] Retrieving relevant topics...")
    top_chunks = retrieve_top_k(query, model, index, metadata)

    print("[4] Generating answer using Ollama...")
    answer = generate_answer(query, top_chunks)
    with open('query_answer.txt','w') as f:
        f.write(answer)
    print("\n🤖 Answer:\n", answer)

if __name__ == "__main__":
    main()
