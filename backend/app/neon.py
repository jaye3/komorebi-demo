import psycopg2

# Optional: tell psycopg2 to cancel the query on Ctrl-C
import psycopg2.extras; psycopg2.extensions.set_wait_callback(psycopg2.extras.wait_select)

import os
from dotenv import load_dotenv
load_dotenv()

DATABASE_URL=os.getenv("URL_DATABASE")
conn_str = psycopg2.connect(DATABASE_URL)
# conn_str = f"dbname={os.getenv('PROJECT')} user={os.getenv('USERNAME')} password={os.getenv('PASSWORD')} host={os.getenv('HOST')} port={os.getenv('DB_PORT')} sslmode=require"

import psycopg2
conn = psycopg2.connect(conn_str)

with conn.cursor() as cur:
    cur.execute("SELECT 'hello neon';")
    print(cur.fetchall())

 