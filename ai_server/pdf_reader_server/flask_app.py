from flask import Flask
from pdf_reader_server.routes.routes import ai_router


def create_app():
    app = Flask(__name__)
    app.register_blueprint(ai_router)
    return app


if __name__ == "__main__":
    create_app().run(debug=True)
