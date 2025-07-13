import os
import uuid
from datetime import datetime
from dotenv import load_dotenv
import psycopg2

# Load environment variables from .env file
load_dotenv()

# Get the database URL from environment variable
DB_URL = os.getenv('DATABASE_URL')

def insert_report(file_path, table_name):
    """Insert the contents of a text file into the specified table."""
    with open(file_path, 'r', encoding='utf-8') as file:
        text_data = file.read()
    try:
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()
        now = datetime.utcnow()
        insert_query = f'''
            INSERT INTO {table_name} (id, data, created_at, updated_at)
            VALUES (%s, %s, %s, %s)
        '''
        cur.execute(insert_query, (
            str(uuid.uuid4()),
            text_data,
            now,
            now
        ))
        conn.commit()
        cur.close()
        conn.close()
        print(f"Data from {file_path} inserted into {table_name}.")
    except Exception as e:
        print(f"Error inserting data into {table_name}: {e}")

if __name__ == "__main__":
    insert_report('../before_cleaning_report.txt', 'prereport')
    insert_report('../product_report.txt', 'cleanedreport')
