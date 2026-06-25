from tests.conftest import auth_header


def test_signup_login_and_verify_flow(client):
    signup = client.post(
        "/api/auth/signup",
        json={
            "email": "newbie@example.com",
            "password": "supersecret",
            "full_name": "New Bie",
            "role": "student",
        },
    )
    assert signup.status_code == 201, signup.text
    body = signup.json()
    assert body["user"]["email"] == "newbie@example.com"
    assert body["user"]["role"] == "student"
    assert body["user"]["is_email_verified"] is False
    assert body["token"]["access_token"]
    verification_token = body["verification_token"]
    assert verification_token

    headers = auth_header(client, "newbie@example.com", "supersecret")
    me = client.get("/api/auth/me", headers=headers)
    assert me.status_code == 200
    assert me.json()["full_name"] == "New Bie"

    verified = client.post("/api/auth/verify-email", json={"token": verification_token})
    assert verified.status_code == 200
    assert verified.json()["is_email_verified"] is True


def test_signup_rejects_duplicate_email(client):
    payload = {
        "email": "dupe@example.com",
        "password": "supersecret",
        "full_name": "Dupe",
        "role": "student",
    }
    assert client.post("/api/auth/signup", json=payload).status_code == 201
    assert client.post("/api/auth/signup", json=payload).status_code == 409


def test_login_with_wrong_password_is_unauthorized(client):
    client.post(
        "/api/auth/signup",
        json={
            "email": "real@example.com",
            "password": "supersecret",
            "full_name": "Real",
            "role": "student",
        },
    )
    resp = client.post(
        "/api/auth/login", json={"email": "real@example.com", "password": "wrong-password"}
    )
    assert resp.status_code == 401


def test_me_requires_authentication(client):
    assert client.get("/api/auth/me").status_code == 401


def test_verify_email_rejects_garbage_token(client):
    assert client.post("/api/auth/verify-email", json={"token": "not-a-token"}).status_code == 400
