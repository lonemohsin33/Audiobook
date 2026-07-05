from flask import Blueprint
from pdf_reader_server.controller.route_controller import ExtractFirstPage, ProcessDocument


def dummy():
    return """
    <html>
        <body>
            <h1>Hello, World!</h1>
        </body>
    </html>
    """
ai_router = Blueprint('ai', __name__, url_prefix="/ai")

ai_router.add_url_rule('/extract-first-page', view_func=ExtractFirstPage.as_view('extract_first_page'))
ai_router.add_url_rule('/process-document', view_func=ProcessDocument.as_view('process_document'))
ai_router.add_url_rule( "/dummy",view_func=dummy,methods=["GET"])