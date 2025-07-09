# # Create the YouTube version of scrape_and_run.py with argparse and call to ft1.py

# from pathlib import Path
# import argparse, datetime as dt, os, re, subprocess, sys
# from typing import List, Tuple

# try:
#     from googleapiclient.discovery import build
#     from googleapiclient.errors import HttpError
# except ImportError:
#     sys.exit("❌  google-api-python-client not installed – pip install google-api-python-client")

# try:
#     from dotenv import load_dotenv
#     load_dotenv()
# except ImportError:
#     pass

# # --------------------------------------------------------------------------
# # Load API key from env or hardcode here
# YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY", "YOUR_YOUTUBE_API_KEY_HERE")

# if YOUTUBE_API_KEY == "YOUR_YOUTUBE_API_KEY_HERE":
#     sys.exit("❌  Please set YOUTUBE_API_KEY in .env or directly in the script.")

# youtube = build("youtube", "v3", developerKey=YOUTUBE_API_KEY)

# # --------------------------------------------------------------------------
# def iso_ts(iso_string: str) -> str:
#     """Convert YouTube ISO date to standard ISO format."""
#     return dt.datetime.fromisoformat(iso_string.replace("Z", "")).isoformat(timespec="seconds") + "Z"


# def write_comments(comments: List[Tuple[str, str]], product: str) -> Path:
#     """Write comments to <product>youtube_comments.txt; return the Path."""
#     clean = re.sub(r"\s+", "", product.lower())
#     outfile = Path(f"{clean}youtube_comments.txt").resolve()
#     with outfile.open("w", encoding="utf-8") as f:
#         for ts, body in comments:
#             f.write(f"{ts}\n{body.strip()}\n\n")
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
# def get_comments_from_video(video_id: str, min_len: int) -> List[Tuple[str, str]]:
#     comments = []
#     try:
#         request = youtube.commentThreads().list(
#             part="snippet",
#             videoId=video_id,
#             maxResults=100,
#             textFormat="plainText",
#         )
#         response = request.execute()
#     except HttpError as e:
#         if hasattr(e, 'resp') and e.resp.status == 403 and 'commentsDisabled' in str(e):
#             print(f"⚠️  Comments are disabled for video: https://youtube.com/watch?v={video_id} (skipping)")
#             return comments
#         else:
#             raise

#     while response:
#         for item in response["items"]:
#             snippet = item["snippet"]["topLevelComment"]["snippet"]
#             text = snippet["textDisplay"].strip()
#             if len(text) >= min_len:
#                 timestamp = iso_ts(snippet["publishedAt"])
#                 comments.append((timestamp, text))

#         if "nextPageToken" in response:
#             response = youtube.commentThreads().list(
#                 part="snippet",
#                 videoId=video_id,
#                 maxResults=100,
#                 textFormat="plainText",
#                 pageToken=response["nextPageToken"]
#             ).execute()
#         else:
#             break

#     return comments


# def main():
#     parser = argparse.ArgumentParser(
#         description="Scrape YouTube comments about a product and pass them to ft1.py"
#     )
#     parser.add_argument("--product", required=True, help="Exact product name to search for")
#     parser.add_argument("--product_type", required=True, help="Human-readable product category")
#     parser.add_argument("--video_limit", type=int, default=10, help="Number of videos to scan")
#     parser.add_argument("--min_len", type=int, default=20, help="Min comment length to keep")
#     parser.add_argument("--ft1_path", default="ft1.py", help="Path to ft1.py script")
#     args = parser.parse_args()

#     # 🔍 Search for YouTube videos
#     print(f"🔍 Searching YouTube for '{args.product}'…")
#     search_response = youtube.search().list(
#         q=args.product,
#         type="video",
#         part="id,snippet",
#         maxResults=args.video_limit
#     ).execute()

#     video_ids = [item['id']['videoId'] for item in search_response['items']]
#     all_comments = []

#     for vid in video_ids:
#         print(f"📺 Fetching comments from: https://youtube.com/watch?v={vid}")
#         video_comments = get_comments_from_video(vid, args.min_len)
#         all_comments.extend(video_comments)

#     if not all_comments:
#         sys.exit("⚠️  No comments collected - exiting.")

#     outfile = write_comments(all_comments, args.product)
#     print(f"✅ Saved {len(all_comments)} comments → {outfile}")

#     # 🚀 Run ft1.py
#     run_ft1(args.ft1_path, outfile, args.product, args.product_type)
#     print("🎉 Done!")


# if __name__ == "__main__":
#     main()


#!/usr/bin/env python3
"""
scrape_and_run_youtube.py
-------------------------
Search YouTube videos about a product, grab their comments (optionally
restricted to a time window), save them to <product>youtube_comments.txt,
then invoke ft1.py for NLP + LLM filtering.

Examples
--------
# Last 30 days (default)
python scrape_and_run_youtube.py --product "iPhone 15" --product_type "mobile phone"

# Since 1 June 2024
python scrape_and_run_youtube.py --product "iPhone 15" --product_type "mobile phone" --since 2024-06-01 --video_limit 20
"""

from pathlib import Path
import argparse, datetime as dt, os, re, subprocess, sys, time
from typing import List, Tuple

