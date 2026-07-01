import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import fs from 'fs';
import path from 'path';
import { getContentList } from '../store.js';

let pages = [];

export async function extractTextByPage(pdfPath) {
    const doc = await pdfjsLib.getDocument(pdfPath).promise;
    const pagesArray = [];

    for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(' ');
        pagesArray.push(pageText.trim());
    }

    return pagesArray;
}

export async function initialize(doc_path, filename, filetype) {
    const parsed = path.parse(filename);
    const jsonFilename = `${parsed.name}.json`;
    const cachePath = path.join('cache', jsonFilename);

    if (fs.existsSync(cachePath)) {
        pages = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
        return pages[0], pages.length;
    }

    if (filetype === 'application/pdf') {
        pages = await extractTextByPage(doc_path);
        fs.writeFileSync(cachePath, JSON.stringify(pages, null, 2));
        return JSON.parse(pages)[0], pages.length;
    }
}

export function getPageContent(pageNum) {
    const content = getContentList();
    if (isNaN(pageNum) || pageNum < 1 || pageNum > content.length) {
        return null;
    }
    return content[pageNum - 1];
}

export function getTotalPages() {
    return pages.length;
}
