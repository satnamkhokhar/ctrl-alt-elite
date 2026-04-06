# imports
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models.user import db, User
from ..models.saved_group import SavedGroup, SavedGroupMember

# blueprint
groups_bp = Blueprint('groups', __name__)

# create group
@groups_bp.route('', methods=['POST'])
@jwt_required()
def create_group():
    ...

# get all groups
@groups_bp.route('', methods=['GET'])
@jwt_required()
def get_groups():
    ...

# get group details
@groups_bp.route('/<int:group_id>', methods=['GET'])
@jwt_required()
def get_group(group_id):
    ...

# delete group
@groups_bp.route('/<int:group_id>', methods=['DELETE'])
@jwt_required()
def delete_group(group_id):
    ...
