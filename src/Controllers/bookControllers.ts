import { NextFunction,Request,Response } from "express";
import cloudinary  from "../config/cloudinary";
import path from "path";
import createHttpError from "http-errors";
import fs from "fs"
import Book from "../Models/Book";

const createBook = async(req:Request,res:Response,next:NextFunction)=>{
try {
    const user = req.params.user
    const {title,genre} = req.body;
    console.log("files",req.files);

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };



    const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);

    const fileName = files.coverImage[0].filename;

    const ImagefilePath = path.resolve(__dirname,'../../public/data/uploads',fileName)

    const uploadedResult = await cloudinary.uploader.upload(ImagefilePath,{
        filename_override:fileName,
        folder: 'book-covers',
        format:coverImageMimeType,

    })

    const bookFileName = files.file[0].filename;
    const bookFilePath = path.resolve(__dirname,'../../public/data/uploads',bookFileName)

   
    const bookFileUpload= await cloudinary.uploader.upload(bookFilePath,{
        resource_type:'raw',
        filename_override:bookFileName,
        folder:'book-pdfs',
        format:'pdf'
    })
    console.log("BookuploadResult:",bookFileUpload);
    
    const newBook = await Book.create({
        title,
        genre ,
        coverImage:uploadedResult.secure_url,
        file:bookFileUpload.secure_url,
        author: "666b48a124f54e24ce403256"
       })
   
    console.log("uploadResult:",uploadedResult);
    
    //This will delete temp files which are there in Public/data/uploads folder
    try {
        await fs.promises.unlink(ImagefilePath)
        await fs.promises.unlink(bookFilePath)
        
    } catch (error) {
        return next(createHttpError(500,"Error in deleting temp files"))
    }
    
    return res.status(201).json({id: newBook._id})
} catch (error) {
    console.error(error);
    return next(createHttpError(500,"Error while uploading the files"))
    
}
}

export {createBook}   