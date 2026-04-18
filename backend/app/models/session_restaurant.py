from .user import db

class SessionRestaurant(db.Model):
    __tablename__ = 'session_restaurants'

    id = db.Column(db.BigInteger, primary_key=True)
    session_id = db.Column(db.BigInteger, db.ForeignKey('sessions.session_id', ondelete='CASCADE'), nullable=False)
    restaurant_id = db.Column(db.BigInteger, db.ForeignKey('restaurants.restaurant_id', ondelete='CASCADE'), nullable=False)
    position = db.Column(db.Integer, nullable=False)  # preserves the order cards appear in
