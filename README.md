# PDF Reader / Audiobook

An Eventual bilingual PDF reader (currently reads only english) that extracts page-by-page text from uploaded PDFs, stores it for fast lookup, and can read pages aloud as generated audio — effectively turning any PDF into an audiobook.

The project is split into three parts:

- **Frontend** — React + TypeScript + Vite app for uploading PDFs, browsing pages, and listening to page audio.
- **Backend (`server/`)** — Node.js/Express API that handles uploads, persists document metadata via Prisma/PostgreSQL, and generates text-to-speech audio with `gtts`.
- **AI service (`ai_server/`)** — Python/Flask microservice that parses PDFs with `pdfplumber`, later separating and tagging any language vs. English text per line so bilingual pages render correctly.

## Architecture

```
Browser  ─────▶  Express API (server/)  ─────▶  Flask AI service (ai_server/)
                        │                              │
                        ▼                              ▼
                 PostgreSQL (Prisma)              pdfplumber extraction
```

The Express server receives the uploaded PDF and forwards the file itself (as a multipart upload, not just a path) to the Flask service for parsing — the two services don't need to share a filesystem, so they can be deployed on separate hosts/containers. Extracted content is cached in PostgreSQL (`documents` and `document_pages` tables) so pages don't need to be re-parsed on every request.

## Tech Stack

| Layer      | Tech |
|------------|------|
| Frontend   | React 19, TypeScript, Vite, Tailwind CSS, React Router |
| Backend    | Node.js, Express 5, Prisma, Busboy (file uploads), Axios |
| AI Service | Python, Flask, pdfplumber, Gunicorn |
| Database   | PostgreSQL |
| Audio      | `gtts` (Google Text-to-Speech) |

## Project Structure

```
├── src/                      # React frontend
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── assets/
├── server/                   # Express backend
│   ├── controller/           # Route handlers
│   ├── service_handlers/     # Business logic (documents, AI client, content)
│   ├── routes/
│   └── Models/               # Prisma client
├── ai_server/                 # Flask AI microservice
│   └── pdf_reader_server/
│       ├── controller/       # PDF parsing logic (pdfplumber)
│       └── routes/
├── prisma/
│   └── schema.prisma          # Document / DocumentPage / users models
└── file_dir/                  # Uploaded PDFs (local storage)
```

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL database

### 1. Frontend + Backend setup

```bash
npm install
```

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/pdf_reader
VITE_API_URL=http://localhost:3000
AI_URL=http://localhost:5000
```

Run database migrations / generate the Prisma client:

```bash
npm run db:generate
```

Start the backend API:

```bash
npm run start        # Express server on http://localhost:3000
```

Start the frontend dev server:

```bash
npm run dev           # Vite dev server
```

### 2. AI service setup

```bash
cd ai_server
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Run it locally:

```bash
python -m flask --app pdf_reader_server.flask_app run --port 5000
```

Or with Gunicorn (production):

```bash
gunicorn -w 4 -b 0.0.0.0:5000 "pdf_reader_server.flask_app:create_app()"
```

## Available Scripts

| Command             | Description                          |
|----------------------|---------------------------------------|
| `npm run dev`         | Start Vite dev server (frontend)     |
| `npm run build`       | Type-check and build for production  |
| `npm run start`       | Start the Express backend            |
| `npm run lint`        | Run ESLint                            |
| `npm run db:generate` | Generate the Prisma client            |
| `npm run db:pull`     | Pull DB schema into `schema.prisma`   |

## API Overview

| Method | Endpoint                     | Description                          |
|--------|-------------------------------|---------------------------------------|
| POST   | `/file/upload`                | Upload a PDF, kick off processing     |
| GET    | `/books`                      | List all uploaded documents           |
| GET    | `/books/:id`                  | Get a document's details              |
| GET    | `/books/:id/pages/:page`      | Get extracted content for a page      |
| GET    | `/books/:id/audio/:page`      | Stream generated audio for a page     |

## Notes

- PDF parsing distinguishes Farsi and English text per line (`file_converter_pdf_plumber.py`), preserving reading order for bilingual documents.
- Large documents are processed in two stages: the first page is extracted synchronously so the reader can start immediately, while the remaining pages are processed in the background.
- Never commit secrets (API keys, tokens, `.env` files) to the repository — use environment variables and keep `.env` in `.gitignore`.



## Live Test
- [Test it live here](https://audiobook-ebon.vercel.app/)
