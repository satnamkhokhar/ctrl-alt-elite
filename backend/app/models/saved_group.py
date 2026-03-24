from .user import db

class GroupHistory(db.Model):
    __tablename__ = 'group_history'

    group_id = db.Column(db.BigInteger, primary_key=True)
    group_name = db.Column(db.String(255), nullable=False)
    session_id = db.Column(db.BigInteger, db.ForeignKey('sessions.session_id', ondelete='CASCADE'), nullable=False)
    user_id = db.Column(db.BigInteger, db.ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False)
    restaurants_history = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime(timezone=True), server_default=db.func.now())