# Enrollment / demo payment flow
import uuid


def test_order_create_verify_and_admin_visibility(api_client, base_url, admin_headers):
    marker = uuid.uuid4().hex[:6]
    payload = {"course_id": "online", "name": f"TEST_Student {marker}",
               "email": f"test_student_{marker}@example.com", "phone": "9812345678"}
    r = api_client.post(f"{base_url}/api/orders", json=payload)
    assert r.status_code == 200, r.text[:300]
    order = r.json()
    assert order["demo"] is True
    assert order["amount_paise"] == 4999000
    ref = order["order_ref"]
    assert ref.startswith("OSA-")

    g = api_client.get(f"{base_url}/api/orders/{ref}")
    assert g.status_code == 200
    assert g.json()["enrollment"]["status"] == "created"

    v = api_client.post(f"{base_url}/api/payments/verify",
                        json={"order_ref": ref, "demo_outcome": "success"})
    assert v.status_code == 200, v.text[:300]
    assert v.json()["status"] == "success"
    assert v.json()["enrollment"]["status"] == "paid"

    g2 = api_client.get(f"{base_url}/api/orders/{ref}")
    assert g2.json()["enrollment"]["status"] == "paid"
    assert g2.json()["enrollment"]["paid_at"]

    a = api_client.get(f"{base_url}/api/admin/enrollments", headers=admin_headers)
    assert a.status_code == 200
    row = next((e for e in a.json()["enrollments"] if e["order_ref"] == ref), None)
    assert row, "enrollment missing from admin list"
    assert row["status"] == "paid"
    assert row["amount_inr"] == 49990
    assert "_id" not in row


def test_order_failure_outcome(api_client, base_url):
    marker = uuid.uuid4().hex[:6]
    r = api_client.post(f"{base_url}/api/orders", json={
        "course_id": "offline", "name": f"TEST_Fail {marker}",
        "email": f"test_fail_{marker}@example.com", "phone": "9812345678"})
    ref = r.json()["order_ref"]
    v = api_client.post(f"{base_url}/api/payments/verify",
                        json={"order_ref": ref, "demo_outcome": "failure"})
    assert v.status_code == 200
    assert v.json()["status"] == "failed"


def test_order_unknown_course(api_client, base_url):
    r = api_client.post(f"{base_url}/api/orders", json={
        "course_id": "weekend", "name": "TEST_Bad Course",
        "email": "bad@example.com", "phone": "9812345678"})
    assert r.status_code == 400


def test_verify_unknown_order(api_client, base_url):
    r = api_client.post(f"{base_url}/api/payments/verify",
                        json={"order_ref": "OSA-DOESNOTEXIST", "demo_outcome": "success"})
    assert r.status_code == 404


def test_get_unknown_order(api_client, base_url):
    r = api_client.get(f"{base_url}/api/orders/OSA-NOPE")
    assert r.status_code == 404