# --------------------------------------------------------------------------- #
# 1.  Third‑party deps
# --------------------------------------------------------------------------- #
try:
    from googleapiclient.discovery import build
    from googleapiclient.errors import HttpError
except ImportError:
    sys.exit("❌  google-api-python-client not installed – pip install google-api-python-client")

try:
    from dateutil import parser as dtparse           # pip install python-dateutil
except ImportError:
    sys.exit("❌  python-dateutil not installed – pip install python-dateutil")

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# --------------------------------------------------------------------------- #
# 2.  API key
# --------------------------------------------------------------------------- #
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY", "YOUR_YOUTUBE_API_KEY_HERE")
if YOUTUBE_API_KEY == "YOUR_YOUTUBE_API_KEY_HERE":
    sys.exit("❌  Set YOUTUBE_API_KEY in .env or directly in the script.")

youtube = build("youtube", "v3", developerKey=YOUTUBE_API_KEY)

# --------------------------------------------------------------------------- #
# 3.  Helpers
# --------------------------------------------------------------------------- #
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

def iso_ts(iso_string: str) -> str:
    """Convert YouTube ISO date to ISO‑8601 seconds + Z."""
    return (
        dt.datetime.fromisoformat(iso_string.replace("Z", ""))
        .replace(microsecond=0)
        .isoformat(timespec="seconds")
        + "Z"
    )

def write_comments(comments: List[Tuple[str, str]], product: str) -> Path:
    clean = re.sub(r"\W+", "", product.lower())
    outfile = Path(f"{clean}youtube_comments.txt").resolve()
    with outfile.open("w", encoding="utf-8") as f:
        for ts, body in comments:
            f.write(f"{ts}\n{body.strip()}\n\n")
    return outfile

def run_ft1(ft1_path: str, comments_file: Path, product: str, product_type: str):
    cmd = [
        sys.executable,
        ft1_path,
        "--comments", str(comments_file),
        "--product", product,
        "--product_type", product_type,
    ]
    print("▶️  Running:", " ".join(cmd))
    subprocess.run(cmd, check=True)

# --------------------------------------------------------------------------- #
def get_comments_from_video(video_id: str, min_len: int, since_ts: int) -> List[Tuple[str, str]]:
    comments = []
    try:
        request = youtube.commentThreads().list(
            part="snippet",
            videoId=video_id,
            maxResults=100,
            textFormat="plainText",
        )
        response = request.execute()
    except HttpError as e:
        if hasattr(e, 'resp') and e.resp.status == 403 and 'commentsDisabled' in str(e):
            print(f"⚠️  Comments disabled for https://youtube.com/watch?v={video_id} (skipping)")
            return comments
        raise

    while response:
        for item in response["items"]:
            snippet = item["snippet"]["topLevelComment"]["snippet"]
            text = snippet["textDisplay"].strip()
            if len(text) < min_len:
                continue

            ts_iso = snippet["publishedAt"]
            ts_epoch = dtparse.isoparse(ts_iso).timestamp()
            if ts_epoch < since_ts:
                continue  # comment too old

            comments.append((iso_ts(ts_iso), text))

        if "nextPageToken" in response:
            response = youtube.commentThreads().list(
                part="snippet",
                videoId=video_id,
                maxResults=100,
                textFormat="plainText",
                pageToken=response["nextPageToken"]
            ).execute()
        else:
            break

    return comments

# --------------------------------------------------------------------------- #
def main():
    p = argparse.ArgumentParser(description="Scrape YouTube comments and send to ft1.py")
    p.add_argument("--product", required=True)
    p.add_argument("--product_type", required=True)
    p.add_argument("--video_limit", type=int, default=10)
    p.add_argument("--min_len", type=int, default=20)
    p.add_argument("--ft1_path", default="ft1.py")
    p.add_argument("--since", default="30d",
                   help="ISO date (YYYY‑MM‑DD) or 'Xd' for X‑days‑ago. Default 30d")
    args = p.parse_args()

    since_ts = parse_since(args.since)
    since_iso_for_api = dt.datetime.utcfromtimestamp(since_ts).isoformat("T") + "Z"
    print(f"🗓️  Collecting comments newer than {iso_ts(since_iso_for_api)}")

    # 🔍 Search for recent videos
    print(f"🔍 Searching YouTube for '{args.product}' …")
    search_response = youtube.search().list(
        q=args.product,
        type="video",
        part="id",
        maxResults=args.video_limit,
        publishedAfter=since_iso_for_api   # video-level filter
    ).execute()

    video_ids = [item['id']['videoId'] for item in search_response.get('items', [])]
    if not video_ids:
        sys.exit("⚠️  No videos found in that time window.")

    all_comments = []
    for vid in video_ids:
        print(f"📺 Fetching comments from https://youtube.com/watch?v={vid}")
        video_comments = get_comments_from_video(vid, args.min_len, since_ts)
        all_comments.extend(video_comments)

    if not all_comments:
        sys.exit("⚠️  No comments collected – aborting.")

    outfile = write_comments(all_comments, args.product)
    print(f"✅  Saved {len(all_comments)} comments → {outfile}")

    run_ft1(args.ft1_path, outfile, args.product, args.product_type)
    print("🎉  Done!")

# --------------------------------------------------------------------------- #
if __name__ == "__main__":
    main()
