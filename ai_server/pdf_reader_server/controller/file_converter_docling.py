import tempfile
from docling.document_converter import DocumentConverter, PdfFormatOption





class FileConverterDocLing:
    def __init__(self):
        self.converter = DocumentConverter(
            format_options={
                "pdf": PdfFormatOption(
                    enable_ocr=False,  #  disable OCR
                    enable_layout=False,  #  disable layout analysis
                    enable_table_structure=False  # disable table parsing
                )
            }
        )

    def convert_file_to_json(self, file_object):

        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp:
            while chunk := file_object.read(1024 * 1024):
                tmp.write(chunk)
            pdf_path = tmp.name
        print("i am here")

        # Convert using Docling
        doc = self.converter.convert(pdf_path)

        print("i am here2")

        result = self.process_docling_output(doc)
        return {"code": 0, "data": result}

    def process_docling_output(self, doc):
        pages = {}

        # pages is a dict: {page_number: Page}
        for page_num, page in doc.document.pages.items():

            for block in page.blocks:
                text = block.text.strip()
                if not text:
                    continue

                lang = self.detect_language_simple(text)

                pages.setdefault(page_num, {"fa": [], "en": []})
                pages[page_num][lang].append(text)

        page_list = []
        for page_num in sorted(pages.keys()):
            content = pages[page_num]
            page_list.append({
                "page": page_num,
                "languages": [k for k, v in content.items() if v],
                "content": content
            })

        return {
            "total_pages": len(page_list),
            "pages": page_list
        }

    def detect_language_simple(self, text):
        # Simple + robust for Persian/English
        for c in text:
            if "\u0600" <= c <= "\u06FF":
                return "fa"
        return "en"