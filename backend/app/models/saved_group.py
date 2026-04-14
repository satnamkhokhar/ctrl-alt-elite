from .user import db
from datetime import datetime

class GroupHistory(db.Model):
    __tablename__ = 'group_history'

    group_id = db.Column(db.BigInteger, primary_key=True)
    group_name = db.Column(db.String(255), nullable=False)
    created_by_user_id = db.Column(db.BigInteger, db.ForeignKey('users.user_id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    members = db.relationship('SavedGroupMember', backref='group', cascade="all, delete")


class SavedGroupMember(db.Model):
    __tablename__ = 'saved_group_members'

    member_id = db.Column(db.BigInteger, primary_key=True)
    group_id = db.Column(db.BigInteger, db.ForeignKey('saved_groups.group_id'), nullable=False)
    user_id = db.Column(db.BigInteger, db.ForeignKey('users.user_id'), nullable=False)
    added_at = db.Column(db.DateTime, default=datetime.utcnow)
