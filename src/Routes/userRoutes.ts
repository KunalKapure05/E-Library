import express from 'express';
import {register,login, fetchUsers} from '../Controllers/userControllers'
const router = express.Router();


router.post('/register',register)
router.post('/login',login)
router.get('/fetch',fetchUsers);

export default router