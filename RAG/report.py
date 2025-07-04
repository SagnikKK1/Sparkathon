import json
import ollama
from reportlab.lib.pagesizes import LETTER
from reportlab.pdfgen import canvas
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.units import inch

# ---------- CONFIG ----------
METADATA_FILE = 'metadata.json'
REPORT_TEXT_FILE = 'product_report.txt'
REPORT_PDF_FILE = 'product_report.pdf'
OLLAMA_MODEL = 'llama3'
# ----------------------------

def generate_report(metadata):
    prompt = (
        "You are a professional product analyst writing a detailed report based on Reddit user feedback. "
        "You have topic-wise summaries and their corresponding raw user comments.\n\n"
        "Using this data, generate a high-quality structured report including:\n"
        "1. A compelling Introduction\n"
        "2. Topic-wise breakdowns with:\n"
        "    - Title (inferred from content)\n"
        "    - Key user insights\n"
        "    - A few representative quotes\n"
        "3. A Conclusion with actionable takeaways.\n\n"
        "Avoid boilerplate like 'based on the above'. Use clear, natural language.\n\n"
    )

    for item in metadata:
        topic = item["topic"]
        summary = item["summary"]
        comments = item["comments"][:5]  # Limit for prompt length
        comment_lines = "\n".join([f'- "{c}"' for c in comments])
        
        prompt += f"\n---\nTopic {topic} Summary:\n{summary}\n\nSample Comments:\n{comment_lines}\n"

    prompt += "\n\nGenerate the report now."

    response = ollama.chat(model=OLLAMA_MODEL, messages=[
        {"role": "user", "content": prompt}
    ])
    
    return response['message']['content'].strip()


def save_as_pdf(text, path):
    styles = getSampleStyleSheet()
    story = []
    doc = SimpleDocTemplate(path, pagesize=LETTER,
                            rightMargin=72, leftMargin=72,
                            topMargin=72, bottomMargin=72)
    
    for line in text.split("\n"):
        if line.strip():
            style = styles["Heading2"] if line.strip().startswith("**") else styles["BodyText"]
            cleaned = line.replace("**", "").strip()
            story.append(Paragraph(cleaned, style))
            story.append(Spacer(1, 0.2 * inch))
        else:
            story.append(Spacer(1, 0.3 * inch))
    
    doc.build(story)


def main():
    print("[1] Loading metadata...")
    with open(METADATA_FILE, 'r', encoding='utf-8') as f:
        metadata = json.load(f)

    print("[2] Generating product report using Ollama...")
    report = generate_report(metadata)

    print("[3] Saving report...")
    with open(REPORT_TEXT_FILE, 'w', encoding='utf-8') as f:
        f.write(report)

    save_as_pdf(report, REPORT_PDF_FILE)

    print(f"\n✅ Report saved to:\n- Text: {REPORT_TEXT_FILE}\n- PDF:  {REPORT_PDF_FILE}")


if __name__ == "__main__":
    main()
