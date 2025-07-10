#!/usr/bin/env python3
"""
card_overview.py
----------------
Outputs a single JSON object of "score-out-of-10" values:
{
  "": 7.88,
  "": 8.40,
  "": 6.25,
  ...
}
•  Overall product score  = sentiment-weighted mean from clustered.json → 0-10 scale
•  Feature scores         = avg_sentiment from features_clustered.json → 0-10 scale
•  Features ranked by relevance (desc), then by count
"""
import argparse, json, pathlib, os, sys, asyncio
from dotenv import load_dotenv
import uuid
from datetime import datetime
load_dotenv()

# Import psycopg2
try:
    import psycopg2
    from psycopg2.extras import RealDictCursor
    import psycopg2.extras
except ImportError:
    sys.exit("❌  pip install psycopg2-binary")

# ────────────────────────────────────────────────────────────────────────────
def sentiment_to_score(s: float) -> float:
    """Convert [-1,1] sentiment to a [0,10] dashboard score."""
    return round((s + 1) * 5, 2)

def weighted_product_sent(clustered: dict) -> float:
    total, weighted = 0, 0.0
    for v in clustered.values():
        cnt = v["count"]
        total   += cnt
        weighted += cnt * v["avg_sentiment"]
    return weighted / total if total else 0.0

def get_db_connection():
    """Get database connection from DATABASE_URL environment variable."""
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

async def save_to_database(card_data: dict, card_number: int = 1) -> bool:
    """Save card data to database using psycopg2."""
    conn = get_db_connection()
    if not conn:
        return False
    
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            # Convert dict to JSON string
            card_json = json.dumps(card_data)
            card_id = str(uuid.uuid4())
            now = datetime.now()
            
            # Save to individual card table
            if card_number == 1:
                cur.execute("""
                    INSERT INTO card1 (id, data, created_at, updated_at) 
                    VALUES (%s, %s, %s, %s)
                """, (card_id, card_json, now, now))
            elif card_number == 2:
                cur.execute("""
                    INSERT INTO card2 (id, data, created_at, updated_at) 
                    VALUES (%s, %s, %s, %s)
                """, (card_id, card_json, now, now))
            elif card_number == 3:
                cur.execute("""
                    INSERT INTO card3 (id, data, created_at, updated_at) 
                    VALUES (%s, %s, %s, %s)
                """, (card_id, card_json, now, now))
            else:
                print(f"❌  Invalid card number: {card_number}")
                return False
            
            conn.commit()
            print(f"✅  Card{card_number} data saved to database")
            
            # Update pipeline status
            await update_pipeline_status(conn, card_data, card_number)
            
            return True
            
    except Exception as e:
        conn.rollback()
        print(f"❌  Database error: {e}")
        return False
    finally:
        conn.close()

async def update_pipeline_status(conn, card_data: dict, card_number: int) -> bool:
    """Update the pipeline status with card data."""
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            # Get the latest pipeline status record
            cur.execute("""
                SELECT id, card1, card2, card3 
                FROM pipeline_statuses 
                ORDER BY created_at DESC 
                LIMIT 1
            """)
            latest_status = cur.fetchone()
            
            card_json = json.dumps(card_data)
            now = datetime.now()
            
            if latest_status:
                # Update existing record
                if card_number == 1:
                    cur.execute("""
                        UPDATE pipeline_statuses 
                        SET card1 = %s, updated_at = %s
                        WHERE id = %s
                    """, (card_json, now, latest_status['id']))
                elif card_number == 2:
                    cur.execute("""
                        UPDATE pipeline_statuses 
                        SET card2 = %s, updated_at = %s
                        WHERE id = %s
                    """, (card_json, now, latest_status['id']))
                elif card_number == 3:
                    cur.execute("""
                        UPDATE pipeline_statuses 
                        SET card3 = %s, updated_at = %s
                        WHERE id = %s
                    """, (card_json, now, latest_status['id']))
                
                conn.commit()
                print(f"✅  Pipeline status updated with card{card_number} data")
            else:
                # Create new record
                pipeline_id = str(uuid.uuid4())
                pipeline_success = True
                pipeline_message = f"Card {card_number} generated successfully"
                
                if card_number == 1:
                    cur.execute("""
                        INSERT INTO pipeline_statuses (id, pipeline_success, pipeline_message, card1, created_at, updated_at)
                        VALUES (%s, %s, %s, %s, %s, %s)
                    """, (pipeline_id, pipeline_success, pipeline_message, card_json, now, now))
                elif card_number == 2:
                    cur.execute("""
                        INSERT INTO pipeline_statuses (id, pipeline_success, pipeline_message, card2, created_at, updated_at)
                        VALUES (%s, %s, %s, %s, %s, %s)
                    """, (pipeline_id, pipeline_success, pipeline_message, card_json, now, now))
                elif card_number == 3:
                    cur.execute("""
                        INSERT INTO pipeline_statuses (id, pipeline_success, pipeline_message, card3, created_at, updated_at)
                        VALUES (%s, %s, %s, %s, %s, %s)
                    """, (pipeline_id, pipeline_success, pipeline_message, card_json, now, now))
                
                conn.commit()
                print(f"✅  New pipeline status created with card{card_number} data")
                
            return True
            
    except Exception as e:
        conn.rollback()
        print(f"❌  Pipeline status update error: {e}")
        return False

# ────────────────────────────────────────────────────────────────────────────
async def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--product", required=True)
    ap.add_argument("--clustered_json",  default="../json_dumps/clustered.json")
    ap.add_argument("--features_json",   default="../json_dumps/features_clustered.json")
    ap.add_argument("--top", type=int,   default=5)
    ap.add_argument("--output",          default="../json_dumps/card_overview.json")
    ap.add_argument("--no-database", action="store_true", help="Skip database upload")
    ap.add_argument("--card-number", type=int, default=1, help="Card number (1-3) for pipeline status")
    args = ap.parse_args()
    
    # Ensure output directory exists
    output_dir = pathlib.Path(args.output).parent
    output_dir.mkdir(parents=True, exist_ok=True)
    
    clustered = json.loads(pathlib.Path(args.clustered_json).read_text(encoding="utf-8"))
    features  = json.loads(pathlib.Path(args.features_json).read_text(encoding="utf-8"))
    
    # 1️⃣  Overall score
    overall_sent   = weighted_product_sent(clustered)
    overall_score  = sentiment_to_score(overall_sent)
    
    # 2️⃣  Top‐N features by relevance then count
    top_feats = sorted(
        features.items(),
        key=lambda kv: (-kv[1].get("relevance", 0.0), -kv[1]["count"])
    )[: args.top]
    
    # 3️⃣  Build output JSON
    card = {args.product: overall_score}
    for name, data in top_feats:
        card[name] = sentiment_to_score(data["avg_sentiment"])
    
    # 4️⃣  Save locally
    pathlib.Path(args.output).write_text(json.dumps(card, indent=2), encoding="utf-8")
    print(f"📊  Overview card JSON → {args.output}")
    
    # 5️⃣  Save to database
    if not args.no_database:
        await save_to_database(card, args.card_number)

# ────────────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    asyncio.run(main())