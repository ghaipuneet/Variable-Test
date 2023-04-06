import hmac
import hashlib
import json
import time
from typing import Dict, Any

from fastapi import FastAPI, Request, Response
import requests

# Replace these values with your own
API_SECRET = "your_api_secret"
API_KEY = "your_api_key"
STARKEX_API_URL = "https://api.starkex.co/starkex"
BACKEND_API_URL = "https://custom-url-for-exchange.com"

# Initialize the FastAPI app
app = FastAPI()


# Define a function to sign requests with your API key and secret
def sign_request(endpoint: str, data: Dict[str, Any]) -> Dict[str, str]:
    timestamp = int(time.time() * 1000)
    message = f"{API_KEY}{timestamp}{endpoint}{json.dumps(data)}"
    signature = hmac.new(
        API_SECRET.encode(), message.encode(), hashlib.sha256
    ).hexdigest()
    return {
        "X-Signature": signature,
        "X-Timestamp": str(timestamp),
        "Content-Type": "application/json",
    }


# Define an API endpoint that proxies requests to the StarkEx API
@app.post("/starkex")
async def starkex_proxy(request: Request, response: Response) -> Dict[str, Any]:
    # Get the endpoint URL from the request path
    endpoint = request.url.path.replace("/starkex", "")
    url = f"{STARKEX_API_URL}{endpoint}"

    # Get the request data from the request body
    data = await request.json()

    # Sign the request with your API key and secret
    headers = sign_request(endpoint, data)

    # Send the request to the StarkEx API
    resp = requests.post(url, json=data, headers=headers)

    # Set the response status code and headers
    response.status_code = resp.status_code
    for name, value in resp.headers.items():
        response.headers[name] = value

    # Return the response JSON data
    return resp.json()


# Define an API endpoint that proxies requests to your exchange backend
@app.post("/backend")
async def backend_proxy(request: Request, response: Response) -> Dict[str, Any]:
    # Get the endpoint URL from the request path
    endpoint = request.url.path.replace("/backend", "")
    url = f"{BACKEND_API_URL}{endpoint}"

    # Get the request data from the request body
    data = await request.json()

    # Send the request to your exchange backend
    resp = requests.post(url, json=data)

    # Set the response status code and headers
    response.status_code = resp.status_code
    for name, value in resp.headers.items():
        response.headers[name] = value

    # Return the response JSON data
    return resp.json()
