import json
import faiss
import os
import re
import requests
import psycopg2
from datetime import datetime
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv
import sys

# ---------- CONFIG ----------
MODEL_NAME = 'all-MiniLM-L6-v2'
TOP_K = 3
OPENROUTER_MODEL = 'deepseek/deepseek-r1:free'
OPENROUTER_API_KEY = os.environ.get('OPENROUTER_API_KEY')
if not OPENROUTER_API_KEY:
    raise RuntimeError('OPENROUTER_API_KEY environment variable is not set!')
load_dotenv()
DB_URL = os.getenv('DATABASE_URL')

# Dynamically resolve file paths relative to this script
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
INDEX_FILE = os.path.join(SCRIPT_DIR, 'faiss_index.index')
METADATA_FILE = os.path.join(SCRIPT_DIR, 'metadata.json')
# ----------------------------

def embed_text(text, model):
    return model.encode([text])[0]

def load_faiss_index(path):
    return faiss.read_index(path)

def load_metadata(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def retrieve_with_sources(query, model, index, metadata, k=TOP_K):
    query_embedding = embed_text(query, model).reshape(1, -1)
    D, I = index.search(query_embedding, k)
    sources = []
    for idx in I[0]:
        entry = metadata[idx]
        sources.append({
            "topic": entry["topic"],
            "summary": entry["summary"],
            "comments": entry["comments"]
        })
    return sources

def load_ner_context():
    ner_file = os.path.join(SCRIPT_DIR, "RAG", "extra_context", "context_store.json")
    if os.path.exists(ner_file):
        with open(ner_file) as f:
            return json.load(f)
    return None

def build_prompt(query, sources, ner_context=None):
    prompt = (
        "You are a helpful assistant that answers user questions about product performance based solely on provided SOURCES.\n"
        "Compose a professional and concise response (around 60 words) that synthesizes insights across sources.\n"
        "Use citations like [S1], [S2], etc., in your answer. Avoid repeating the same citation unnecessarily.\n"
        "If sentiment data is provided, incorporate it.\n"
        f"\nQUESTION: {query}\n\n"
        "SOURCES:\n"
    )
    for i, s in enumerate(sources, start=1):
        prompt += f"[S{i}] Topic: {s['topic']}\nSummary: {s['summary']}\n\n"
    if ner_context:
        prompt += "[Extra Context: Entity-Level Sentiment]\n"
        prompt += json.dumps(ner_context, indent=2)
    prompt += "\nAvoid exaggeration. Use cautious, evidence-based language. Keep the tone formal."
    return prompt

def expand_citations(answer, sources):
    citations = re.findall(r"\[S(\d+)\]", answer)
    seen = set()
    output = answer + "\n\n"
    for citation in citations:
        idx = int(citation) - 1
        if idx not in seen:
            seen.add(idx)
            comments = sources[idx]["comments"]
            snippet = "\n".join(f"  - \"{c}\"" for c in comments[:3])
            output += f"[S{idx+1}]\nTopic: {sources[idx]['topic']}\nComments:\n{snippet}\n\n"
    return output.strip()

def openrouter_chat(prompt):
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

    response = requests.post(url, headers=headers, json=payload)
    if response.status_code != 200:
        raise RuntimeError(f"Request failed: {response.status_code}\n{response.text}")
    return response.json()['choices'][0]['message']['content'].strip()

def insert_chatbot_message(user_query: str, system_response: str):
    try:
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()
        now = datetime.utcnow()
        insert_query = '''
            INSERT INTO chatbot_messages (id, user_query, system_response, created_at, updated_at)
            VALUES (gen_random_uuid(), %s, %s, %s, %s)
        '''
        cur.execute(insert_query, (user_query, system_response, now, now))
        conn.commit()
        cur.close()
        conn.close()
        print("✅ ChatBotMessage inserted into database.")
    except Exception as e:
        print(f"❌ Failed to insert ChatBotMessage: {e}")

def answer_query(user_query: str):
    index = load_faiss_index(INDEX_FILE)
    metadata = load_metadata(METADATA_FILE)
    model = SentenceTransformer(MODEL_NAME)

    sources = retrieve_with_sources(user_query, model, index, metadata)
    ner_context = load_ner_context()
    prompt = build_prompt(user_query, sources, ner_context)

    try:
        raw_answer = openrouter_chat(prompt)
        final_answer = expand_citations(raw_answer, sources)
        insert_chatbot_message(user_query, final_answer)
        return final_answer
    except Exception as e:
        print("❌ Failed to get a response:", e)
        insert_chatbot_message(user_query, f"Error: {e}")
        return f"Error: {e}"

if __name__ == "__main__":
    if len(sys.argv) >= 2:
        user_query = sys.argv[1]
    else:
        user_query = input("\n🔸 Your Question: ").strip()
    if not user_query:
        print("No question entered. Exiting.")
    else:
        answer = answer_query(user_query)
        print("\n🧠 Answer with Sources:")
        print(answer)
