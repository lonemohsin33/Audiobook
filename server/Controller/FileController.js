import fs from "fs"
import Busboy from 'busboy'; // ✅ will work in older versions
import path from 'path';
import { initialize } from "./ContentController.js";
import {setContentList} from "../store.js"
import axios from "axios";
import FormData from "form-data";

let global_content_list = [];

export const upload_file_and_create_cache = (req, res)=>{
    const busboy = Busboy({ headers: req.headers });
    let call_to_ai;

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        console.log(`File [${fieldname}]: filename: ${filename}, encoding: ${encoding}, mimetype: ${mimetype}`);

        const form = new FormData();

        form.append('file', file, { filename: filename, contentType: mimetype  });

        call_to_ai = axios.post('http://localhost:5000/file/convert', form, {
            headers: {
                ...form.getHeaders()
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        });
    });

    busboy.on('finish', async () => {
        console.log('Upload finished');
        try {
            const ai_response = await call_to_ai;
            // console.log('Response from AI service:', ai_response.data);
            // const content_list = ai_response.data['content_list'];
            setContentList(ai_response.data.data);
            // await initialize(); // Re-initialize with new content
            res.status(200).json({ message: 'File uploaded and cache created successfully', data: ai_response.data.data });
        } catch (error) {
            console.error('Error processing file with AI service:', error);
            res.status(500).json({ message: 'Error processing file' });
        }
    });

    req.pipe(busboy);   


}