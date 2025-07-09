# #!/usr/bin/env python3
# """
# scrape_and_run.py
# -----------------
# Search Reddit for posts about a product, grab their comments
# (OPTIONALLY filter for the product keyword), save them to
# <product>comments.txt, then call ft1.py.

# USAGE
# -----
# python scrape_and_run.py \
#        --product "iPhone 15" \
#        --product_type "mobile phone" \
#        --subreddits "iphone+technology" \
#        --post_limit 200
# """

# import argparse, datetime as dt, os, re, subprocess, sys
# from pathlib import Path
# from typing import List

# try:
#     import praw
# except ImportError:
#     sys.exit("❌  praw not installed – pip install praw")

# ###############################################################################
# # 1 .  FILL IN YOUR APP CREDENTIALS HERE  (or load them from env/.env)
# ###############################################################################
# CLIENT_ID     = "OUwBrtAey0Q62gRas9SSGQ"
# CLIENT_SECRET = "7Ixb0wkCPpnR1vHGas9osU0ADrUnrw"
# USER_AGENT    = "ai-dashboard-script by u/FastLemon8081"
# ###############################################################################

# # --------------------------------------------------------------------------
# def iso_ts(utc_ts: int) -> str:
#     """Return ISO-8601 timestamp string for a UTC epoch value."""
#     return dt.datetime.utcfromtimestamp(utc_ts).isoformat(timespec="seconds") + "Z"


# def write_comments(comments: List[str], product: str) -> Path:
#     """Write comments to <product>comments.txt; return the Path."""
#     clean = re.sub(r"\s+", "", product.lower())
#     outfile = Path(f"{clean}comments.txt").resolve()
#     with outfile.open("w", encoding="utf-8") as f:
#         for ts, body in comments:
#             f.write(f"{ts}\n{body}\n\n")
#     return outfile


# def run_ft1(ft1_path: str, comments_file: Path, product: str, product_type: str):
#     """Call ft1.py with the correct arguments."""
#     cmd = [
#         sys.executable,
#         ft1_path,
#         "--comments", str(comments_file),
#         "--product", product,
#         "--product_type", product_type,
#     ]
#     print("▶️  Running:", " ".join(cmd))
#     subprocess.run(cmd, check=True)


# # --------------------------------------------------------------------------
# def main() -> None:
#     parser = argparse.ArgumentParser(
#         description="Scrape Reddit comments about a product and pass them to ft1.py"
#     )
#     parser.add_argument("--product", required=True, help="Exact product name to search for")
#     parser.add_argument("--product_type", required=True, help="Human-readable product category")
#     parser.add_argument(
#         "--subreddits",
#         default="all",
#         help='Subreddits to search (e.g. "all" or "iphone+technology"). Default: all',
#     )
#     parser.add_argument("--post_limit", type=int, default=10000, help="Number of posts to scan")
#     parser.add_argument("--min_len", type=int, default=20, help="Min comment length to keep")
#     parser.add_argument("--ft1_path", default="ft1.py", help="Path to ft1.py script")
#     args = parser.parse_args()

#     # 1️⃣  Connect to Reddit
#     reddit = praw.Reddit(
#         client_id=CLIENT_ID,
#         client_secret=CLIENT_SECRET,
#         user_agent=USER_AGENT,
#     )

#     # 2️⃣  Search posts
#     print(f"🔍  Searching r/{args.subreddits} for '{args.product}' …")
#     search_results = reddit.subreddit(args.subreddits).search(
#         query=args.product,
#         sort="relevance",
#         time_filter="month",
#         limit=args.post_limit,
#     )

#     # 3️⃣  Collect comments
#     collected: List[tuple[str, str]] = []
#     for post in search_results:
#         post.comments.replace_more(limit=0)
#         for c in post.comments:
#             body = c.body.strip()
#             if len(body) >= args.min_len:
#                 # (Optional) keep only comments that mention the product string
#                 # if args.product.lower() not in body.lower():
#                 #     continue
#                 collected.append((iso_ts(int(c.created_utc)), body))

