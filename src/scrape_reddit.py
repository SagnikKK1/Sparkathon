#!/usr/bin/env python3
"""
scrape_reddit.py
----------------
Fetch Reddit comments mentioning a product.
Subreddits are auto-discovered (top-5 most relevant) unless you pass --subreddits.
"""

import argparse, datetime as dt, os, re, sys, time
from pathlib import Path
from typing import List, Tuple

from dotenv import load_dotenv
load_dotenv()

try:
    import praw
except ImportError:
    sys.exit("❌  pip install praw")

try:
    from dateutil import parser as dtparse
except ImportError:
    sys.exit("❌  pip install python-dateutil")

CLIENT_ID = os.getenv("REDDIT_CLIENT_ID")
CLIENT_SECRET = os.getenv("REDDIT_CLIENT_SECRET")
USER_AGENT = os.getenv("REDDIT_USER_AGENT", "product-hype-script/0.1")
if not (CLIENT_ID and CLIENT_SECRET):
    sys.exit("❌  missing Reddit creds in env (.env)")

# ────────────────────────────────────────────────────────────────────────────
def iso_ts(utc: int) -> str:
    return dt.datetime.utcfromtimestamp(utc).isoformat(timespec="seconds") + "Z"

def parse_since(arg: str) -> int:
    if arg.lower().endswith("d"):
        return int(time.time() - int(arg[:-1]) * 86_400)
    return int(dtparse.parse(arg).timestamp())

def write_comments(comments: List[Tuple[str, str]], outfile: Path):
    outfile.parent.mkdir(parents=True, exist_ok=True)
    with outfile.open("w", encoding="utf-8") as f:
        for ts, body in comments:
            f.write(f"{ts}\n{body}\n\n")

# ────────────────────────────────────────────────────────────────────────────
def infer_subreddits(product: str, reddit, limit: int = 5) -> str:
    """Return a '+'-joined string of top subreddits relevant to product."""
    hits = list(reddit.subreddits.search(query=product, limit=limit * 5))
    hits = sorted(hits, key=lambda s: s.subscribers, reverse=True)

    chosen = []
    for sub in hits:
        if sub.over18:                # skip NSFW
            continue
        if sub.subscribers < 5_000:   # skip tiny subs
            continue
        if "ask" in sub.display_name.lower():  # skip generic Q&A
            continue
        chosen.append(sub.display_name)
        if len(chosen) >= limit:
            break
    if not chosen:
        return "all"
    print(f"🔎  Auto-selected subreddits: {', '.join(chosen)}")
    return "+".join(chosen)

# ────────────────────────────────────────────────────────────────────────────
def main():
    p = argparse.ArgumentParser(description="Scrape Reddit comments into a txt file")
    p.add_argument("--product", required=True)
    p.add_argument("--product_type", required=True)
    p.add_argument("--subreddits", default=None,
                   help="Optional custom subreddit list (e.g. iphone+technology). "
                        "If omitted, top 5 relevant subs are auto‑detected.")
    p.add_argument("--post_limit", type=int, default=200)
    p.add_argument("--min_len", type=int, default=20)
    p.add_argument("--since", default="30d")
    p.add_argument("--outfile", default=None,
                   help="Path for comments txt (default <cleanproduct>_reddit.txt)")
    args = p.parse_args()

    since_ts = parse_since(args.since)
    clean = re.sub(r"\W+", "", args.product.lower())
    outfile = Path(args.outfile or f"txt_dumps/{clean}_reddit_comments.txt").resolve()

    reddit = praw.Reddit(client_id=CLIENT_ID,
                         client_secret=CLIENT_SECRET,
                         user_agent=USER_AGENT)

    subs = args.subreddits or infer_subreddits(args.product, reddit, limit=5)
    print(f"🔍  Searching r/{subs} posts mentioning '{args.product}' …")

    search = reddit.subreddit(subs).search(
        query=args.product,
        sort="relevance",
        time_filter="month",
        limit=args.post_limit,
    )

    collected, seen = [], set()
    for post in search:
        if post.created_utc < since_ts:
            continue
        try:
            post.comments.replace_more(limit=0)
        except Exception as e:
            print("⏳  API slow-down:", e)
            time.sleep(5)
            continue
        for c in post.comments:
            if c.created_utc < since_ts:
                continue
            body = c.body.strip()
            if len(body) < args.min_len or body in ("[removed]", "[deleted]"):
                continue
            low = body.lower()
            if low in seen:
                continue
            seen.add(low)
            collected.append((iso_ts(int(c.created_utc)), body))

    if not collected:
        sys.exit("⚠️  Reddit: no comments collected.")

    write_comments(collected, outfile)
    print(f"✅  Reddit: {len(collected)} comments → {outfile}")

    # After all processing and writing output:
    # done_marker = str(outfile) + "_done.txt"
    # open(done_marker, 'w').close()

if __name__ == "__main__":
    main()
