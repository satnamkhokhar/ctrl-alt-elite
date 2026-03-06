from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model): #db.Model tells SQLAlchemy this maps to the DB table
    __tablename__ = 'users'

    user_id = db.Column(db.BigInteger, primary_key=True)
    username = db.Column(db.String(50), nullable=False, unique=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True)
    password_hash = db.Column(db.Text, nullable=False)

    dietary_restrictions = db.Column(db.Text, nullable=True)
    favorite_restaurants=db.Column(db.Text, nullable=True)
    restaurant_history = db.Column(db.Text, nullable=True)