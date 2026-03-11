from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models.user import db
from ..models.session import Session, SessionUser

sessions_bp = Blueprint('sessions', __name__)