import path from 'path'
import express from 'express';
import {createBook} from '../Controllers/bookControllers'
import multer from 'multer';
const router = express.Router();

const upload = multer({
    dest:path.resolve(__dirname,'../../public/data/uploads'),
    limits:{fileSize:3e7} 
})



router.post('/',upload.fields([
    {name:"coverImage",maxCount:1},
    {name:"file",maxCount:1}
]),createBook);


export default router