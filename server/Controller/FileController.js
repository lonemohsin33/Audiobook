import fs from "fs"
import Busboy from 'busboy'; // ✅ will work in older versions
import path from 'path';
import { initialize } from "./ContentController.js";
import {setContentList} from "../store.js"

let global_content_list = [];

export const upload_file_and_create_cache = (req, res)=>{
    const busboy = new Busboy({ headers: req.headers });
    let responded = false;
    const pages_data = []
    let total_pages = 0

    busboy.on('file', async (fieldname, file, filename, encoding, mimetype) => {
        
        console.log(mimetype)
        console.log(encoding)
        console.log(fieldname)

        console.log(`📥 Receiving file: ${filename}`);
        const saveTo = path.join('uploads', filename);
        if (fs.existsSync(saveTo)){
                const parsed = path.parse(filename);
            
                // Remove `.pdf`, keep `bioauth.drawio`
                const jsonFilename = `${parsed.name}.json`;
            const cachePath = path.join('cache', jsonFilename)
            
            let pages_data = JSON.parse(fs.readFileSync(cachePath, 'utf-8'))
            setContentList(pages_data)
            total_pages = pages_data.length
            pages_data = pages_data[0].length>0?pages_data[0]:pages_data[1]
            responded = true
            file.resume()
            return res.status(200).json({
                "msg": "File Already Uploaded", 
                pages_data: pages_data,
                total_pages:total_pages
            })
        }
        const writeStream = fs.createWriteStream(saveTo);

        file.pipe(writeStream);

        file.on('end', async () => {
            pages_data, total_pages = await initialize(saveTo, filename, mimetype)
            setContentList(pages_data)

            console.log('✅ File upload complete:', filename);
        });
    });

    busboy.on('finish', () => {
    if (!responded) {
      res.status(200).json({ message: 'Upload complete' , pages_data: pages_data, total_pages:total_pages});
    }
    });

    req.pipe(busboy);


}