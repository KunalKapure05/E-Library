import express from 'express';
import {createUser} from '../Controllers/userControllers'
const router = express.Router();


router.post('register',createUser)

export default router