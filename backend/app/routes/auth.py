from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token #creates a JWT token when login is successful
from ..models.user import db, User
import bcrypt

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST']) #listens for POST request at /auth/register
def register():
    data = request.get_json() #reads JSON body from frontend

    first_name = data.get('first_name')
    last_name = data.get('last_name')
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    dietary_restrictions = data.get('dietary_restrictions')  # NEW: comma-separated string
    
    #checks that every field was actually sent
    if not all([first_name, last_name, username, email, password]):
        return jsonify({'error': 'all fields are required'}), 400 # 400 means a bad request

    #checks if a user with that email already exists in the database
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'email already registered'}), 409 #409 means conflict

    #checks if a user with that username already exists in the database
    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'username already taken'}), 409

    #hashes the password before storing it
    password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    #Creates a new User object with the provided data
    new_user = User(
        first_name=first_name,
        last_name=last_name,
        username=username,
        email=email,
        password_hash=password_hash.decode('utf-8'), #decode converts the bytes back to a string
        dietary_restrictions=dietary_restrictions
    )

    db.session.add(new_user) #stages the new user to be saved
    db.session.commit() #actually saves the new user

    return jsonify({'message': 'user registered successfully'}), 201 #201 means created

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')

    #Checks if both fields were sent
    if not all([email, password]):
        return jsonify({'error': 'email and password required'}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not bcrypt.checkpw(password.encode('utf-8'), user.password_hash.encode('utf-8')):
        return jsonify({'error': 'invalid email or password'}), 401 #401 means unauthorized

    #Creates a JWT token using the user's id as their identity
    access_token = create_access_token(identity=str(user.user_id))

    return jsonify({'access_token': access_token, 'user_id': user.user_id}), 200 # 200 means success, sends token to frontend

