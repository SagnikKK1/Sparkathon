#!/usr/bin/env python3
"""
buzz_summary.py
---------------
Pushes summary data to card1 and pie data to card2 tables in PostgreSQL.
Updates pipeline_statuses with card1 and card2 data and sets pipeline_success.
"""
import argparse, json, os, sys, asyncio
from pathlib import Path
from dotenv import load_dotenv
import uuid
from datetime import datetime
load_dotenv()

try:
    import psycopg2
    from psycopg2.extras import RealDictCursor
except ImportError:
    sys.exit("❌  pip install psycopg2-binary")

def sentiment_to_score(s: float) -> float:
    return round((s + 1) * 5, 2)

def get_db_connection():
    try:
        database_url = os.getenv('DATABASE_URL')
        if not database_url:
            print("❌  DATABASE_URL environment variable not found")
            return None
        conn = psycopg2.connect(database_url)
        return conn
    except Exception as e:
        print(f"❌  Database connection error: {e}")
        return None

def get_comment_sentiment_stats(comments_file: str):
    try:
        from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
    except ImportError:
        sys.exit("❌  pip install vaderSentiment")
    analyzer = SentimentIntensityAnalyzer()
    comments = Path(comments_file).read_text(encoding="utf-8").split("\n\n")
    pos = neg = neu = total = sent_sum = 0.0
    for txt in comments:
        if not txt.strip():
            continue
        total += 1
        score = analyzer.polarity_scores(txt)["compound"]
        sent_sum += score
        if score >= 0.05:
            pos += 1
        elif score <= -0.05:
            neg += 1
        else:
            neu += 1
    pos_neg_ratio = round(pos / neg, 2) if neg else float("inf")
    avg_sent = round(sent_sum / total, 4) if total else 0.0
    return total, pos, neg, neu, pos_neg_ratio, avg_sent

def compute_feature_buzz(feature_dict, vol_total, rel_total):
    vol_share = feature_dict["count"] / vol_total
    sent_norm = (feature_dict["avg_sentiment"] + 1) / 2
    rel_share = feature_dict.get("relevance", 0.0) / rel_total if rel_total else 0
    return sent_norm * (0.5 * vol_share + 0.5 * rel_share)

async def update_pipeline_status_card1(conn, card_data: dict) -> bool:
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("SELECT id FROM pipeline_statuses ORDER BY created_at DESC LIMIT 1")
            latest_status = cur.fetchone()
            card_json = json.dumps(card_data)
            now = datetime.now()
            if latest_status:
                cur.execute("""
                    UPDATE pipeline_statuses
                    SET card1 = %s,
                        pipeline_success = TRUE,
                        pipeline_message = %s,
                        updated_at = %s
                    WHERE id = %s
                """, (card_json, "Card 1 (Summary) generated successfully", now, latest_status['id']))
                conn.commit()
                print(f"✅  Pipeline status updated with card1 data")
            else:
                pipeline_id = str(uuid.uuid4())
                cur.execute("""
                    INSERT INTO pipeline_statuses (id, pipeline_success, pipeline_message, card1, created_at, updated_at)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, (pipeline_id, True, 'Card 1 (Summary) generated successfully', card_json, now, now))
                conn.commit()
                print(f"✅  New pipeline status created with card1 data")
            return True
    except Exception as e:
        conn.rollback()
        print(f"❌  Pipeline status update error (card1): {e}")
        return False

async def update_pipeline_status_card2(conn, card_data: dict) -> bool:
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("SELECT id FROM pipeline_statuses ORDER BY created_at DESC LIMIT 1")
            latest_status = cur.fetchone()
            card_json = json.dumps(card_data)
            now = datetime.now()
            if latest_status:
                cur.execute("""
                    UPDATE pipeline_statuses
                    SET card2 = %s,
                        pipeline_success = TRUE,
                        pipeline_message = %s,
                        updated_at = %s
                    WHERE id = %s
                """, (card_json, "Card 2 (Buzz Pie) generated successfully", now, latest_status['id']))
                conn.commit()
                print(f"✅  Pipeline status updated with card2 data")
            else:
                pipeline_id = str(uuid.uuid4())
                cur.execute("""
                    INSERT INTO pipeline_statuses (id, pipeline_success, pipeline_message, card2, created_at, updated_at)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, (pipeline_id, True, 'Card 2 (Buzz Pie) generated successfully', card_json, now, now))
                conn.commit()
                print(f"✅  New pipeline status created with card2 data")
            return True
    except Exception as e:
        conn.rollback()
        print(f"❌  Pipeline status update error (card2): {e}")
        return False

