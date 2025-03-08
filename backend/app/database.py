from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

URL_DATABASE = "postgresql+psycopg2://neondb_owner:npg_Ftx32aYzgWAD@ep-divine-art-a9jdtdj7-pooler.gwc.azure.neon.tech:5432/komorebi"

engine = create_engine(URL_DATABASE)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
