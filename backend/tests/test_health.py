# Health / basic endpoints
import requests


def test_root(api_client, base_url):
    r = api_client.get(f"{base_url}/api/")
    assert r.status_code == 200
    assert r.json()["message"] == "One Stock Academy API"


def test_courses(api_client, base_url):
    r = api_client.get(f"{base_url}/api/courses")
    assert r.status_code == 200
    data = r.json()
    assert data["payment_mode"] == "demo"
    prices = {c["id"]: c["price_inr"] for c in data["courses"]}
    assert prices == {"online": 49990, "offline": 199990}
