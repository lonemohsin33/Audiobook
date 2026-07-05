import os
import tempfile

from flask.views import MethodView
from flask import request, jsonify
from pdf_reader_server.controller.file_converter_pdf_plumber import FileConverterPDFPlumber


def _save_uploaded_file():
    uploaded = request.files["file"]
    suffix = os.path.splitext(uploaded.filename or "")[1] or ".pdf"
    fd, temp_path = tempfile.mkstemp(suffix=suffix)
    os.close(fd)
    uploaded.save(temp_path)
    return temp_path


class ExtractFirstPage(MethodView):

    def post(self):
        temp_path = _save_uploaded_file()
        try:
            data = FileConverterPDFPlumber().get_first_page_content(temp_path)
            return jsonify(data)
        finally:
            os.remove(temp_path)


class ProcessDocument(MethodView):

    def post(self):
        temp_path = _save_uploaded_file()
        try:
            result = FileConverterPDFPlumber().convert_file_to_json(temp_path)
            return jsonify(result["data"])
        finally:
            os.remove(temp_path)
