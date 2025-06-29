import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import fs from 'fs';
import say from 'say'; // If using ESM
import gTTS from 'gtts';
import stream from 'stream';
import path from 'path';
import {getContentList} from "../store.js"

// or: const say = require('say'); // for CommonJS




const pdfPath = '/home/lonemohsin/Downloads/pdfcoffee.com_renegade-immortal-pdf-free.pdf';
const cachePath = 'cached_pages.json';

let pages = [];

export async function extractTextByPage(pdfPath) {
  const loadingTask = pdfjsLib.getDocument(pdfPath);
  const doc = await loadingTask.promise;
  const numPages = doc.numPages;

  const pagesArray = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await doc.getPage(i);
    const textContent = await page.getTextContent();

    const pageText = textContent.items.map(item => item.str).join(' ');
    pagesArray.push(pageText.trim());
  }

  return pagesArray;
}

export async function initialize(doc_path, filename, filetype) {
    const parsed = path.parse(filename);

    // Remove `.pdf`, keep `bioauth.drawio`
    const jsonFilename = `${parsed.name}.json`;
    console.log(doc_path)
    const cachePath = path.join('cache', jsonFilename)
  if (fs.existsSync(cachePath)) {
    console.log('📄 Loading from cache...');
    pages = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
    console.log(`✅ Loaded ${pages.length} pages`);
    return pages[0], pages.length 
  } else {
    console.log('📥 Parsing PDF with pdfjs...');
    console.log(filetype)
    if (filetype === 'application/pdf') {
        console.log('✅ PDF file received:', filename);
        pages = await extractTextByPage(doc_path);
        fs.writeFileSync(cachePath, JSON.stringify(pages, null, 2));
        console.log(`✅ Extracted and cached ${pages.length} pages`);
        return JSON.parse(pages)[0], pages.length
    // res.send('PDF accepted');
    }else{
        console.log(`supports only pdf yet`);
    }
   
  }
}

export const get_content_using_page = (req, res) => {
  const pageNum = parseInt(req.params.number, 10);
  console.log(pageNum)
  const content = getContentList()
//   console.log(getContentList())
  if (isNaN(pageNum) || pageNum < 1 || pageNum > content.length) {
    return res.status(400).json({ error: 'Invalid page number' });
  }
  console.log(getContentList)
  const pageContent = content[pageNum - 1]

  res.json({
    page: pageNum,
    pages_data: pageContent
  });
}

export const get_total_pages = (req, res) => {
  res.json({ totalPages: pages.length });
};

const speak = (text) => {
  say.speak(text, null, 1.0, (err) => {
    if (err) {
      console.error('❌ TTS Error:', err);
    } else {
      console.log('✅ Speech done.');
    }
  });
};

// Audio endpoint
export const get_audio_using_page = async (req, res) => {
  try {
    const pageNum = parseInt(req.params.number, 10);
    const content = await getContentList(); // Make sure this is async if it needs to be

    // Validation
    if (isNaN(pageNum)) {
      return res.status(400).json({ error: 'Page number must be a valid integer' });
    }

    if (pageNum < 1 || pageNum > content.length) {
      return res.status(404).json({ 
        error: `Page number out of range (1-${content.length})`,
        availablePages: content.length
      });
    }

    const pageContent = content[pageNum - 1];

    if (!pageContent || pageContent.trim().length === 0) {
      return res.status(422).json({ error: 'Requested page has no content' });
    }

    // Text-to-speech conversion
    const gtts = new gTTS(pageContent, 'en');

    // Stream configuration
    res.set({
      'Content-Type': 'audio/mpeg',
      'Transfer-Encoding': 'chunked',
      'Content-Disposition': `inline; filename="page_${pageNum}.mp3"`,
      'Cache-Control': 'no-cache' // Important for dynamic content
    });

    // Create streams
    const audioStream = gtts.stream();
    const passThrough = new stream.PassThrough();

    // Error handling for streams
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

    // Pipe the streams
    audioStream.pipe(passThrough).pipe(res);

  } catch (error) {
    console.error('Server error:', error);
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Internal server error',
        details: error.message 
      });
    }
  }
};

