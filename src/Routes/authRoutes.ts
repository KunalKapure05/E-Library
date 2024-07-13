  import express, { Request, Response, NextFunction } from 'express';
  import passport from 'passport';
import {sign} from 'jsonwebtoken'
import {UserType} from '../Interfaces/UserType'
import {config} from '../config/config'
  const router = express.Router();




  router.get('/login', (req: Request, res: Response) => {
    if (req.user) {
      return res.redirect("/profile");
    }
    res.render("login");
  });

  router.get('/logout', async (req: Request, res: Response, next: NextFunction) => {
    req.logout((err: any) => {
      if (err) {
        return next(err);
      }

      
      res.redirect('/');
    });
  });

  router.get(
    '/google',
    passport.authenticate('google', {
      scope: ['email', 'profile'],
      prompt:'select_account' 
    })
  );

  router.get('/google/redirect',passport.authenticate('google'),(req: Request, res: Response) =>{
    const user = req.user as UserType;
    const jwtToken = sign({ sub: user._id }, config.jwtKey as string, { expiresIn: "3d" });
    res.cookie('jwt', jwtToken, { httpOnly: true });
    res.redirect('/profile');
    console.log(jwtToken);
    
    
    }
  );

  export default router;
