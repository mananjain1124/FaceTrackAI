def test_signup_success(client):
    resp = client.post("/api/auth/signup", json={
        "email": "admin@test.com",
        "password": "password123",
    })
    assert resp.status_code == 201
    data = resp.get_json()
    assert data["success"] is True
    assert data["email"] == "admin@test.com"


def test_signup_duplicate(client):
    payload = {"email": "admin@test.com", "password": "password123"}
    assert client.post("/api/auth/signup", json=payload).status_code == 201
    resp = client.post("/api/auth/signup", json=payload)
    assert resp.status_code == 400


def test_signup_missing_fields(client):
    resp = client.post("/api/auth/signup", json={"email": "", "password": "password123"})
    assert resp.status_code == 400

    resp = client.post("/api/auth/signup", json={"email": "admin@test.com", "password": ""})
    assert resp.status_code == 400


def test_login_success(client):
    client.post("/api/auth/signup", json={
        "email": "admin@test.com",
        "password": "password123",
    })
    resp = client.post("/api/auth/login", json={
        "email": "admin@test.com",
        "password": "password123",
    })
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["success"] is True
    assert data["token"]


def test_login_wrong_password(client):
    client.post("/api/auth/signup", json={
        "email": "admin@test.com",
        "password": "password123",
    })
    resp = client.post("/api/auth/login", json={
        "email": "admin@test.com",
        "password": "wrong-password",
    })
    assert resp.status_code == 401


def test_login_nonexistent_email(client):
    resp = client.post("/api/auth/login", json={
        "email": "nobody@test.com",
        "password": "password123",
    })
    assert resp.status_code == 401
