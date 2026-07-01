import Busboy from 'busboy';
import gTTS from 'gtts';
import stream from 'stream';
import { DocumentsHandler } from '../service_handlers/documents_handler.js';

const documentsHandler = new DocumentsHandler();

export const upload_file_and_create_cache = (req, res) => {
    const busboy = Busboy({ headers: req.headers });
    let uploadPromise = null;

    busboy.on('file', (fieldname, file, filename) => {
        try{
            uploadPromise = documentsHandler.uploadDocument(file, filename);
        }catch(err){
            res.status(500).json({message:`Error in Processing file: ${err.message} ` })
        }

    });

    busboy.on('finish', async () => {
        try {
            const response = await uploadPromise;
            console.log(response, "upload Promise")
            if (response.errcode ==1){
                res.status(200).json({
                    message:response.msg,
                    errcode: 1
                })
            }else{
                res.status(200).json({
                    message: 'File Processing Started',
                    document_id: response.document_id,
                    total_pages: response.total_pages,
                    data: response.data,
                });
            }
        } catch (error) {
            console.error('Upload error:', error.message);
            res.status(500).json({ message: `Error processing file: ${error.message}` });
        }
    });

    req.pipe(busboy);
};

export const get_all_books = async (req, res) => {
    try {
        const books = await documentsHandler.getAllBooks();
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const get_book_by_id = async (req, res) => {
    try {
        const book = await documentsHandler.getBookById(Number(req.params.id));
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const get_book_page = async (req, res) => {
    try {
        const page = await documentsHandler.getBookPage(
            Number(req.params.id),
            Number(req.params.page)
        );
        res.json(page);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const get_book_audio = async (req, res) => {
    try {
        const page = await documentsHandler.getBookPage(
            Number(req.params.id),
            Number(req.params.page)
        );
        const text = documentsHandler.getPageTextForAudio(page);
        if (!text) return res.status(422).json({ error: 'No audio content for this page' });

        res.set({
            'Content-Type': 'audio/mpeg',
            'Transfer-Encoding': 'chunked',
            'Content-Disposition': `inline; filename="book_${req.params.id}_page_${req.params.page}.mp3"`,
            'Cache-Control': 'no-cache',
        });

        const audioStream = new gTTS(text, 'en').stream();
        const passThrough = new stream.PassThrough();
        audioStream.pipe(passThrough).pipe(res);
    } catch (error) {
        if (!res.headersSent) res.status(500).json({ message: error.message });
    }
};
