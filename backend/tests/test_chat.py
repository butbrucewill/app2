# Rule-based chatbot: POST /api/chat
import pytest

from conftest import chat_post

IN_SYLLABUS = [
    ("What are the fees?", "49,990", False),
    ("do you give stock tips?", "never give stock tips", False),
    ("what is the buniyaad curriculum", "5 phases", False),
    ("who are the mentors", "Aman Singh Negi", False),
    ("what is the difference between online and offline", "same Buniyaad curriculum", False),
    ("can you guarantee profit", "guarantee profits", False),
    ("how do I enroll", "Enroll Now", False),
    ("I am a beginner, is this for me?", "No experience needed", False),
    ("when is the next batch date", "Batch schedules", True),
]

OUT_OF_SYLLABUS = [
    "what is the weather in delhi today",
    "who won the cricket match yesterday",
    "tell me a joke",
]


@pytest.mark.parametrize("msg,expected_fragment,handoff", IN_SYLLABUS)
def test_in_syllabus_answers(api_client, msg, expected_fragment, handoff):
    r = chat_post(api_client, msg)
    assert r.status_code == 200, r.text[:300]
    data = r.json()
    assert expected_fragment in data["reply"], data["reply"]
    assert data["handoff"] is handoff


@pytest.mark.parametrize("msg", OUT_OF_SYLLABUS)
def test_out_of_syllabus_fallback(api_client, msg):
    r = chat_post(api_client, msg)
    assert r.status_code == 200, r.text[:300]
    data = r.json()
    assert "beyond what I can answer here" in data["reply"], data["reply"]
    assert data["handoff"] is True


def test_greeting_rule(api_client):
    r = chat_post(api_client, "hi")
    assert r.status_code == 200
    assert "Hello!" in r.json()["reply"]
    assert r.json()["handoff"] is False


def test_chat_validation(api_client, base_url):
    r = api_client.post(f"{base_url}/api/chat", json={"session_id": "ab", "message": ""})
    assert r.status_code == 422
