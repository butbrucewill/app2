# Leads + admin auth/dashboard endpoints
import uuid

import pytest

ADMIN_PASSWORD = "OneStock@Admin2026"


def test_admin_login_wrong_password(api_client, base_url):
    r = api_client.post(f"{base_url}/api/admin/login", json={"password": "wrong-pass"})
    assert r.status_code == 401
    assert "detail" in r.json()


def test_admin_login_success(api_client, base_url):
    r = api_client.post(f"{base_url}/api/admin/login", json={"password": ADMIN_PASSWORD})
    assert r.status_code == 200
    token = r.json()["token"]
    assert len(token.split(".")) == 3


@pytest.mark.parametrize("path", ["/api/admin/enrollments", "/api/admin/leads"])
def test_admin_endpoints_require_token(api_client, base_url, path):
    r = api_client.get(f"{base_url}{path}")
    assert r.status_code == 401
    r2 = api_client.get(f"{base_url}{path}", headers={"Authorization": "Bearer garbage.token.here"})
    assert r2.status_code == 401


def test_create_lead_and_visible_in_admin(api_client, base_url, admin_headers):
    marker = uuid.uuid4().hex[:6]
    payload = {
        "name": f"TEST_Lead {marker}",
        "email": f"test_lead_{marker}@example.com",
        "whatsapp": "9876543210",
        "age": 28,
        "trading_experience": "1-to-3-years",
        "city": "Mumbai",
        "interest": "offline",
    }
    r = api_client.post(f"{base_url}/api/leads", json=payload)
    assert r.status_code == 200, r.text[:300]
    body = r.json()
    assert body["status"] == "ok"
    lead_id = body["lead_id"]
    assert lead_id.startswith("LEAD-")

    r2 = api_client.get(f"{base_url}/api/admin/leads", headers=admin_headers)
    assert r2.status_code == 200
    leads = r2.json()["leads"]
    match = [l for l in leads if l["lead_id"] == lead_id]
    assert match, f"lead {lead_id} not returned by admin/leads"
    lead = match[0]
    assert lead["name"] == payload["name"]
    assert lead["email"] == payload["email"]
    assert lead["whatsapp"] == payload["whatsapp"]
    assert lead["age"] == payload["age"]
    assert lead["trading_experience"] == payload["trading_experience"]
    assert lead["city"] == payload["city"]
    assert lead["interest"] == "offline"
    assert lead["status"] == "new"
    assert "_id" not in lead


@pytest.mark.parametrize("bad", [
    {"name": "A", "email": "a@b.com", "whatsapp": "9876543210", "city": "Pune"},
    {"name": "Valid Name", "email": "not-an-email", "whatsapp": "9876543210", "city": "Pune"},
    {"name": "Valid Name", "email": "a@b.com", "whatsapp": "12", "city": "Pune"},
])
def test_lead_validation(api_client, base_url, bad):
    r = api_client.post(f"{base_url}/api/leads", json=bad)
    assert r.status_code == 422


def test_lead_unknown_interest_defaults_to_online(api_client, base_url, admin_headers):
    marker = uuid.uuid4().hex[:6]
    r = api_client.post(f"{base_url}/api/leads", json={
        "name": f"TEST_Interest {marker}", "email": f"ti_{marker}@example.com",
        "whatsapp": "9998887770", "city": "Delhi", "interest": "hacker"})
    assert r.status_code == 200
    lead_id = r.json()["lead_id"]
    leads = api_client.get(f"{base_url}/api/admin/leads", headers=admin_headers).json()["leads"]
    lead = next(l for l in leads if l["lead_id"] == lead_id)
    assert lead["interest"] == "online"