#     if not collected:
#         sys.exit("⚠️  No comments collected - exiting.")

#     outfile = write_comments(collected, args.product)
#     print(f"✅  Saved {len(collected)} comments → {outfile}")

#     # 4️⃣  Run ft1.py
#     run_ft1(args.ft1_path, outfile, args.product, args.product_type)
#     print("🎉  Done!")


# if __name__ == "__main__":
#     main()

#!/usr/bin/env python3
# """
# scrape_and_run.py
# -----------------
# Search Reddit for posts about a product, grab their comments, save to
# <product>comments.txt, then invoke ft1.py for NLP + LLM filtering.

# Usage example:
# python scrape_and_run.py \
#        --product "iPhone 15" \
#        --product_type "mobile phone" \
#        --subreddits "iphone+technology" \
#        --post_limit 200
# """

# import argparse
# import datetime as dt
# import os
# import re
# import sys
# import time
# from pathlib import Path
# from typing import List, Tuple

# from dotenv import load_dotenv

# # --------------------------------------------------------------------------- #
# # 1.  Third‑party deps
# # --------------------------------------------------------------------------- #
# try:
#     import praw
# except ImportError:  # pragma: no cover
#     sys.exit("❌  praw not installed – pip install praw")

# import subprocess

# # --------------------------------------------------------------------------- #
# # 2.  Config helpers
# # --------------------------------------------------------------------------- #
# load_dotenv()  # pull in .env if present

# CLIENT_ID = os.getenv("REDDIT_CLIENT_ID")
# CLIENT_SECRET = os.getenv("REDDIT_CLIENT_SECRET")
# USER_AGENT = os.getenv("REDDIT_USER_AGENT", "product-hype-script/0.1")

# if not (CLIENT_ID and CLIENT_SECRET):
#     sys.exit(
#         "❌  Set REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET in the environment "
#         "or your .env file."
#     )

# # --------------------------------------------------------------------------- #
# # 3.  Utility functions
# # --------------------------------------------------------------------------- #
# def iso_ts(utc_ts: int) -> str:
#     """Return ISO‑8601 timestamp string for a UTC epoch value."""
#     return (
#         dt.datetime.utcfromtimestamp(utc_ts)
#         .replace(microsecond=0)
#         .isoformat(timespec="seconds")
#         + "Z"
#     )


# def write_comments(comments: List[Tuple[str, str]], product: str) -> Path:
#     """Write comments to <product>comments.txt and return its Path."""
#     clean_product = re.sub(r'\W+', '', product.lower())
#     outfile = Path(f"{clean_product}comments.txt").resolve()
#     with outfile.open("w", encoding="utf-8") as f:
#         for ts, body in comments:
#             f.write(f"{ts}\n{body}\n\n")
#     return outfile


# # --------------------------------------------------------------------------- #
# def run_ft1(
#     ft1_path: str, comments_file: Path, product: str, product_type: str
# ) -> None:
#     """Call ft1.py and raise if it fails."""
#     cmd = [
#         sys.executable,
#         ft1_path,
#         "--comments",
#         str(comments_file),
#         "--product",
#         product,
#         "--product_type",
#         product_type,
#     ]
#     print("▶️  Calling NLP pipeline:\n    ", " ".join(cmd))
#     subprocess.check_call(cmd)


# # --------------------------------------------------------------------------- #
# def main() -> None:
#     parser = argparse.ArgumentParser(
#         description="Scrape Reddit comments about a product and pass them to ft1.py"
#     )
#     parser.add_argument("--product", required=True, help="Exact product name to search")
#     parser.add_argument(
#         "--product_type", required=True, help="Human‑readable product category"
#     )
#     parser.add_argument(
#         "--subreddits",
#         default="all",
#         help='Subreddits to search (e.g. "all" or "iphone+technology").',
#     )
#     parser.add_argument("--post_limit", type=int, default=200, help="Posts to scan")
#     parser.add_argument(
#         "--min_len", type=int, default=20, help="Min comment length to keep"
#     )
#     parser.add_argument("--ft1_path", default="ft1.py", help="Path to ft1.py script")
#     args = parser.parse_args()

