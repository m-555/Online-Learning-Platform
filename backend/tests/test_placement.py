from app.services.placement import estimate_theta, load_questions, theta_to_cefr


def test_questions_endpoint_hides_answers(client):
    resp = client.get("/api/placement/questions")
    assert resp.status_code == 200
    questions = resp.json()
    assert len(questions) == 20
    first = questions[0]
    assert set(first) == {"id", "text", "skill", "difficulty", "options"}
    assert "correct_option" not in first
    assert [o["key"] for o in first["options"]] == ["A", "B", "C", "D"]


def test_all_correct_yields_high_level(client):
    bank = load_questions()
    answers = [{"question_id": q["id"], "choice": q["correct_option"]} for q in bank]
    resp = client.post("/api/placement/submit", json={"answers": answers})
    assert resp.status_code == 200
    result = resp.json()
    assert result["correct"] == 20
    assert result["total"] == 20
    assert result["level"] in {"C1", "C2"}


def test_all_wrong_yields_beginner_level(client):
    bank = load_questions()

    def wrong_choice(correct: str) -> str:
        return next(k for k in ("A", "B", "C", "D") if k != correct.upper())

    answers = [{"question_id": q["id"], "choice": wrong_choice(q["correct_option"])} for q in bank]
    resp = client.post("/api/placement/submit", json={"answers": answers})
    assert resp.status_code == 200
    assert resp.json()["level"] == "A1"


def test_theta_to_cefr_thresholds():
    assert theta_to_cefr(-2.0) == "A1"
    assert theta_to_cefr(0.0) == "B1"
    assert theta_to_cefr(2.0) == "C1"
    assert estimate_theta([]) == 0.0
