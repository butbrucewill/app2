# Chat rate limiting (documented as 10 msgs/min per IP)
def test_chat_rate_limit_enforced(api_client, base_url):
    codes = []
    for i in range(15):
        r = api_client.post(f"{base_url}/api/chat",
                            json={"session_id": "pytest-ratelimit-01", "message": f"hi {i}"})
        codes.append(r.status_code)
    print("status codes:", codes)
    assert 429 in codes, f"rate limit never triggered in 15 rapid requests: {codes}"
