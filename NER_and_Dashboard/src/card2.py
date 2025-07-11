#!/usr/bin/env python3
"""
card_overview.py
----------------
Calculates and pushes the overview card JSON directly to the card3 table in PostgreSQL.
Updates pipeline_statuses with card3 data and sets pipeline_success.
"""
import argparse, json, pathlib, os, sys, asyncio
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

def weighted_product_sent(clustered: dict) -> float:
    total, weighted = 0, 0.0
    for v in clustered.values():
        cnt = v["count"]
        total   += cnt
        weighted += cnt * v["avg_sentiment"]
    return weighted / total if total else 0.0

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

async def update_pipeline_status_card3(conn, card_data: dict) -> bool:
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("SELECT id FROM pipeline_statuses ORDER BY created_at DESC LIMIT 1")
            latest_status = cur.fetchone()
            card_json = json.dumps(card_data)
            now = datetime.now()
            if latest_status:
                cur.execute("""
                    UPDATE pipeline_statuses
                    SET card3 = %s,
                        pipeline_success = TRUE,
                        pipeline_message = %s,
                        updated_at = %s
                    WHERE id = %s
                """, (card_json, "Card 3 (Overview) generated successfully", now, latest_status['id']))
                conn.commit()
                print(f"✅  Pipeline status updated with card3 data")
            else:
                pipeline_id = str(uuid.uuid4())
                cur.execute("""
                    INSERT INTO pipeline_statuses (id, pipeline_success, pipeline_message, card3, created_at, updated_at)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, (pipeline_id, True, 'Card 3 (Overview) generated successfully', card_json, now, now))
                conn.commit()
                print(f"✅  New pipeline status created with card3 data")
            return True
    except Exception as e:
        conn.rollback()
        print(f"❌  Pipeline status update error (card3): {e}")
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
            # Insert into card3 table
            cur.execute("""
                INSERT INTO card3 (id, data, created_at, updated_at) 
                VALUES (%s, %s, %s, %s)
            """, (card_id, card_json, now, now))
            conn.commit()
            print(f"✅  Overview card data saved to card3 table")
            await update_pipeline_status_card3(conn, card_data)
            return True
    except Exception as e:
        conn.rollback()
        print(f"❌  Database error: {e}")
        return False
    finally:
        conn.close()

async def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--product", required=True)
    ap.add_argument("--clustered_json",  default="../json_dumps/clustered.json")
    ap.add_argument("--features_json",   default="../json_dumps/features_clustered.json")
    ap.add_argument("--top", type=int,   default=5)
    ap.add_argument("--no-database", action="store_true", help="Skip database upload")
    args = ap.parse_args()

    clustered = json.loads(pathlib.Path(args.clustered_json).read_text(encoding="utf-8"))
    features  = json.loads(pathlib.Path(args.features_json).read_text(encoding="utf-8"))

    # Calculate overall and feature scores
    overall_sent   = weighted_product_sent(clustered)
    overall_score  = sentiment_to_score(overall_sent)
    top_feats = sorted(
        features.items(),
        key=lambda kv: (-kv[1].get("relevance", 0.0), -kv[1]["count"])
    )[: args.top]
    card = {args.product: overall_score}
    for name, data in top_feats:
        card[name] = sentiment_to_score(data["avg_sentiment"])

    if not args.no_database:
        await save_to_database(card)

if __name__ == "__main__":
    asyncio.run(main())
