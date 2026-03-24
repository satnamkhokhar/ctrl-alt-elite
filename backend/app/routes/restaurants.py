import os
import requests
import psycopg2
from flask import Blueprint, request, jsonify
from dotenv import load_dotenv

load_dotenv()

restaurants_bp = Blueprint("restaurants", __name__)

def get_db_connection():
    return psycopg2.connect(
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASS"),
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT"),
    )

@restaurants_bp.route("/search", methods=["POST"])
def search_restaurants():
    data = request.get_json()

    latitude = data.get("latitude")
    longitude = data.get("longitude")
    radius = data.get("radius", 3000)
    dietary = data.get("dietary")

    if latitude is None or longitude is None:
        return jsonify({"error": "latitude and longitude are required"}), 400

    base_url = "https://api.geoapify.com/v2/places"

    params = {
        "categories": "catering.restaurant",
        "filter": f"circle:{longitude},{latitude},{radius}",
        "bias": f"proximity:{longitude},{latitude}",
        "limit": 20,
        "apiKey": os.getenv("GEOAPIFY_API_KEY"),
    }

    if dietary == "vegan":
        params["conditions"] = "vegan"
    elif dietary == "vegetarian":
        params["conditions"] = "vegetarian"

    response = requests.get(base_url, params=params)
    response.raise_for_status()

    places = response.json().get("features", [])

    conn = get_db_connection()
    cur = conn.cursor()

    saved_restaurants = []

    for feature in places:
        props = feature.get("properties", {})

        external_place_id = props.get("place_id")
        name = props.get("name")
        formatted_address = props.get("formatted")
        location = props.get("formatted")
        cuisine = ", ".join(props.get("categories", [])[:3]) if props.get("categories") else None
        lat = props.get("lat")
        lon = props.get("lon")

        cur.execute(
            """
            INSERT INTO restaurants
            (external_place_id, name, location, formatted_address, cuisine, latitude, longitude, source)
            VALUES (%s, %s, %s, %s, %s, %s, %s, 'geoapify')
            ON CONFLICT (external_place_id)
            DO UPDATE SET
                name = EXCLUDED.name,
                location = EXCLUDED.location,
                formatted_address = EXCLUDED.formatted_address,
                cuisine = EXCLUDED.cuisine,
                latitude = EXCLUDED.latitude,
                longitude = EXCLUDED.longitude,
                source = EXCLUDED.source
            RETURNING restaurant_id, external_place_id, name, formatted_address, cuisine, latitude, longitude
            """,
            (external_place_id, name, location, formatted_address, cuisine, lat, lon)
        )

        row = cur.fetchone()

        saved_restaurants.append({
            "restaurant_id": row[0],
            "external_place_id": row[1],
            "name": row[2],
            "formatted_address": row[3],
            "cuisine": row[4],
            "latitude": row[5],
            "longitude": row[6]
        })

    conn.commit()
    cur.close()
    conn.close()

    return jsonify(saved_restaurants), 200
