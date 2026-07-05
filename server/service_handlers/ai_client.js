import axios from 'axios';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';

const AI_URL = process.env.AI_URL || 'http://localhost:5000';

function buildFileForm(filePath) {
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath), path.basename(filePath));
  return form;
}

export async function extractFirstPage(filePath) {
    try {
      const form = buildFileForm(filePath);
      const { data } = await axios.post(
        `${AI_URL}/ai/extract-first-page`,
        form,
        {
          headers: form.getHeaders(),
          timeout: 300000,
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        }
      );

      return data;
    } catch (err) {
      console.log("AI URL:", AI_URL);
      console.log("Status:", err.response?.status);
      console.log("Response:", err.response?.data);
      console.log("Message:", err.message);

      throw err;
    }
  }

export async function processDocument(filePath) {
    try{
        const form = buildFileForm(filePath);
        const { data } = await axios.post(
            `${AI_URL}/ai/process-document`,
            form,
            {
              headers: form.getHeaders(),
              timeout: 600000,
              maxContentLength: Infinity,
              maxBodyLength: Infinity,
            }
        );
        return data;
    }catch(err){
        console.log("AI URL:", AI_URL);
        console.log("Status:", err.response?.status);
        console.log("Response:", err.response?.data);
        console.log("Message:", err.message);

        throw err;
    }
}
