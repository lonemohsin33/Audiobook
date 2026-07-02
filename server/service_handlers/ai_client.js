import axios from 'axios';

const AI_URL = process.env.AI_URL || 'http://localhost:5000';

export async function extractFirstPage(filePath) {
    try {
        console.log(filePath)
      const { data } = await axios.post(
        `${AI_URL}/ai/extract-first-page`,
        { file_path: filePath },
        { timeout: 300000 }
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

        const { data } = await axios.post(
            `${AI_URL}/ai/process-document`,
            { file_path: filePath },
            { timeout: 600000 }
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
