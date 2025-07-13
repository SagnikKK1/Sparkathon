#!/usr/bin/env python3
"""
card6.py — Generates comment frequency heatmap data and inserts it into the card6 table.
"""

import argparse
import json
import os
from pathlib import Path
from datetime import datetime
import psycopg2
from dotenv import load_dotenv

# ── Week label helper ──────────────────────────────────────
def week_of_month(dt: datetime) -> int:
    """Returns 1 to 5 for the week of the month"""
    return min((dt.day - 1) // 7 + 1, 5)

# ── Parsing merged comments ─────────────────────────────────
def parse_timestamped_comments(file_path: str):
    data = Path(file_path).read_text(encoding="utf-8").strip()
    lines = data.split("\n")

    timestamp_fmt = "%Y-%m-%dT%H:%M:%SZ"
    week_counts = {}

    i = 0
    while i < len(lines):
        line = lines[i].strip()
        try:
            ts = datetime.strptime(line, timestamp_fmt)
            week = week_of_month(ts)
            label = f"Week {week} {ts.strftime('%b')} {ts.year}"
            week_counts[label] = week_counts.get(label, 0) + 1
            i += 2  # Skip comment text line as well
        except Exception:
            i += 1  # Not a timestamp
    return week_counts

# ── Insert into database ────────────────────────────────────
def insert_card6_data(data_json):
    # Load environment variables from .env (if present)
    load_dotenv()
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        raise RuntimeError("DATABASE_URL not set in environment variables or .env file.")

    # Connect to the database
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    now = datetime.utcnow()
    insert_query = """
        INSERT INTO card6 (id, data, created_at, updated_at)
        VALUES (gen_random_uuid(), %s, %s, %s)
    """
    cur.execute(insert_query, (json.dumps(data_json), now, now))
    conn.commit()
    cur.close()
    conn.close()
    print("✅ Heatmap JSON inserted into card6 table.")

# ── CLI entrypoint ──────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--comments", required=True, help="Path to merged comments file")
    args = parser.parse_args()

    week_counts = parse_timestamped_comments(args.comments)
    insert_card6_data(week_counts)

if __name__ == "__main__":
    main()
