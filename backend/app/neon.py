import psycopg2

# Optional: tell psycopg2 to cancel the query on Ctrl-C
import psycopg2.extras; psycopg2.extensions.set_wait_callback(psycopg2.extras.wait_select)

#can delete later
# You can set the password to None if it is specified in a ~/.pgpass file
USERNAME = "neondb_owner"
PASSWORD = "npg_Ftx32aYzgWAD"
HOST = "ep-divine-art-a9jdtdj7-pooler.gwc.azure.neon.tech"  # Removed @
PORT = "5432"
PROJECT = "komorebi"

conn_str = f"dbname={PROJECT} user={USERNAME} password={PASSWORD} host={HOST} port={PORT} sslmode=require"

import psycopg2
conn = psycopg2.connect(conn_str)

with conn.cursor() as cur:
    cur.execute("SELECT 'hello neon';")
    print(cur.fetchall())

 