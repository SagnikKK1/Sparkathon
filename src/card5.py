#!/usr/bin/env python3
"""
card5.py — Generates comment frequency heatmap data
Output JSON format:
{
  "Week 1 Jul 2025": 123,
  "Week 2 Jul 2025": 302,
  ...
}
"""

import argparse
import json
from pathlib import Path
from datetime import datetime

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
            # Check if it's a timestamp
            ts = datetime.strptime(line, timestamp_fmt)
            week = week_of_month(ts)
            label = f"Week {week} {ts.strftime('%b')} {ts.year}"
            week_counts[label] = week_counts.get(label, 0) + 1
            i += 2  # Skip comment text line as well
        except Exception:
            i += 1  # In case the line is not a timestamp
    return week_counts

# ── CLI entrypoint ──────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--comments", required=True, help="Path to merged comments file")
    parser.add_argument("--output", default="comment_heatmap.json", help="Output JSON filename")
    args = parser.parse_args()

    week_counts = parse_timestamped_comments(args.comments)
    Path(args.output).write_text(json.dumps(week_counts, indent=2), encoding="utf-8")
    print(f"✅ Heatmap JSON written to {args.output}")

if __name__ == "__main__":
    main()
