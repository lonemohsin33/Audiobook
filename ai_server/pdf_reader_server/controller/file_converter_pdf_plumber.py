import pdfplumber


class FileConverterPDFPlumber:
    def convert_file_to_json(self, file_path):
        result = self.analyze_pdf_pages(file_path)
        return {"code": 0, "data": result}

    def get_first_page_content(self, file_path):
        with pdfplumber.open(file_path) as pdf:
            page = pdf.pages[0]
            page_content = self._tokens_to_page_content(self.read_bilingual_inline(page))
            return {
                "page": page.page_number,
                "languages": [k for k, v in page_content.items() if v],
                "content": page_content,
                "aligned_data": [],
                "total_pages": len(pdf.pages),
            }

    def analyze_pdf_pages(self, pdf_path):
        pages_data = []

        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                page_content = self._tokens_to_page_content(self.read_bilingual_inline(page))
                pages_data.append({
                    "page": page.page_number,
                    "languages": [k for k, v in page_content.items() if v],
                    "content": page_content,
                    "aligned_data": [],
                })

        return {"total_pages": len(pages_data), "pages": pages_data}

    def _tokens_to_page_content(self, tokens):
        page_content = {"fa": [], "en": []}
        for token in tokens:
            page_content[token["lang"]].append({
                "type": token["type"],
                "text": token["text"],
            })
        return page_content

    def read_bilingual_inline(self, page):
        words = page.extract_words(use_text_flow=True)
        lines = self.group_words_into_lines(words)

        token_stream = []
        page_width = page.width

        for line in lines:
            line_words = line["words"]
            min_x = min(w["x0"] for w in line_words)
            max_x = max(w["x1"] for w in line_words)
            coverage = (max_x - min_x) / page_width

            fa_words, en_words = [], []

            for w in line_words:
                lang = self.word_language(w["text"])
                if lang == "fa":
                    w["text"] = w["text"][::-1]
                    fa_words.append(w)
                elif lang == "en":
                    en_words.append(w)

            en_words.sort(key=lambda w: w["x0"])

            if fa_words and not en_words and coverage > 0.6:
                token_stream.append({
                    "type": "heading",
                    "lang": "fa",
                    "text": " ".join(w["text"] for w in reversed(fa_words)),
                })
                continue

            if fa_words:
                token_stream.append({
                    "type": "text",
                    "lang": "fa",
                    "text": " ".join(w["text"] for w in reversed(fa_words)),
                })

            if en_words:
                token_stream.append({
                    "type": "text",
                    "lang": "en",
                    "text": " ".join(w["text"] for w in en_words),
                })

        return token_stream

    def group_words_into_lines(self, words, y_tolerance=3):
        lines = []
        for word in words:
            for line in lines:
                if abs(word["top"] - line["top"]) < y_tolerance:
                    line["words"].append(word)
                    break
            else:
                lines.append({"top": word["top"], "words": [word]})
        return sorted(lines, key=lambda l: l["top"])

    def word_language(self, text):
        for c in text:
            if "\u0600" <= c <= "\u06FF":
                return "fa"
            if "a" <= c.lower() <= "z":
                return "en"
        return "other"
