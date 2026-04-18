from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models.user import db, User
from ..models.saved_group import GroupHistory, SavedGroupMember

groups_bp = Blueprint('groups', __name__, url_prefix='/groups')

# Create group
@groups_bp.route('', methods=['POST'])
@jwt_required()
def create_group():
    data = request.get_json()
    current_user_id = get_jwt_identity()

    group_name = data.get('group_name')
    user_ids = data.get('user_ids', [])

    if not group_name:
        return jsonify({"error": "Group name is required"}), 400

    # create group
    group = GroupHistory(
        group_name=group_name,
        user_id=current_user_id
    )

    db.session.add(group)
    db.session.flush()  # get group_id before commit

    # add creator automatically
    all_user_ids = set(user_ids)
    all_user_ids.add(current_user_id)

    for user_id in all_user_ids:
        member = SavedGroupMember(
            group_id=group.group_id,
            user_id=user_id
        )
        db.session.add(member)

    db.session.commit()

    return jsonify({"message": "Group created", "group_id": group.group_id}), 201


# Get all groups for current user
@groups_bp.route('', methods=['GET'])
@jwt_required()
def get_groups():
    current_user_id = get_jwt_identity()

    memberships = SavedGroupMember.query.filter_by(user_id=current_user_id).all()

    group_ids = [m.group_id for m in memberships]

    groups = GroupHistory.query.filter(GroupHistory.group_id.in_(group_ids)).all()

    result = []
    for group in groups:
        members = SavedGroupMember.query.filter_by(group_id=group.group_id).all()

        member_data = []
        for m in members:
            user = m.user
            member_data.append({
                "user_id": user.user_id,
                "name": f"{user.first_name} {user.last_name}",
                "email": user.email
            })

        result.append({
            "group_id": group.group_id,
            "group_name": group.group_name,
            "created_by": group.user_id,
            "members": member_data
        })

    return jsonify(result), 200


# Get specific group
@groups_bp.route('/<int:group_id>', methods=['GET'])
@jwt_required()
def get_group(group_id):
    group = GroupHistory.query.get(group_id)

    if not group:
        return jsonify({"error": "Group not found"}), 404

    members = SavedGroupMember.query.filter_by(group_id=group_id).all()

    member_data = []
    for m in members:
        user = m.user
        member_data.append({
            "user_id": user.user_id,
            "name": f"{user.first_name} {user.last_name}",
            "email": user.email
        })

    return jsonify({
        "group_id": group.group_id,
        "group_name": group.group_name,
        "created_by": group.user_id,
        "members": member_data
    }), 200


# Delete group (creator only)
@groups_bp.route('/<int:group_id>', methods=['DELETE'])
@jwt_required()
def delete_group(group_id):
    current_user_id = get_jwt_identity()

    group = GroupHistory.query.get(group_id)

    if not group:
        return jsonify({"error": "Group not found"}), 404

    if str(group.user_id) != str(current_user_id):
        return jsonify({"error": "Only creator can delete this group"}), 403

    db.session.delete(group)
    db.session.commit()

    return jsonify({"message": "Group deleted"}), 200
