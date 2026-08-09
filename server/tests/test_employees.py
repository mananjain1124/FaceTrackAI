from unittest.mock import patch, MagicMock

import numpy as np
import pytest


def _mock_face_embedding_class():
    mock_cls = MagicMock()
    instance = MagicMock()
    instance.generate_employee_embedding.return_value = np.random.rand(512).astype(np.float32)
    instance.save_embedding.return_value = "/fake/embeddings/EMP.npy"
    mock_cls.return_value = instance
    return mock_cls


MOCK_EMBED = _mock_face_embedding_class()


@pytest.fixture(autouse=True)
def _patch_embedding():
    with patch("services.employee_service.FaceEmbedding", MOCK_EMBED), \
         patch("services.employee_service.invalidate_embedding_cache"):
        yield


def _make_payload(emp_id="EMP100", name="Test User"):
    return {
        "employee": {
            "id": emp_id,
            "name": name,
            "email": f"{emp_id.lower()}@test.com",
            "phone": "9000000000",
            "department": "IT",
            "position": "Engineer",
        },
        "images": [],  # placeholder, overridden in specific tests
    }


def _payload_with_image(emp_id="EMP100", name="Test User"):
    from tests.utils import make_test_image_data_url
    p = _make_payload(emp_id, name)
    p["images"] = [make_test_image_data_url()]
    return p


class TestRegisterEmployee:
    def test_register_success(self, client, auth_headers):
        resp = client.post(
            "/api/employees/register",
            json=_payload_with_image(),
            headers=auth_headers,
        )
        assert resp.status_code == 201
        body = resp.get_json()
        assert body["success"] is True
        assert body["employee_id"] == "EMP100"

    def test_register_duplicate_id(self, client, auth_headers):
        client.post(
            "/api/employees/register",
            json=_payload_with_image("EMP_DUP"),
            headers=auth_headers,
        )
        resp = client.post(
            "/api/employees/register",
            json=_payload_with_image("EMP_DUP"),
            headers=auth_headers,
        )
        assert resp.status_code == 409

    def test_register_missing_fields(self, client, auth_headers):
        payload = {
            "employee": {"id": "EMP_X", "email": "x@t.com"},
            "images": ["data:image/jpeg;base64,/9j/4AAQ"],
        }
        resp = client.post(
            "/api/employees/register",
            json=payload,
            headers=auth_headers,
        )
        assert resp.status_code == 400

    def test_register_no_images(self, client, auth_headers):
        payload = _make_payload("EMP_NOIMG")
        payload["images"] = []
        resp = client.post(
            "/api/employees/register",
            json=payload,
            headers=auth_headers,
        )
        assert resp.status_code == 400


class TestListEmployees:
    def test_list_empty(self, client, auth_headers):
        resp = client.get("/api/employees", headers=auth_headers)
        assert resp.status_code == 200
        body = resp.get_json()
        assert body["count"] == 0

    def test_list_after_register(self, client, auth_headers):
        client.post(
            "/api/employees/register",
            json=_payload_with_image("EMP_L1"),
            headers=auth_headers,
        )
        resp = client.get("/api/employees", headers=auth_headers)
        body = resp.get_json()
        assert body["count"] >= 1
        ids = [e["employee_id"] for e in body["employees"]]
        assert "EMP_L1" in ids


class TestUpdateEmployee:
    def test_update_success(self, client, auth_headers):
        client.post(
            "/api/employees/register",
            json=_payload_with_image("EMP_U1"),
            headers=auth_headers,
        )
        resp = client.put(
            "/api/employees/EMP_U1",
            json={"name": "Updated Name"},
            headers=auth_headers,
        )
        assert resp.status_code == 200

    def test_update_not_found(self, client, auth_headers):
        resp = client.put(
            "/api/employees/NONEXISTENT",
            json={"name": "X"},
            headers=auth_headers,
        )
        assert resp.status_code == 404


class TestDeleteEmployee:
    def test_delete_success(self, client, auth_headers):
        client.post(
            "/api/employees/register",
            json=_payload_with_image("EMP_D1"),
            headers=auth_headers,
        )
        resp = client.delete(
            "/api/employees/EMP_D1",
            headers=auth_headers,
        )
        assert resp.status_code == 200
        body = resp.get_json()
        assert body["success"] is True

        list_resp = client.get("/api/employees", headers=auth_headers)
        ids = [e["employee_id"] for e in list_resp.get_json()["employees"]]
        assert "EMP_D1" not in ids

    def test_delete_not_found(self, client, auth_headers):
        resp = client.delete(
            "/api/employees/NONEXISTENT",
            headers=auth_headers,
        )
        assert resp.status_code == 404
