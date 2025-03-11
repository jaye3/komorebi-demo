import os
import httpx
from dotenv import load_dotenv
import time
import asyncio
from utils.client import client

load_dotenv()  # Load variables from .env

################### HELPER FUNC TO POST CREATE API #########################

BASE_URL = os.getenv("BACKEND_API_BASE_URL") 
MAX_RETRIES = 3
RETRY_BACKOFF = 2

# async def check_backend_health() -> bool:
#     health_url = f"{BASE_URL}/health"
#     try:
#         response = await client.get(health_url)
#         return response.status_code == 200
#     except Exception:
#         return False

async def get_from_api(data: dict, api_path: str) -> bool:
    api_url = f"{BASE_URL}/api{api_path}"

    headers = {
        "Accept": "application/json",
    }

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            response = await client.get(api_url, params=data, headers=headers)
            response.raise_for_status()

            print(f"✅ Successfully retrieved on attempt {attempt}: {response.json()}")
            return response.json()

        except httpx.HTTPStatusError as exc:
            print(f"❌ HTTP {exc.response.status_code} on attempt {attempt}: {exc.response.text}")
            if 400 <= exc.response.status_code < 500:
                break  

        except httpx.RequestError as exc:
            print(f"❌ Network error on attempt {attempt}: {exc}")

        except Exception as exc:
            print(f"❌ Unexpected error on attempt {attempt}: {exc}")

        # Exponential backoff for retries
        if attempt < MAX_RETRIES:
            wait_time = RETRY_BACKOFF ** attempt
            print(f"Retrying in {wait_time} seconds...")
            await asyncio.sleep(wait_time)
    return None

async def create_to_api(data: dict, api_path: str) -> bool:
    api_url = f"{BASE_URL}/api{api_path}"

    headers = {
        "Content-Type": "application/json",
    }

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            response = await client.post(api_url, json=data, headers=headers)
            response.raise_for_status()

            print(f"✅ Successfully created on attempt {attempt}: {response.json()}")
            return True

        except httpx.HTTPStatusError as exc:
            print(f"❌ HTTP {exc.response.status_code} on attempt {attempt}: {exc.response.text}")
            if 400 <= exc.response.status_code < 500:
                break  

        except httpx.RequestError as exc:
            print(f"❌ Network error on attempt {attempt}: {exc}")

        except Exception as exc:
            print(f"❌ Unexpected error on attempt {attempt}: {exc}")

        # Exponential backoff for retries
        if attempt < MAX_RETRIES:
            wait_time = RETRY_BACKOFF ** attempt
            print(f"Retrying in {wait_time} seconds...")
            await asyncio.sleep(wait_time)

async def update_to_api(data: dict, api_path: str) -> bool:
    api_url = f"{BASE_URL}/api{api_path}/update/"  

    headers = {
        "Content-Type": "application/json",
    }

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            response = await client.put(api_url, json=data, headers=headers)
            response.raise_for_status()

            print(f"✅ Successfully updated on attempt {attempt}: {response.json()}")
            return True

        except httpx.HTTPStatusError as exc:
            print(f"❌ HTTP {exc.response.status_code} on attempt {attempt}: {exc.response.text}")
            if 400 <= exc.response.status_code < 500:
                break  # Do not retry on client-side errors

        except httpx.RequestError as exc:
            print(f"❌ Network error on attempt {attempt}: {exc}")

        except Exception as exc:
            print(f"❌ Unexpected error on attempt {attempt}: {exc}")

        # Exponential backoff for retries
        if attempt < MAX_RETRIES:
            wait_time = RETRY_BACKOFF ** attempt
            print(f"🔄 Retrying in {wait_time} seconds...")
            await asyncio.sleep(wait_time)
        
####################