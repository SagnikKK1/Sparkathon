import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import traceback
from getpass import getpass
from RAG.my_workflow import create_workflow, run_workflow
import requests

# ---------- CONFIG ----------
current_dir = os.path.dirname(os.path.abspath(__file__))
METADATA_FILE = os.path.join(current_dir, 'metadata.json')
NER_CONTEXT_FILE = os.path.join(current_dir, 'extra_context', 'context_store.json')
BEFORE_CLEANING_FILE = os.path.join(current_dir, 'before_cleaning_report.txt')
REPORT_FILE = os.path.join(current_dir, 'product_report.txt')
OPENROUTER_API_KEY = "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"
# ----------------------------

def clean_report_with_openrouter(api_key, report_text):
    """Clean the report using DeepSeek R1 (free) via OpenRouter."""
    system_prompt = (
        "You are a helpful assistant that cleans product reports. "
        "Remove sections that contain no useful information, like those mentioning "
        "'no data', 'not available', 'search failed', or similar placeholders. "
        "Keep only sections with actual insights, content, or recommendations."
    )

    user_prompt = f"Here is the report:\n\n{report_text}\n\nClean it accordingly."

    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        },
        json={
            "model": "deepseek/deepseek-r1:free",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": 0.4
        }
    )

    response.raise_for_status()
    return response.json()['choices'][0]['message']['content']

def main():
    print("🤖 Advanced Product Analysis Report Generator")
    print("=" * 50)

    api_key = OPENROUTER_API_KEY

    if not os.path.exists(METADATA_FILE):
        print(f"❌ Required file not found: {METADATA_FILE}")
        return
    if not os.path.exists(NER_CONTEXT_FILE):
        print(f"❌ Required file not found: {NER_CONTEXT_FILE}")
        return

    print("✅ All required files found")
    print("🚀 Running workflow and cleaning report...")

    try:
        result = run_workflow(api_key, METADATA_FILE, NER_CONTEXT_FILE)
        raw_report = result.get('final_report')

        if raw_report:
            # Save before cleaning report
            with open(BEFORE_CLEANING_FILE, 'w', encoding='utf-8') as f:
                f.write(raw_report)
            print(f"✅ Before cleaning report saved to: {BEFORE_CLEANING_FILE}")

            print("🧹 Cleaning the report with LLM (via OpenRouter)...")
            cleaned_report = clean_report_with_openrouter(api_key, raw_report)

            with open(REPORT_FILE, 'w', encoding='utf-8') as f:
                f.write(cleaned_report)

            print(f"✅ Cleaned report saved to: {REPORT_FILE}")
        else:
            print("❌ No report was generated.")

    except Exception as e:
        print(f"❌ Workflow failed: {type(e).__name__}: {e}")
        traceback.print_exc()

if __name__ == "__main__":
    main()
