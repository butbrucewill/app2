import os
import time

import pytest
import requests
from dotenv import dotenv_values

frontend_env = dotenv_values("/app/frontend/.env")
_base = os.environ.get("REACT_APP_BACKEND_URL") or frontend_env.get("REACT_APP_BACKEND_URL")
if not _base:
    raise RuntimeError("REACT_APP_BACKEND_URL missing")
BASE_URL = _base.rstrip("/")
ADMIN_PASSWORD = "OneStock@Admin2026"


@pytest.fixture(scope="session")
def base_url():
    return BASE_URL


@pytest.fixture(scope="session")
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def admin_token(api_client):
    r = api_client.post(f"{BASE_URL}/api/admin/login", json={"password": ADMIN_PASSWORD})
    if r.status_code != 200:
        pytest.fail(f"Admin login failed {r.status_code}: {r.text[:300]}")
    token = r.json().get("token")
    assert token and isinstance(token, str)
    return token


@pytest.fixture(scope="session")
def admin_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}


def chat_post(api_client, message, session_id="pytest-session-0001"):
    """POST /api/chat honouring the 10 msg/min rate limit (retry once after cooldown)."""
    url = f"{BASE_URL}/api/chat"
    r = api_client.post(url, json={"session_id": session_id, "message": message})
    if r.status_code == 429:
        time.sleep(62)
        r = api_client.post(url, json={"session_id": session_id, "message": message})
    return r
