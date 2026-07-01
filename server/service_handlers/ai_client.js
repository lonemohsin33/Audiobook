import axios from 'axios';

const AI_URL = process.env.AI_URL || 'http://localhost:5000';

export async function extractFirstPage(filePath) {
    const { data } = await axios.post(
        `${AI_URL}/ai/extract-first-page`,
        { file_path: filePath },
        { timeout: 300000 }
    );
    return data;
}

export async function processDocument(filePath) {
    const { data } = await axios.post(
        `${AI_URL}/ai/process-document`,
        { file_path: filePath },
        { timeout: 600000 }
    );
    return data;
}
