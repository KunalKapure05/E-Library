import { config } from '../config/config';

import passport from "passport";
import passportGoogle from "passport-google-oauth20";
import User from '../Models/User';





const GoogleStrategy = passportGoogle.Strategy;


passport.use(
  new GoogleStrategy(
    {
      clientID:  config.GoogleClientId as string,
      clientSecret: config.GoogleClientSecret as string,
      callbackURL: "/auth/google/redirect",
    },
    async (accessToken, refreshToken, profile, done) => {
        
       try {
        const user = await User.findOne({googleid: profile.id})
 
         if (!user) {
             const newUser = await User.findOneAndUpdate({
                 googleId: profile.id,
               
             },
             {
                 $setOnInsert:{
                     name: profile.displayName,
                     email: profile.emails?.[0].value, // we are using optional chaining because profile.emails may be undefined.
                 }
                 
             },
             {
                 upsert: true,
                 new: true,
             }
         
         );
 
 
         
 
             if (newUser) {
                 done(null, newUser);
               }
             } else {
                 
                 done(null, user);
               }
 
       } catch (error) {
        return done(error);
       }
            
    }
  )
);

passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);


  });