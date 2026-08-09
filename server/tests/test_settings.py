class TestGetSettings:
    def test_get_defaults(self, client, auth_headers):
        resp = client.get("/api/settings", headers=auth_headers)
        assert resp.status_code == 200
        body = resp.get_json()
        assert body["success"] is True
        settings = body["settings"]
        assert "recognition_threshold" in settings
        assert "organization_name" in settings
        assert settings["recognition_threshold"] == 0.75


class TestUpdateSettings:
    def test_update_threshold(self, client, auth_headers):
        resp = client.put(
            "/api/settings",
            json={"recognition_threshold": 0.9},
            headers=auth_headers,
        )
        assert resp.status_code == 200
        settings = resp.get_json()["settings"]
        assert settings["recognition_threshold"] == 0.9

        get_resp = client.get("/api/settings", headers=auth_headers)
        assert get_resp.get_json()["settings"]["recognition_threshold"] == 0.9

    def test_update_unknown_key(self, client, auth_headers):
        resp = client.put(
            "/api/settings",
            json={"invalid_key": 123},
            headers=auth_headers,
        )
        assert resp.status_code == 400

    def test_update_out_of_range(self, client, auth_headers):
        resp = client.put(
            "/api/settings",
            json={"recognition_threshold": 5.0},
            headers=auth_headers,
        )
        assert resp.status_code == 400
