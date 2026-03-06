import os

from dotenv import load_dotenv

load_dotenv() #finds .env file and loads all the variables

class Config:
    JWT_SECRET_KEY = os.getenv('JWT_SECRET')

    SQLALCHEMY_DATABASE_URI = (
        f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASS')}"
        f"@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
    )