#     # 1️⃣  Connect to Reddit
#     reddit = praw.Reddit(
#         client_id=CLIENT_ID, client_secret=CLIENT_SECRET, user_agent=USER_AGENT
#     )

#     # 2️⃣  Search for posts
#     print(f"🔍  Searching r/{args.subreddits} for {args.product!r} …")
#     search_results = reddit.subreddit(args.subreddits).search(
#         query=args.product,
#         sort="relevance",
#         time_filter="month",
#         limit=args.post_limit,
#     )

#     # 3️⃣  Collect comments
#     collected: List[Tuple[str, str]] = []
#     seen_bodies: set[str] = set()

#     for post in search_results:
#         try:
#             post.comments.replace_more(limit=0)
#         except Exception as exc:  # handle rate‑limit w/ back‑off
#             print(f"⏳  Reddit API slow‑down ({exc}); sleeping 5 s")
#             time.sleep(5)
#             continue

#         for c in post.comments:
#             body = c.body.strip()
#             if (
#                 len(body) < args.min_len
#                 or body in ("[removed]", "[deleted]")
#                 or body.lower() in seen_bodies
#             ):
#                 continue

#             collected.append((iso_ts(int(c.created_utc)), body))
#             seen_bodies.add(body.lower())

#     if not collected:
#         sys.exit("⚠️  No comments collected – aborting.")

#     outfile = write_comments(collected, args.product)
#     print(f"✅  Saved {len(collected)} comments → {outfile}")

#     # 4️⃣  Run NLP + LLM pipeline
#     run_ft1(args.ft1_path, outfile, args.product, args.product_type)
#     print("🎉  All done!")


# if __name__ == "__main__":
#     main()


"""
scrape_and_run.py
-----------------
Search Reddit for posts about a product, grab their comments, save to
<product>comments.txt, then invoke ft1.py for NLP + LLM filtering.

Usage example:
python scrape_and_run.py \
       --product "iPhone 15" \
       --product_type "mobile phone" \
       --subreddits "iphone+technology" \
       --post_limit 200 \
       --since 30d
"""

import argparse
import datetime as dt
import os
import re
import sys
import time
from pathlib import Path
from typing import List, Tuple

from dotenv import load_dotenv

# --------------------------------------------------------------------------- #
# 1.  Third‑party deps
# --------------------------------------------------------------------------- #
try:
    import praw
except ImportError:
    sys.exit("❌  praw not installed – pip install praw")

try:
    from dateutil import parser as dtparse
except ImportError:
    sys.exit("❌  python-dateutil not installed – pip install python-dateutil")

import subprocess

# --------------------------------------------------------------------------- #
# 2.  Config helpers
# --------------------------------------------------------------------------- #
load_dotenv()  # pull in .env if present

CLIENT_ID = os.getenv("REDDIT_CLIENT_ID")
CLIENT_SECRET = os.getenv("REDDIT_CLIENT_SECRET")
USER_AGENT = os.getenv("REDDIT_USER_AGENT", "product-hype-script/0.1")

if not (CLIENT_ID and CLIENT_SECRET):
    sys.exit("❌  Set REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET in the environment or .env file.")

# --------------------------------------------------------------------------- #
# 3.  Utility functions
# --------------------------------------------------------------------------- #
def iso_ts(utc_ts: int) -> str:
    """Return ISO‑8601 timestamp string for a UTC epoch value."""
    return (
        dt.datetime.utcfromtimestamp(utc_ts)
        .replace(microsecond=0)
        .isoformat(timespec="seconds")
        + "Z"
    )


