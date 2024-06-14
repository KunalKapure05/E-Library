import express from 'express';
import {createBook} from '../Controllers/bookControllers'
const router = express.Router();


router.post('/',createBook);


export default router