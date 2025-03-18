import os
from dotenv import load_dotenv
from langchain.docstore.document import Document
from langchain_iris import IRISVector
from backend.app.services.iris_helpers import *
load_dotenv()

API_KEY = os.getenv("GEMINI_TEST_API")

def format_context(docs: Document):
    print("IRIS: Formatted docs")
    return [doc.page_content for doc in docs]

def retrieve_context(query: str):
    
    embedder = GeminiEmbeddings(API_KEY)

    # Connecting to local IRIS instance
    CONNECTION_STRING = f'iris://{os.getenv("IRIS_USERNAME")}:{os.getenv("IRIS_PASSWORD")}@{os.getenv("IRIS_HOSTNAME")}:{os.getenv("IRIS_PORT")}/{os.getenv("IRIS_NAMESPACE")}'
    COLLECTION_NAME = "derma"

    # # # # # # USE THIS
    db = IRISVector(
        embedding_function=embedder,
        dimension=768,
        collection_name=COLLECTION_NAME,
        connection_string=CONNECTION_STRING,
    )

    query_docs = db.as_retriever().invoke(query)
    query_context = format_context(query_docs)

    return query_context
        
if __name__ == "__main__":
    # To create DB Collection -- run ONCE ONLY when loading in data
    docs = []
    with open('./backend/data/derma_facts.txt', 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if line:
                print(f"IRIS: Building docs: {line}")
                docs.append(Document(page_content=line))


    embedder = GeminiEmbeddings(API_KEY)

    CONNECTION_STRING = f'iris://{os.getenv("IRIS_USERNAME")}:{os.getenv("IRIS_PASSWORD")}@{os.getenv("IRIS_HOSTNAME")}:{os.getenv("IRIS_PORT")}/{os.getenv("IRIS_NAMESPACE")}'

    COLLECTION_NAME = "derma"

    # Creates a persistent vector store in IRIS
    db = IRISVector.from_documents(
        embedding=embedder,
        documents=docs,
        collection_name=COLLECTION_NAME,
        connection_string=CONNECTION_STRING,
    )

    print(f"Number of docs in vector store: {len(db.get()['ids'])}")