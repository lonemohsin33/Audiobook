from flask import Flask
import requests
from pdf_reader_server.routes.routes import file_analyser

app = Flask(__name__)
app.register_blueprint(file_analyser)


if __name__ == "__main__":
    app.run(debug=True)