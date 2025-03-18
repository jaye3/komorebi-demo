import requests

class GeminiEmbeddings:
    def __init__(self, api_key):
        self.api_key = api_key
        self.url = f"https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent?key={self.api_key}"
        self.headers = {'Content-Type': 'application/json'}

    def embed_query(self, text):
        payload = {
            "content": {
                "parts": [{"text": text}]
            }
        }
        response = requests.post(self.url, headers=self.headers, json=payload)
        if response.status_code == 200:
            print(f"IRIS HELP: Embedded '{text[:50]}...'")
            return response.json()['embedding']['values']
        else:
            raise Exception(f"IRIS HELP: Error embedding query: {response.status_code}, {response.text}")

    def embed_documents(self, texts):
        # Optional if you want to batch embed
        embeddings = [self.embed_query(text) for text in texts]
        print("IRIS HELP: Embedding completed")
        return embeddings