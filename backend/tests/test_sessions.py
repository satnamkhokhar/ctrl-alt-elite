import os
import sys
import pytest
from unittest.mock import patch

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import create_app
from app.models.user import db as _db


@pytest.fixture
def client():
    with patch("app.config.Config.SQLALCHEMY_DATABASE_URI", "sqlite:///:memory:"):
        app = create_app()
        app.config["TESTING"] = True

        with app.app_context():
            _db.create_all()

            with patch("flask_jwt_extended.view_decorators.verify_jwt_in_request"), \
                 patch("app.routes.sessions.get_jwt_identity", return_value=1):
                yield app.test_client()

            _db.drop_all()


def test_create_session_missing_fields(client):
    response = client.post(
        "/sessions",
        json={},
        headers={"Authorization": "Bearer dummy"}
    )

    assert response.status_code == 400
    assert "error" in response.get_json()


def test_get_session_not_found(client):
    response = client.get(
        "/sessions/99999",
        headers={"Authorization": "Bearer dummy"}
    )

    assert response.status_code == 404
