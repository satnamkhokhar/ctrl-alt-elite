from app import create_app # imports create_app function from backend/app/__init__.py

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)