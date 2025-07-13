#!/usr/bin/env python3
"""
run_all.py  -  concurrent orchestrator
Runs scrape_reddit.py & scrape_youtube.py in parallel, then ft1.py.
"""
import argparse, os, subprocess, sys, shutil, time, codecs, threading
from pathlib import Path
sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer)
# import argparse, subprocess, sys, time
# from pathlib import Path

PY = sys.executable

def stream_output(pipe, prefix: str):
    """Stream output from a pipe with a prefix"""
    for line in iter(pipe.readline, ''):
        if line:
            print(f"{prefix}: {line.rstrip()}", flush=True)



def launch(cmd: list, title: str) -> subprocess.Popen:
    print(f"▶️  Launching {title} …", flush=True)
    env = os.environ.copy()
    env["PYTHONIOENCODING"] = "utf-8"
    env["PYTHONUNBUFFERED"]  = "1"               # <── add this
    if cmd[0] == PY:                             # prepend -u
        cmd = [PY, "-u"] + cmd[1:]
    return subprocess.Popen(
        cmd,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        encoding="utf-8",
        env=env,
        bufsize=1,  # line‑buffer within Popen
        universal_newlines=True,
    )


def wait_process(p: subprocess.Popen, title: str):
    # Create threads to stream stdout and stderr in real-time
    stdout_thread = threading.Thread(target=stream_output, args=(p.stdout, f"[{title}]"))
    stderr_thread = threading.Thread(target=stream_output, args=(p.stderr, f"[{title}-ERR]"))
    
    stdout_thread.daemon = True
    stderr_thread.daemon = True
    
    stdout_thread.start()
    stderr_thread.start()
    
    # Wait for process to complete
    returncode = p.wait()
    
    # Wait for threads to finish
    stdout_thread.join()
    stderr_thread.join()
    
    if returncode != 0:
        print(f"❌  {title} failed (exit {returncode})")
        sys.exit(returncode)
    
    print(f"✅  {title} completed successfully")

def launch_in_new_terminal(cmd: list, title: str):
    """Launch a command in a new terminal window (Windows only)."""
    if sys.platform == "win32":
        # Join the command into a string, quoting as needed
        cmd_str = " ".join(f'"{c}"' if " " in c or c.endswith('.py') else c for c in cmd)
        # Use 'start' to open a new cmd window with a title, /k keeps it open
        full_cmd = f'start "{title}" cmd /k {cmd_str}'
        # shell=True is required for 'start' to work
        return subprocess.Popen(full_cmd, shell=True)
    else:
        # For Unix-like systems, fallback to xterm (optional)
        return subprocess.Popen(['xterm', '-T', title, '-e'] + cmd)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--product", required=True)
    ap.add_argument("--product_type", required=True)
    ap.add_argument("--since", default="30d")
    ap.add_argument("--min_len", type=int, default=20)
    ap.add_argument("--post_limit", type=int, default=200)
    ap.add_argument("--video_limit", type=int, default=10)
    ap.add_argument("--ft1_path", default="ft1.py")
    ap.add_argument("--card_path", default="card1.py")
    args = ap.parse_args()

    clean = "".join(c for c in args.product.lower() if c.isalnum())
    reddit_file  = Path(f"txt_dumps/{clean}_reddit_comments.txt")
    yt_file      = Path(f"txt_dumps/{clean}_youtube_comments.txt")
    combined     = Path(f"txt_dumps/{clean}_comments.txt")

    # Build commands
    reddit_cmd = [
        PY, "src/scrape_reddit.py",
        "--product", args.product,
        "--product_type", args.product_type,
        "--post_limit", str(args.post_limit),
        "--min_len", str(args.min_len),
        "--since", args.since,
        "--outfile", str(reddit_file),
    ]
    yt_cmd = [
        PY, "src/scrape_youtube.py",
        "--product", args.product,
        "--product_type", args.product_type,
        "--video_limit", str(args.video_limit),
        "--min_len", str(args.min_len),
        "--since", args.since,
        "--outfile", str(yt_file),
    ]

    # 1️⃣  Launch both scrapers in separate terminals (Windows only)
    print("▶️  Launching Reddit scraper in new terminal…", flush=True)
    p_reddit = launch_in_new_terminal(reddit_cmd, "Reddit scraper")
    print("▶️  Launching YouTube scraper in new terminal…", flush=True)
    p_yt     = launch_in_new_terminal(yt_cmd,     "YouTube scraper")

    # 2️⃣  Wait for both marker files to be created (polling)
    reddit_done = str(reddit_file) 
    yt_done     = str(yt_file) 
    print("⏳  Waiting for both scrapers to finish…", flush=True)
    while not (os.path.exists(reddit_done) and os.path.exists(yt_done)):
        time.sleep(2)

    # 3️⃣  Merge files
    print("📝  Merging comment files …")
    with combined.open("w", encoding="utf-8") as out:
        for src in (reddit_file, yt_file):
            if src.exists():
                out.write(src.read_text(encoding="utf-8"))
                out.write("\n")
    print(f"✅  Combined comments → {combined}")

    # 4️⃣  Run ft1.py with real-time output
    ft1_cmd = [
        PY, "src/ft1.py",
        "--comments", str(combined),
        "--product", args.product,
        "--product_type", args.product_type,
        "--raw_output", f"json_dumps/clustered.json",
        "--entities_output", f"json_dumps/entities_clustered.json",
        "--features_output", f"json_dumps/features_clustered.json",
    ]
    print("🚀  Running ft1.py …")
    ft1_process = launch(ft1_cmd, "ft1.py")
    wait_process(ft1_process, "ft1.py")


    card_out = f"json_dumps/{clean}_overview.json"
    card_cmd = [PY, "src/card1.py",
                "--product", args.product,
                "--clustered_json", "json_dumps/clustered.json",
                "--features_json",  "json_dumps/features_clustered.json",
                "--output", card_out]
    
    print("🚀  Running card1.py …")
    card_process = launch(card_cmd, "card1.py")
    wait_process(card_process, "card1.py")

    buzz_cmd = [PY, "src/card2.py",
            "--product", args.product,
            "--reddit", str(reddit_file),
            "--youtube", str(yt_file),
            "--comments", str(combined),
            "--features_json", "json_dumps/features_clustered.json",
            "--summary_out", f"json_dumps/{clean}_summary.json",
            "--pie_out", f"json_dumps/{clean}_buzz_pie.json"]
    
    print("🚀  Running card2.py …")
    buzz_process = launch(buzz_cmd, "card2.py")
    wait_process(buzz_process, "card2.py")

    graph_cmd = [PY, "src/card4.py",
            "--comments", str(combined),
            "--since", args.since,
            "--output", f"json_dumps/{clean}_sentiment_timeline.json"]
    
    print("🚀  Running card4.py …")
    graph_process = launch(graph_cmd, "card4.py")
    wait_process(graph_process, "card4.py")

    heatmap_cmd = [PY, "src/card5.py",
            "--comments", str(combined),
            "--output", f"json_dumps/{clean}_heatmap.json"]
    
    print("🚀  Running card5.py …")
    heatmap_process = launch(heatmap_cmd, "card5.py")
    wait_process(heatmap_process, "card5.py")

    print("🎉  All done!")

if __name__ == "__main__":
    main()
