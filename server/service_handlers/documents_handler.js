import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import prisma from '../Models/prisma_client.js';
import { extractFirstPage, processDocument } from './ai_client.js';
import { error } from 'console';

const FILE_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../file_dir');

if (!fs.existsSync(FILE_DIR)) {
    fs.mkdirSync(FILE_DIR, { recursive: true });
}

export class DocumentsHandler {

    saveUploadedFile(file, filename) {
        const name = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
        const filePath = path.join(FILE_DIR, name);
        const ws = fs.createWriteStream(filePath);
        return {
            filePath,
            fileName: filename,
            writeDone: new Promise((resolve, reject) => {
                ws.on('finish', resolve);
                ws.on('error', reject);
                file.pipe(ws);
            }),
        };
    }

    async createDocument(fileName, filePath, totalPages) {
        return prisma.document.create({
            data: {
                name: fileName,
                user_id: 1,
                file_path: filePath,
                upload_status: 'pending',
                total_pages: totalPages,
            },
        });
    }

    async getAllBooks() {
        return prisma.document.findMany({ orderBy: { id: 'desc' } });
    }

    async saveFirstPage(documentId, firstPage) {
        await prisma.documentPage.create({
            data: {
                document_id: documentId,
                page_number: 1,
                content: JSON.stringify({
                    content: firstPage.content,
                    aligned_data: firstPage.aligned_data || [],
                }),
                language: firstPage.languages?.length ? firstPage.languages.join(',') : null,
            },
        });
    }

    async saveDocumentPages(documentId, data) {
        await prisma.documentPage.deleteMany({ where: { document_id: documentId } });
        await prisma.documentPage.createMany({
            data: data.pages.map((page) => ({
                document_id: documentId,
                page_number: page.page,
                content: JSON.stringify({
                    content: page.content,
                    aligned_data: page.aligned_data,
                }),
                language: page.languages?.length ? page.languages.join(',') : null,
            })),
        });

        await prisma.document.update({
            where: { id: documentId },
            data: {
                upload_status: 'processed',
                total_pages: data.total_pages,
            },
        });
    }

    async markDocumentFailed(documentId) {
        await prisma.document.update({
            where: { id: documentId },
            data: { upload_status: 'failed' },
        });
    }

    async uploadDocument(file, filename) {
        try{

            console.log("file")
            const { filePath, fileName, writeDone } = this.saveUploadedFile(file, filename);
            await writeDone;
            
            const firstPage = await extractFirstPage(filePath);
            console.log(firstPage, "firstpage")
            
            const document = await this.createDocument(fileName, filePath, firstPage.total_pages);
            await this.saveFirstPage(document.id, firstPage);

            this.processDocumentInBackground(document.id, filePath);
            
            return {
                document_id: document.id,
                total_pages: firstPage.total_pages,
                msg: 'File Processing Started.',
                data: firstPage,
            };
        }catch(err){
            return {"msg": `Error in saving file: ${err.message}`, "errcode":1}
        }
    }

    async processDocumentInBackground(documentId, filePath) {
        try {
            const data = await processDocument(filePath);
            await this.saveDocumentPages(documentId, data);
        } catch (error) {
            console.error('Background processing failed:', error.message);
            await this.markDocumentFailed(documentId);
        }
    }

    async getBookPage(id, pageNumber) {
        const page = await prisma.documentPage.findFirst({
            where: { document_id: id, page_number: pageNumber },
        });
        if (!page) throw new Error('Page not found');
        return page;
    }

    getPageTextForAudio(pageRec) {
        const parsed = JSON.parse(pageRec.content);
        const content = parsed.content || {};
        const lang = content.en?.length ? 'en' : Object.keys(content).find((k) => content[k]?.length);
        if (!lang) return '';
        return content[lang].map((b) => b.text).join(' ').trim();
    }

    async getBookById(id) {
        console.log(typeof(id))
        const document =  await prisma.document.findUnique({ where: { id } });
        if (!document) {
            throw new Error("Document not found");
          }
        let response = {
            id: document.id,
            name: document.name,
            file_path: document.file_path,
            total_pages: document.total_pages,

        }

        const first_page = await prisma.documentPage.findFirst({ where: { document_id: id , page_number: 1} });
        response.first_page_rec = first_page;
        return response;
    }
}
