import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();


import {UserType } from '../Interfaces/UserType'


const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    res.redirect('/auth/login');
  } else {
    next();
  }
};
router.get('/', checkAuth,(req: Request, res: Response) => {
  const user = req.user as UserType;
  res.render('profile', { user });
});



export default router;
export { checkAuth };
