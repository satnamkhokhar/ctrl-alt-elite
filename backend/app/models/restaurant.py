from .user import db

class Restaurant(db.Model):
    __tablename__ = 'restaurants'

    restaurant_id = db.Column(db.BigInteger, primary_key=True)
    external_place_id = db.Column(db.String(255), unique=True, nullable=True)
    name = db.Column(db.String(255), nullable=False)
    location = db.Column(db.Text, nullable=True)
    formatted_address = db.Column(db.Text, nullable=True)
    latitude = db.Column(db.Numeric(10, 7), nullable=True)
    longitude = db.Column(db.Numeric(10, 7), nullable=True)
    min_price = db.Column(db.Numeric(10, 2), nullable=True)
    max_price = db.Column(db.Numeric(10, 2), nullable=True)
    phone_number = db.Column(db.String(30), nullable=True)
    website = db.Column(db.Text, nullable=True)
    cuisine = db.Column(db.String(100), nullable=True)
    rating = db.Column(db.Numeric(3, 2), nullable=True)
    created_at = db.Column(db.DateTime(timezone=True), server_default=db.func.now())