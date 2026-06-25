from tests.conftest import auth_header


def test_student_dashboard_shape(seeded_client):
    headers = auth_header(seeded_client, "anne@school.lu")
    resp = seeded_client.get("/api/me/dashboard", headers=headers)
    assert resp.status_code == 200
    data = resp.json()

    assert data["student_name"] == "Anne S."
    assert data["stats"]["streak_days"] == 4
    assert data["stats"]["profile_completion"] == 50
    assert data["stats"]["messages_count"] == 3
    assert data["stats"]["lessons_done"] == 12
    assert data["stats"]["next_class_label"] == "Tomorrow"

    assert len(data["upcoming_classes"]) == 1
    assert data["upcoming_classes"][0]["teacher_name"] == "Marc L."

    assert data["matched_teacher"]["full_name"] == "Marc L."
    assert data["recommendation"]["title"]


def test_dashboard_requires_student_account(seeded_client):
    # Marc is a teacher, so the student-only dashboard must reject him.
    headers = auth_header(seeded_client, "marc@aula.lu")
    assert seeded_client.get("/api/me/dashboard", headers=headers).status_code == 403


def test_update_preferred_language(seeded_client):
    headers = auth_header(seeded_client, "anne@school.lu")
    resp = seeded_client.patch("/api/me", json={"preferred_language": "fr"}, headers=headers)
    assert resp.status_code == 200
