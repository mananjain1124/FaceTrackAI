class TestGetToday:
    def test_today_empty(self, client, auth_headers):
        resp = client.get("/api/attendance/today", headers=auth_headers)
        assert resp.status_code == 200
        body = resp.get_json()
        assert body["count"] == 0

    def test_today_with_date(self, client, auth_headers):
        resp = client.get(
            "/api/attendance/today?date=2026-08-09",
            headers=auth_headers,
        )
        assert resp.status_code == 200

    def test_today_invalid_date(self, client, auth_headers):
        resp = client.get(
            "/api/attendance/today?date=not-a-date",
            headers=auth_headers,
        )
        assert resp.status_code == 400


class TestSummary:
    def test_summary_empty(self, client, auth_headers):
        resp = client.get(
            "/api/attendance/summary?from=2026-08-01&to=2026-08-09",
            headers=auth_headers,
        )
        assert resp.status_code == 200
        body = resp.get_json()
        assert body["total_present"] == 0
        assert isinstance(body["per_day"], list)

    def test_summary_missing_dates(self, client, auth_headers):
        resp = client.get(
            "/api/attendance/summary",
            headers=auth_headers,
        )
        assert resp.status_code == 400

    def test_summary_invalid_range(self, client, auth_headers):
        resp = client.get(
            "/api/attendance/summary?from=2026-08-09&to=2026-08-01",
            headers=auth_headers,
        )
        assert resp.status_code == 400
