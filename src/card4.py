import argparse
import json
from pathlib import Path
from datetime import datetime
from collections import defaultdict
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

# -----------------------------
# Helper Functions
# -----------------------------
def week_of_month(dt):
    return min((dt.day - 1) // 7 + 1, 5)


def parse_timestamp(line):
    try:
        return datetime.strptime(line.strip(), "%Y-%m-%dT%H:%M:%SZ")
    except ValueError:
        return None

def compute_sentiment_over_time(comment_lines, group_by_month=False):
    analyzer = SentimentIntensityAnalyzer()
    grouped = defaultdict(list)

    i = 0
    while i < len(comment_lines) - 1:
        timestamp = parse_timestamp(comment_lines[i])
        text = comment_lines[i+1].strip()
        if timestamp and text:
            sentiment = analyzer.polarity_scores(text)['compound']
            if group_by_month:
                group_key = timestamp.strftime("%b %Y")  # e.g., "Jul 2025"
            else:
                week = week_of_month(timestamp)
                group_key = f"Week {week} {timestamp.strftime('%b %Y')}"
            grouped[(timestamp, group_key)].append(sentiment)
        i += 2

    # Sort by timestamp
    sorted_groups = sorted(grouped.items(), key=lambda x: x[0][0])
    final = {group: round(sum(scores)/len(scores)*5 + 5, 2) for (_, group), scores in sorted_groups}
    return final

# from datetime import datetime

def get_since_duration_in_months(since_str: str) -> float:
    """
    Converts either:
      - a relative duration (e.g., '30d', '2m') → months
      - or an absolute date (e.g., '2024-06-01') → months from then to today
    """
    since_str = since_str.strip().lower()

    if since_str.endswith('d'):
        num = int(since_str[:-1])
        return round(num / 30, 2)
    elif since_str.endswith('m'):
        num = int(since_str[:-1])
        return float(num)
    else:
        try:
            since_date = datetime.strptime(since_str, "%Y-%m-%d")
            today = datetime.utcnow()
            delta_days = (today - since_date).days
            return round(delta_days / 30, 2)
        except ValueError:
            raise ValueError(f"Invalid --since value: {since_str}. Expected '30d', '2m', or 'YYYY-MM-DD'.")


# -----------------------------
# Main
# -----------------------------
def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--comments', required=True)
    parser.add_argument('--since', default='30d')
    parser.add_argument('--output', default='sentiment_over_time.json')
    args = parser.parse_args()

    lines = Path(args.comments).read_text(encoding='utf-8').splitlines()
    months = get_since_duration_in_months(args.since)
    group_by_month = months > 2

    result = compute_sentiment_over_time(lines, group_by_month=group_by_month)
    Path(args.output).write_text(json.dumps(result, indent=2), encoding='utf-8')
    print(f"✅ Sentiment vs Time JSON saved → {args.output}")

if __name__ == "__main__":
    main()
