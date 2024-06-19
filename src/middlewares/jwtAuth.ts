import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { JsonWebTokenError, TokenExpiredError, verify } from "jsonwebtoken";
import { config } from "../config/config";
import { AuthRequest } from "../Interfaces/AuthRequest";

const jwtAuth = (req:Request,res:Response,next:NextFunction)=>{
   
   
    const authorization = req.headers.authorization;
    if(!authorization){
        return next(createHttpError(401,"Token not found"))
       }
        
        try {

            const token = authorization.split(" ")[1];
            const decoded = verify(token,config.jwtKey as string);
            const _req = req as unknown as AuthRequest;
            _req.userId = decoded.sub as string;
           
            console.log(decoded);
    
            next();
            
        }
        catch (error) {
            if (error instanceof TokenExpiredError) {
                return next(createHttpError(401, "Expired token"));
            } else if (error instanceof JsonWebTokenError) {
                return next(createHttpError(401, "Invalid token"));
            } else {
                return next(createHttpError(401, "Token verification failed"));
            }
        }

        
    
    


  
}

export default jwtAuth;