async def save_to_database(summary_data: dict, pie_data: dict) -> bool:
    conn = get_db_connection()
    if not conn:
        return False
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            now = datetime.now()
            # Save summary card data to card1
            summary_id = str(uuid.uuid4())
            summary_json = json.dumps({
                'type': 'summary_card',
                'content': summary_data
            })
            cur.execute("""
                INSERT INTO card1 (id, data, created_at, updated_at) 
                VALUES (%s, %s, %s, %s)
            """, (summary_id, summary_json, now, now))
            print(f"✅  Summary card data saved to card1 table")
            await update_pipeline_status_card1(conn, summary_data)

            # Save pie chart data to card2
            pie_id = str(uuid.uuid4())
            pie_json = json.dumps({
                'type': 'buzz_pie',
                'content': pie_data
            })
            cur.execute("""
                INSERT INTO card2 (id, data, created_at, updated_at) 
                VALUES (%s, %s, %s, %s)
            """, (pie_id, pie_json, now, now))
            print(f"✅  Buzz pie data saved to card2 table")
            await update_pipeline_status_card2(conn, pie_data)

            conn.commit()
            return True
    except Exception as e:
        conn.rollback()
        print(f"❌  Database error: {e}")
        return False
    finally:
        conn.close()

def build_summary_card(product: str,
                       reddit_file: str,
                       yt_file: str,
                       comments_file: str,
                       features_json: str):
    reddit_cnt  = len(Path(reddit_file).read_text(encoding="utf-8").split("\n\n")) - 1
    youtube_cnt = len(Path(yt_file).read_text(encoding="utf-8").split("\n\n")) - 1
    total, pos, neg, neu, pn_ratio, avg_sent = get_comment_sentiment_stats(comments_file)
    feats = json.loads(Path(features_json).read_text(encoding="utf-8"))
    vol_total = sum(v["count"] for v in feats.values()) or 1
    rel_total = sum(v["relevance"] for v in feats.values()) or 1
    product_buzz = sum(
        compute_feature_buzz(v, vol_total, rel_total) for v in feats.values()
    )
    product_buzz_score = round(product_buzz * 10, 2)
    return {
        "Buzz Score": product_buzz_score,
        "Reddit Comments Count": reddit_cnt,
        "YouTube Comments Count": youtube_cnt,
        "Total Comments": total,
        "Positive Comments": pos,
        "Negative Comments": neg,
        "Neutral Comments": neu,
        "Positive to Negative Ratio": pn_ratio,
        "Net Sentiment Score": sentiment_to_score(avg_sent)
    }

def build_buzz_pie(features_json: str, top_k=5):
    feats = json.loads(Path(features_json).read_text(encoding="utf-8"))
    vol_total = sum(v["count"] for v in feats.values()) or 1
    rel_total = sum(v["relevance"] for v in feats.values()) or 1
    buzz_vals = {
        name: compute_feature_buzz(v, vol_total, rel_total)
        for name, v in feats.items()
    }
    total_buzz = sum(buzz_vals.values()) or 1
    sorted_feats = sorted(buzz_vals.items(), key=lambda kv: kv[1], reverse=True)
    top_feats = sorted_feats[:top_k]
    other_val = sum(v for _, v in sorted_feats[top_k:])
    pie = {name: round(val / total_buzz, 4) for name, val in top_feats}
    pie["Other Features"] = round(other_val / total_buzz, 4)
    return pie

async def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--product",        required=True)
    ap.add_argument("--reddit",         required=True)
    ap.add_argument("--youtube",        required=True)
    ap.add_argument("--comments",       required=True)
    ap.add_argument("--features_json",  required=True)
    ap.add_argument("--no-database",    action="store_true", help="Skip database upload")
    args = ap.parse_args()

    summary = build_summary_card(
        args.product, args.reddit, args.youtube, args.comments, args.features_json
    )
    pie = build_buzz_pie(args.features_json)

    if not args.no_database:
        await save_to_database(summary, pie)

if __name__ == "__main__":
    asyncio.run(main())
