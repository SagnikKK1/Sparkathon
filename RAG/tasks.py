import argparse
import subprocess
import sys

def run_script(script_path, args=[]):
    cmd = [sys.executable, script_path] + args
    result = subprocess.run(cmd)
    if result.returncode != 0:
        print(f"❌ Failed running: {script_path}")
        exit(result.returncode)

def main():
    parser = argparse.ArgumentParser(description="RAG Pipeline Task Runner")
    parser.add_argument('--all', action='store_true', help='Run full pipeline: chunk → summarize → report')
    parser.add_argument('--chunk', action='store_true', help='Run topical chunking')
    parser.add_argument('--summarize', action='store_true', help='Run summarization and indexing')
    parser.add_argument('--report', action='store_true', help='Generate product report')
    parser.add_argument('--query', action='store_true', help='Run query mode (interactive)')
    parser.add_argument('--input', type=str, help='Path to input .txt file (for chunking)')
    
    args = parser.parse_args()

    if args.all:
        if not args.input:
            print("❌ --input is required with --all")
            exit(1)
        print("\n🔹 Step 1: Topical Chunking")
        run_script("RAG/topical_chunking.py", ['--input', args.input])

        print("\n🔹 Step 2: Summarization + Indexing")
        run_script("RAG/summarization.py")
        
        print("\n🔹 Step 4: Starting Query Mode")
        run_script("RAG/query.py")

        print("\n🔹 Step 3: Generating Report")
        run_script("RAG/report.py")


        return


    if args.chunk:
        if not args.input:
            print("❌ --input is required for --chunk")
            exit(1)
        run_script("RAG/topical_chunking.py", ['--input', args.input])

    if args.summarize:
        run_script("RAG/summarization.py")

    if args.report:
        run_script("RAG/report.py")

    if args.query:
        run_script("RAG/query.py")

if __name__ == "__main__":
    main()
