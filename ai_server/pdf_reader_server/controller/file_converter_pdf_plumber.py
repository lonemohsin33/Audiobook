import tempfile
import pdfplumber
import arabic_reshaper
from bidi.algorithm import get_display
import unicodedata




class FileConverterPDFPlumber:
    def __init__(self):
        pass

    def convert_file_to_json(self, file_object):

        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp:
            while chunk := file_object.read(1024 * 1024):
                tmp.write(chunk)
            pdf_path = tmp.name

        result = self.analyze_pdf_pages(pdf_path)
        return {"code": 0, "data": result}

    # ----------------------------------------------------
    # PDF processing
    # ----------------------------------------------------
    def analyze_pdf_pages(self, pdf_path):
        pages_data = []

        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                tokens = self.read_bilingual_inline(page)

                page_content = {"fa": [], "en": []}

                for token in tokens:
                    page_content[token["lang"]].append(token["text"])

                pages_data.append({
                    "page": page.page_number,
                    "languages": [k for k, v in page_content.items() if v],
                    "content": page_content
                })

        return {
            "total_pages": len(pages_data),
            "pages": pages_data
        }

    # ----------------------------------------------------
    # Inline bilingual reader (CORE LOGIC)
    # ----------------------------------------------------
    def read_bilingual_inline(self, page):
        words = page.extract_words(use_text_flow=True)
        lines = self.group_words_into_lines(words)

        token_stream = []

        for line in lines:
            fa_words = []
            en_words = []

            for w in line["words"]:
                lang = self.word_language(w["text"])
                if lang == "fa":
                    w["text"] = w["text"][::-1]
                    fa_words.append(w)
                elif lang == "en":
                    en_words.append(w)

            # English stays normal
            en_words.sort(key=lambda w: w["x0"])

            if fa_words:
                text = " ".join(w["text"] for w in reversed(fa_words))

                token_stream.append({
                    "lang": "fa",
                    "text": self.normalize_unicode(text)
                })

            if en_words:
                token_stream.append({
                    "lang": "en",
                    "text": " ".join(w["text"] for w in en_words)
                })

        return token_stream

    def is_rtl_reversed(self, words):
        if len(words) < 2:
            return False
        return words[0]["x0"] < words[-1]["x0"]

    # ----------------------------------------------------
    # Helpers
    # ----------------------------------------------------
    def group_words_into_lines(self, words, y_tolerance=3):
        lines = []

        for word in words:
            placed = False
            for line in lines:
                if abs(word["top"] - line["top"]) < y_tolerance:
                    line["words"].append(word)
                    placed = True
                    break
            if not placed:
                lines.append({
                    "top": word["top"],
                    "words": [word]
                })

        return sorted(lines, key=lambda l: l["top"])

    def word_language(self, text):
        for c in text:
            if "\u0600" <= c <= "\u06FF":
                return "fa"
            if "a" <= c.lower() <= "z":
                return "en"
        return "other"


    def normalize_persian(self, text):
        return arabic_reshaper.reshape(text)

    def normalize_fa_word(self, word: str) -> str:
        # Step 1: reverse characters
        reversed_chars = word[::-1]

        # Step 2: reshape Arabic letters
        reshaped = arabic_reshaper.reshape(reversed_chars)

        # Step 3: bidi display order
        return get_display(reshaped)

    def normalize_unicode(self, text: str) -> str:
        # Converts Arabic presentation forms → base Unicode
        return unicodedata.normalize("NFKC", text)



