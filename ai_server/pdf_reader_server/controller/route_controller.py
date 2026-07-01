from flask.views import MethodView
from flask import request, jsonify
from pdf_reader_server.controller.file_converter_pdf_plumber import FileConverterPDFPlumber


class ExtractFirstPage(MethodView):

    def post(self):
        file_path = request.get_json()["file_path"]
        data = FileConverterPDFPlumber().get_first_page_content(file_path)
        return jsonify(data)


class ProcessDocument(MethodView):

    def post(self):
        file_path = request.get_json()["file_path"]
        result = FileConverterPDFPlumber().convert_file_to_json(file_path)
        return jsonify(result["data"])
