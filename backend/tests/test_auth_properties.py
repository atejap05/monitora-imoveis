"""Smoke tests: API exige JWT válido (sem chamar JWKS real para token inválido)."""

import os

import pytest
from fastapi.testclient import TestClient

os.environ.setdefault("CLERK_ISSUER", "https://example.clerk.accounts.dev")

from main import app  # noqa: E402


@pytest.fixture()
def client():
    return TestClient(app)


def test_list_properties_without_auth_returns_401(client: TestClient):
    r = client.get("/api/properties")
    assert r.status_code == 401


def test_list_properties_with_invalid_bearer_returns_401(client: TestClient):
    r = client.get(
        "/api/properties",
        headers={"Authorization": "Bearer not-a-real-jwt"},
    )
    assert r.status_code == 401


def test_patch_property_without_auth_returns_401(client: TestClient):
    r = client.patch(
        "/api/properties/1",
        json={"favorite": True},
    )
    assert r.status_code == 401


def test_patch_property_with_invalid_bearer_returns_401(client: TestClient):
    r = client.patch(
        "/api/properties/1",
        headers={"Authorization": "Bearer not-a-real-jwt"},
        json={"comment": "x"},
    )
    assert r.status_code == 401
