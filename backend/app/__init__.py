from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from .config import Config
from .models.user import db

jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config) #loads settings from Config class

    CORS(app) #Required so the frontend can make requests
    jwt.init_app(app)
    db.init_app(app)

    with app.app_context():
        from .models import saved_group  # noqa
        from .models.friendship import Friendship  # noqa
        from .models.session import Session, SessionUser  # noqa
        from .models.session_restaurant import SessionRestaurant  # noqa
        from .models.vote import Vote  # noqa
        from .models.restaurant import Restaurant  # noqa
        db.create_all()

    #Register blueprints - each blueprint is a group of related routes
    from .routes.auth import auth_bp
    from .routes.groups import groups_bp
    from .routes.sessions import sessions_bp
    from .routes.restaurants import restaurants_bp
    from .routes.votes import votes_bp
    from .routes.users import users_bp
    from .routes.friends import friends_bp

    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(restaurants_bp, url_prefix='/restaurants')
    app.register_blueprint(groups_bp, url_prefix='/groups')
    #app.register_blueprint(restaurants_bp, url_prefix='/restaurants')
    app.register_blueprint(sessions_bp, url_prefix='/sessions')
    app.register_blueprint(votes_bp, url_prefix='/votes')
    app.register_blueprint(users_bp, url_prefix='/users')
    app.register_blueprint(friends_bp, url_prefix='/friends')

    return app

