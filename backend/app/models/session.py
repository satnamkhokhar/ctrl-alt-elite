from .user import db

class Session(db.Model):
    __tablename__ = 'sessions'

    session_id = db.Column(db.BigInteger, primary_key=True)
    budget = db.Column(db.Numeric(10, 2), nullable=True)
    max_distance = db.Column(db.Numeric(10, 2), nullable=True)
    dietary_restrictions = db.Column(db.Text, nullable=True)
    active_users = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime(timezone=True), server_default=db.func.now())

class SessionUser(db.Model):
    __tablename__ = 'session_users'

    session_user_id = db.Column(db.BigInteger, primary_key=True)
    session_id = db.Column(db.BigInteger, db.ForeignKey('sessions.session_id', ondelete='CASCADE'), nullable=False)
    user_id = db.Column(db.BigInteger, db.ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False)
    joined_at = db.Column(db.DateTime(timezone=True), server_default=db.func.now())