import argparse
import json
from pathlib import Path
from datetime import datetime
from collections import defaultdict
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import os
import uuid
from dotenv import load_dotenv

load_dotenv()

try:
    import psycopg2
    from psycopg2.extras import RealDictCursor
except ImportError:
    import sys
    sys.exit("❌  pip install psycopg2-binary")

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

def get_since_duration_in_months(since_str: str) -> float:
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

def get_db_connection():
    database_url = os.getenv('DATABASE_URL')
    if not database_url:
        print("❌  DATABASE_URL environment variable not found")
        return None
    return psycopg2.connect(database_url)

async def update_pipeline_status(conn, card_data: dict) -> bool:
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("SELECT id FROM pipeline_statuses ORDER BY created_at DESC LIMIT 1")
            latest_status = cur.fetchone()
            card_json = json.dumps(card_data)
            now = datetime.now()
            if latest_status:
                cur.execute("""
                    UPDATE pipeline_statuses
                    SET card4 = %s,
                        pipeline_success = TRUE,
                        pipeline_message = %s,
                        updated_at = %s
                    WHERE id = %s
                """, (card_json, "Card 4 (Sentiment Over Time) generated successfully", now, latest_status['id']))
                conn.commit()
                print(f"✅  Pipeline status updated with card4 data")
            else:
                pipeline_id = str(uuid.uuid4())
                cur.execute("""
                    INSERT INTO pipeline_statuses (id, pipeline_success, pipeline_message, card4, created_at, updated_at)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, (pipeline_id, True, 'Card 4 (Sentiment Over Time) generated successfully', card_json, now, now))
                conn.commit()
                print(f"✅  New pipeline status created with card4 data")
            return True
    except Exception as e:
        conn.rollback()
        print(f"❌  Pipeline status update error (card4): {e}")
        return False

async def save_to_database(card_data: dict) -> bool:
    conn = get_db_connection()
    if not conn:
        return False
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            card_json = json.dumps(card_data)
            card_id = str(uuid.uuid4())
            now = datetime.now()
            # Insert into card4 table
            cur.execute("""
                INSERT INTO card4 (id, data, created_at, updated_at) 
                VALUES (%s, %s, %s, %s)
            """, (card_id, card_json, now, now))
            conn.commit()
            print(f"✅  Sentiment-over-time data saved to card4 table")
            # Update pipeline status
            import asyncio
            await update_pipeline_status(conn, card_data)
            return True
    except Exception as e:
        conn.rollback()
        print(f"❌  Database error: {e}")
        return False
    finally:
        conn.close()

# -----------------------------
# Main
# -----------------------------
import asyncio

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--comments', required=True)
    parser.add_argument('--since', default='30d')
    args = parser.parse_args()

    lines = Path(args.comments).read_text(encoding='utf-8').splitlines()
    months = get_since_duration_in_months(args.since)
    group_by_month = months > 2

    result = compute_sentiment_over_time(lines, group_by_month=group_by_month)
    # Save to database instead of file
    asyncio.run(save_to_database(result))

if __name__ == "__main__":
    main()
