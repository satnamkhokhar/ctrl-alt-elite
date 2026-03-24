import os
import sys
import pytest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import create_app


@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True

    with app.test_client() as client:
        yield client


def test_search_restaurants_success(client):
    response = client.post(
        "/restaurants/search",
        json={
            "latitude": 33.7490,
            "longitude": -84.3880,
            "radius": 3000
        }
    )

    assert response.status_code == 200
    assert isinstance(response.get_json(), list)


def test_search_restaurants_missing_fields(client):
    response = client.post(
        "/restaurants/search",
        json={}
    )

    assert response.status_code == 400
    assert "error" in response.get_json()
