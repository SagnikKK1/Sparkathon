#!/usr/bin/env python3
"""
run_all.py  -  concurrent orchestrator
Runs scrape_reddit.py & scrape_youtube.py in parallel, then ft1.py, card1.py, and card2.py.
"""
import argparse, os, subprocess, sys, time, codecs, threading
from pathlib import Path
sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer)

PY = sys.executable

def stream_output(pipe, prefix: str):
    for line in iter(pipe.readline, ''):
        if line:
            print(f"{prefix}: {line.rstrip()}", flush=True)

def launch(cmd: list, title: str) -> subprocess.Popen:
    print(f"▶️  Launching {title} …", flush=True)
    env = os.environ.copy()
    env["PYTHONIOENCODING"] = "utf-8"
    env["PYTHONUNBUFFERED"]  = "1"
    if cmd[0] == PY:
        cmd = [PY, "-u"] + cmd[1:]
    return subprocess.Popen(
        cmd,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        encoding="utf-8",
        env=env,
        bufsize=1,
        universal_newlines=True,
    )

def wait_process(p: subprocess.Popen, title: str):
    stdout_thread = threading.Thread(target=stream_output, args=(p.stdout, f"[{title}]"))
    stderr_thread = threading.Thread(target=stream_output, args=(p.stderr, f"[{title}-ERR]"))
    stdout_thread.daemon = True
    stderr_thread.daemon = True
    stdout_thread.start()
    stderr_thread.start()
    returncode = p.wait()
    stdout_thread.join()
    stderr_thread.join()
    if returncode != 0:
        print(f"❌  {title} failed (exit {returncode})")
        sys.exit(returncode)
    print(f"✅  {title} completed successfully")

def launch_in_new_terminal(cmd: list, title: str):
    if sys.platform == "win32":
        cmd_str = " ".join(f'"{c}"' if ' ' in c or c.endswith('.py') else c for c in cmd)
        full_cmd = f'start "{title}" cmd /k "{cmd_str}"'
        return subprocess.Popen(full_cmd, shell=True)
    else:
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
    reddit_file  = Path(f"../txt_dumps/{clean}_reddit_comments.txt")
    yt_file      = Path(f"../txt_dumps/{clean}_youtube_comments.txt")
    combined     = Path(f"../txt_dumps/{clean}_comments.txt")

    reddit_cmd = [
        PY, "scrape_reddit.py",
        "--product", args.product,
        "--product_type", args.product_type,
        "--post_limit", str(args.post_limit),
        "--min_len", str(args.min_len),
        "--since", args.since,
        "--outfile", str(reddit_file),
    ]
    yt_cmd = [
        PY, "scrape_youtube.py",
        "--product", args.product,
        "--product_type", args.product_type,
        "--video_limit", str(args.video_limit),
        "--min_len", str(args.min_len),
        "--since", args.since,
        "--outfile", str(yt_file),
    ]

    print("▶️  Launching Reddit scraper in new terminal…", flush=True)
    p_reddit = launch_in_new_terminal(reddit_cmd, "Reddit scraper")
    print("▶️  Launching YouTube scraper in new terminal…", flush=True)
    p_yt     = launch_in_new_terminal(yt_cmd,     "YouTube scraper")

    reddit_done = str(reddit_file)
    yt_done     = str(yt_file)
    print("⏳  Waiting for both scrapers to finish…", flush=True)
    while not (os.path.exists(reddit_done) and os.path.exists(yt_done)):
        time.sleep(2)

    print("📝  Merging comment files …")
    combined.parent.mkdir(parents=True, exist_ok=True)
    with combined.open("w", encoding="utf-8") as out:
        for src in (reddit_file, yt_file):
            if src.exists():
                out.write(src.read_text(encoding="utf-8"))
                out.write("\n")
    print(f"✅  Combined comments → {combined}")

    ft1_cmd = [
        PY, args.ft1_path,
        "--comments", str(combined),
        "--product", args.product,
        "--product_type", args.product_type,
    ]
    print("🚀  Running ft1.py …")
    ft1_process = launch(ft1_cmd, "ft1.py")
    wait_process(ft1_process, "ft1.py")

    # 5️⃣  Run card1.py (summary and pie to DB only)
    card1_cmd = [
        PY, args.card_path,
        "--product", args.product,
        "--reddit", str(reddit_file),
        "--youtube", str(yt_file),
        "--comments", str(combined),
        "--features_json", "../json_dumps/features_clustered.json"
    ]
    print("🚀  Running card1.py …")
    card1_process = launch(card1_cmd, "card1.py")
    wait_process(card1_process, "card1.py")

    # 6️⃣  Run card2.py (overview to DB only)
    card2_cmd = [
        PY, "card2.py",
        "--product", args.product,
        "--clustered_json", "../json_dumps/clustered.json",
        "--features_json", "../json_dumps/features_clustered.json"
    ]
    print("🚀  Running card2.py …")
    card2_process = launch(card2_cmd, "card2.py")
    wait_process(card2_process, "card2.py")

    card4_cmd = [PY, "card4.py",
            "--comments", str(combined),
            "--since", args.since]
    
    print("🚀  Running card4.py …")
    card4_process = launch(card4_cmd, "card4.py")
    wait_process(card4_process, "card4.py")

    print("🎉  All done!")

if __name__ == "__main__":
    main()
