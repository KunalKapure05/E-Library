import express from 'express';
import {register} from '../Controllers/userControllers'
const router = express.Router();


router.post('/register',register)

export default router