def parse_since(arg: str) -> int:
    """
    '--since' → Unix epoch seconds
    * '2024-06-01' → ISO date
    * '30d'        → days ago
    """
    if arg.lower().endswith("d"):
        days = int(arg[:-1])
        ts = time.time() - days * 86400
    else:
        ts = dtparse.parse(arg).timestamp()
    return int(ts)


def write_comments(comments: List[Tuple[str, str]], product: str) -> Path:
    """Write comments to <product>comments.txt and return its Path."""
    clean_product = re.sub(r'\W+', '', product.lower())
    outfile = Path(f"{clean_product}comments.txt").resolve()
    with outfile.open("w", encoding="utf-8") as f:
        for ts, body in comments:
            f.write(f"{ts}\n{body}\n\n")
    return outfile


def run_ft1(
    ft1_path: str, comments_file: Path, product: str, product_type: str
) -> None:
    """Call ft1.py and raise if it fails."""
    cmd = [
        sys.executable,
        ft1_path,
        "--comments",
        str(comments_file),
        "--product",
        product,
        "--product_type",
        product_type,
    ]
    print("▶️  Calling NLP pipeline:\n    ", " ".join(cmd))
    subprocess.check_call(cmd)

# --------------------------------------------------------------------------- #
# 4.  Main
# --------------------------------------------------------------------------- #
def main() -> None:
    parser = argparse.ArgumentParser(
        description="Scrape Reddit comments about a product and pass them to ft1.py"
    )
    parser.add_argument("--product", required=True, help="Exact product name to search")
    parser.add_argument("--product_type", required=True, help="Human‑readable product category")
    parser.add_argument(
        "--subreddits", default="all", help='Subreddits to search (e.g. "all" or "iphone+technology").'
    )
    parser.add_argument("--post_limit", type=int, default=200, help="Posts to scan")
    parser.add_argument("--min_len", type=int, default=20, help="Min comment length to keep")
    parser.add_argument("--ft1_path", default="ft1.py", help="Path to ft1.py script")
    parser.add_argument("--since", default="30d",
                        help="Time window. ISO date (YYYY‑MM‑DD) or 'Xd' for X‑days‑ago. Default: 30d")

    args = parser.parse_args()
    since_ts = parse_since(args.since)
    print(f"🗓️  Collecting comments newer than {iso_ts(since_ts)}")

    # 1️⃣  Connect to Reddit
    reddit = praw.Reddit(
        client_id=CLIENT_ID,
        client_secret=CLIENT_SECRET,
        user_agent=USER_AGENT
    )

    # 2️⃣  Search for posts
    print(f"🔍  Searching r/{args.subreddits} for {args.product!r} …")
    search_results = reddit.subreddit(args.subreddits).search(
        query=args.product,
        sort="relevance",
        time_filter="month",
        limit=args.post_limit,
    )

    # 3️⃣  Collect comments
    collected: List[Tuple[str, str]] = []
    seen_bodies: set[str] = set()

    for post in search_results:
        if post.created_utc < since_ts:
            continue  # post is too old

        try:
            post.comments.replace_more(limit=0)
        except Exception as exc:
            print(f"⏳  Reddit API slow‑down ({exc}); sleeping 5 s")
            time.sleep(5)
            continue

        for c in post.comments:
            if c.created_utc < since_ts:
                continue  # comment too old
            body = c.body.strip()
            if (
                len(body) < args.min_len
                or body in ("[removed]", "[deleted]")
                or body.lower() in seen_bodies
            ):
                continue

            collected.append((iso_ts(int(c.created_utc)), body))
            seen_bodies.add(body.lower())

    if not collected:
        sys.exit("⚠️  No comments collected – aborting.")

    outfile = write_comments(collected, args.product)
    print(f"✅  Saved {len(collected)} comments → {outfile}")

    # 4️⃣  Run NLP + LLM pipeline
    run_ft1(args.ft1_path, outfile, args.product, args.product_type)
    print("🎉  All done!")


if __name__ == "__main__":
    main()
