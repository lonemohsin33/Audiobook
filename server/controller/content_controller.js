import gTTS from 'gtts';
import stream from 'stream';

import { getPageContent } from '../service_handlers/content_handler.js';
import { getContentList } from '../store.js';

export const get_content_using_page = (req, res) => {
    const pageNum = parseInt(req.params.number, 10);
    const pageContent = getPageContent(pageNum);

    if (!pageContent) {
        return res.status(400).json({ error: 'Invalid page number' });
    }

    res.json({ page: pageNum, pages_data: pageContent });
};

export const get_audio_using_page = async (req, res) => {
    try {
        const pageNum = parseInt(req.params.number, 10);
        const content = await getContentList();

        if (isNaN(pageNum)) {
            return res.status(400).json({ error: 'Page number must be a valid integer' });
        }

        if (pageNum < 1 || pageNum > content.length) {
            return res.status(404).json({
                error: `Page number out of range (1-${content.length})`,
                availablePages: content.length,
            });
        }

        const pageContent = content[pageNum - 1];

        if (!pageContent || pageContent.trim().length === 0) {
            return res.status(422).json({ error: 'Requested page has no content' });
        }

        res.set({
            'Content-Type': 'audio/mpeg',
            'Transfer-Encoding': 'chunked',
            'Content-Disposition': `inline; filename="page_${pageNum}.mp3"`,
            'Cache-Control': 'no-cache',
        });

        const audioStream = new gTTS(pageContent, 'en').stream();
        const passThrough = new stream.PassThrough();

        audioStream.on('error', (err) => {
            console.error('TTS conversion error:', err);
            if (!res.headersSent) {
                res.status(500).json({ error: 'Audio conversion failed' });
            }
        });

        passThrough.on('error', (err) => {
            console.error('Stream error:', err);
            if (!res.headersSent) {
                res.status(500).json({ error: 'Stream error occurred' });
            }
        });

        audioStream.pipe(passThrough).pipe(res);
    } catch (error) {
        console.error('Server error:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Internal server error', details: error.message });
        }
    }
};
