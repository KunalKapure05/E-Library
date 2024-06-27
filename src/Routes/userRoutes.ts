import express from 'express';
import {register,login, logout,fetchUsers} from '../Controllers/userControllers'
const router = express.Router();


router.post('/register',register)
router.post('/login',login)
router.get('/fetch',fetchUsers);
router.post('/logout',logout)

export default router