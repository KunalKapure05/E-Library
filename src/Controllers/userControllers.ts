import { NextFunction,Request,Response } from "express";
import User from '../Models/User';
import createHttpError from "http-errors";

 export const createUser = async function(req:Request,res:Response,next:NextFunction){
    const {name,email,password} = req.body;
   if(!name || !email || !password){
    const error =  createHttpError(400,"All fields are required")
     return next(error);
   }

   const user = await User.findOne({email})
   if(user){
    const error = createHttpError(400,'User already exists with this e-mail')
    return next(error);
   }

//    const 

   }

