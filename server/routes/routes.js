import express from "express"
import {get_content_using_page, get_audio_using_page} from "../Controller/ContentController.js"
import {upload_file_and_create_cache} from "../Controller/FileController.js"

const router = express.Router()

router.get('/page/:number', get_content_using_page) 
router.get('/page/audio/:number', get_audio_using_page) 
router.post('/file/upload', upload_file_and_create_cache) 



export default router;


