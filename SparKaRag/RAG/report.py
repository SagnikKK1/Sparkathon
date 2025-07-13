import os
import traceback
from getpass import getpass
from RAG.my_workflow import create_workflow, run_workflow
import requests

# ---------- CONFIG ----------
METADATA_FILE = 'C:\IITBBS\Projects\Walmart Sparkathon\Development\Sparkathon\SparKaRag\RAG\metadata.json'
NER_CONTEXT_FILE = 'C:\IITBBS\Projects\Walmart Sparkathon\Development\Sparkathon\SparKaRag\RAG\extra_context\context_store.json'
REPORT_FILE = 'product_report.txt'
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
            print("🧹 Cleaning the report with LLM (via OpenRouter)...")
            cleaned_report = clean_report_with_openrouter(api_key, raw_report)

            with open(REPORT_FILE, 'w') as f:
                f.write(cleaned_report)

            print(f"✅ Cleaned report saved to: {REPORT_FILE}")
        else:
            print("❌ No report was generated.")

    except Exception as e:
        print(f"❌ Workflow failed: {type(e).__name__}: {e}")
        traceback.print_exc()

if __name__ == "__main__":
    main()