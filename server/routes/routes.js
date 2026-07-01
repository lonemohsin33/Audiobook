import express from "express"
import { get_content_using_page, get_audio_using_page } from "../controller/content_controller.js"
import { upload_file_and_create_cache, get_all_books, get_book_by_id, get_book_page, get_book_audio } from "../controller/file_controller.js"
const router = express.Router()

router.get('/page/:number', get_content_using_page)
router.get('/page/audio/:number', get_audio_using_page)
router.post('/file/upload', upload_file_and_create_cache)
router.get('/books', get_all_books)
router.get('/books/:id/pages/:page', get_book_page)
router.get('/books/:id/audio/:page', get_book_audio)
router.get('/books/:id', get_book_by_id)
export default router;
