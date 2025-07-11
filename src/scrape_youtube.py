#!/usr/bin/env python3
"""
scrape_youtube.py  -  Fetch YouTube comments into a txt file.
"""

import argparse, datetime as dt, os, re, sys, time, subprocess
from pathlib import Path
from typing import List, Tuple

try:
    from googleapiclient.discovery import build
    from googleapiclient.errors import HttpError
except ImportError:
    sys.exit("❌  pip install google-api-python-client")
try:
    from dateutil import parser as dtparse
except ImportError:
    sys.exit("❌  pip install python-dateutil")
from dotenv import load_dotenv; load_dotenv()

API_KEY = os.getenv("YOUTUBE_API_KEY")
if not API_KEY:
    sys.exit("❌  set YOUTUBE_API_KEY")

yt = build("youtube", "v3", developerKey=API_KEY)

# ────────────────────────────────────────────────────────────────────────────
def parse_since(arg: str) -> int:
    if arg.lower().endswith("d"):
        return int(time.time() - int(arg[:-1]) * 86_400)
    return int(dtparse.parse(arg).timestamp())

def iso8601(ts_iso: str) -> str:
    return dt.datetime.fromisoformat(ts_iso.replace("Z","")).isoformat(timespec="seconds")+"Z"

def write_comments(comments: List[Tuple[str,str]], outfile: Path):
    outfile.parent.mkdir(exist_ok=True, parents=True)
    with outfile.open("w", encoding="utf-8") as f:
        for ts, txt in comments:
            f.write(f"{ts}\n{txt}\n\n")
    return outfile

def get_comments(video_id: str, min_len: int, since_ts: int):
    out=[]
    try:
        req=yt.commentThreads().list(part="snippet", videoId=video_id, maxResults=100,textFormat="plainText")
        res=req.execute()
    except HttpError as e:
        if e.resp.status==403 and "commentsDisabled" in str(e):
            print("⚠️  comments disabled", video_id); return out
        raise
    while res:
        for item in res["items"]:
            sn=item["snippet"]["topLevelComment"]["snippet"]
            if len((txt:=sn["textDisplay"].strip()))<min_len: continue
            ts=dtparse.isoparse(sn["publishedAt"]).timestamp()
            if ts<since_ts: continue
            out.append((iso8601(sn["publishedAt"]), txt))
        token=res.get("nextPageToken")
        if not token: break
        res=yt.commentThreads().list(part="snippet", videoId=video_id, maxResults=100,
                                     textFormat="plainText", pageToken=token).execute()
    return out

# ────────────────────────────────────────────────────────────────────────────
def main():
    p=argparse.ArgumentParser(description="Scrape YouTube comments into a txt file")
    p.add_argument("--product",required=True); p.add_argument("--product_type",required=True)
    p.add_argument("--video_limit",type=int,default=10)
    p.add_argument("--min_len",type=int,default=20)
    p.add_argument("--since",default="30d")
    p.add_argument("--outfile",default=None)
    args=p.parse_args()

    since_ts=parse_since(args.since)
    since_iso=dt.datetime.utcfromtimestamp(since_ts).isoformat("T")+"Z"
    clean=re.sub(r"\W+","",args.product.lower())
    outfile=Path(args.outfile or f"txt_dumps/{clean}_youtube_comments.txt").resolve()

    print(f"🔍 YouTube search '{args.product}' (since {since_iso}) …")
    search=yt.search().list(q=args.product, type="video", part="id",
                            maxResults=args.video_limit, publishedAfter=since_iso).execute()
    vids=[it["id"]["videoId"] for it in search.get("items",[])]
    if not vids: sys.exit("⚠️  YouTube: no videos found.")
    all_comments=[]
    for vid in vids:
        print("📺", vid)
        all_comments.extend(get_comments(vid,args.min_len,since_ts))
    if not all_comments:
        sys.exit("⚠️  YouTube: no comments collected.")

    write_comments(all_comments,outfile)
    print(f"✅ YouTube: {len(all_comments)} comments → {outfile}")

    # After all processing and writing output:
    # done_marker = str(outfile) + "_done.txt"
    # open(done_marker, 'w').close()

if __name__=="__main__":
    main()
