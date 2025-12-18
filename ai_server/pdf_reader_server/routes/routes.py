from flask import Blueprint, request, jsonify
import json

from pdf_reader_server.controller.file_converter_docling import FileConverterDocLing
from pdf_reader_server.controller.file_converter_pdf_plumber import FileConverterPDFPlumber

file_analyser = Blueprint('file_analyser', __name__, url_prefix="/file")

@file_analyser.route('/convert', methods=['POST'])
def file_converter():
    file = request.files['file']  # Werkzeug FileStorage
    print(file)
    obj = FileConverterPDFPlumber()
    # obj = FileConverterDocLing()
    response = obj.convert_file_to_json(file)
    response = json.loads(json.dumps(response, default=list))
    return response

