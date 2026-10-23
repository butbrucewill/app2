import uuid


def test_redirect_link_lifecycle(api_client, base_url, admin_headers):
    slug = f"test-free-webinar-{uuid.uuid4().hex[:8]}"
    payload = {
        "title": "Free Webinar",
        "slug": slug,
        "destination_url": "https://example.com/register",
        "page": "Home page",
        "section": "Hero banner",
        "button_label": "Register Now",
        "is_active": True,
    }

    created = api_client.post(f"{base_url}/api/admin/links", json=payload, headers=admin_headers)
    assert created.status_code == 200, created.text[:300]
    link = created.json()["link"]
    link_id = link["link_id"]
    assert link["clicks"] == 0

    duplicate = api_client.post(f"{base_url}/api/admin/links", json=payload, headers=admin_headers)
    assert duplicate.status_code == 409
    assert "detail" in duplicate.json()

    redirected = api_client.get(f"{base_url}/api/go/{slug}", allow_redirects=False)
    assert redirected.status_code == 302
    assert redirected.headers["Location"] == payload["destination_url"]
    listed = api_client.get(f"{base_url}/api/admin/links", headers=admin_headers)
    assert listed.status_code == 200
    saved = next(item for item in listed.json()["links"] if item["link_id"] == link_id)
    assert saved["clicks"] == 1

    unpublished = api_client.put(
        f"{base_url}/api/admin/links/{link_id}",
        json={"is_active": False},
        headers=admin_headers,
    )
    assert unpublished.status_code == 200
    assert api_client.get(f"{base_url}/api/go/{slug}").status_code == 404

    deleted = api_client.delete(f"{base_url}/api/admin/links/{link_id}", headers=admin_headers)
    assert deleted.status_code == 200
    assert api_client.get(f"{base_url}/api/go/{slug}").status_code == 404


def test_redirect_link_validation(api_client, base_url, admin_headers):
    base_payload = {
        "title": "Invalid Target",
        "slug": f"test-invalid-{uuid.uuid4().hex[:8]}",
        "destination_url": "javascript:alert(1)",
    }
    invalid_url = api_client.post(
        f"{base_url}/api/admin/links", json=base_payload, headers=admin_headers
    )
    assert invalid_url.status_code == 400
    assert "detail" in invalid_url.json()

    for slug in ("Admin", "not_a_slug", "api"):
        invalid_slug = api_client.post(
            f"{base_url}/api/admin/links",
            json={**base_payload, "slug": slug, "destination_url": "https://example.com/register"},
            headers=admin_headers,
        )
        assert invalid_slug.status_code == 400
        assert "detail" in invalid_slug.json()