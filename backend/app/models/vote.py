from .user import db

class Vote(db.Model):
    __tablename__ = 'votes'

    vote_id = db.Column(db.BigInteger, primary_key=True)
    session_id = db.Column(db.BigInteger, db.ForeignKey('sessions.session_id', ondelete='CASCADE'), nullable=False)
    restaurant_id = db.Column(db.BigInteger, db.ForeignKey('restaurants.restaurant_id', ondelete='CASCADE'), nullable=False)
    user_id = db.Column(db.BigInteger, db.ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False)
    vote_value = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=db.func.now())