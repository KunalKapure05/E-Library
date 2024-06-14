import { NextFunction,Request,Response } from "express";
import cloudinary  from "../config/cloudinary";
import path from "path";
import createHttpError from "http-errors";

const createBook = async(req:Request,res:Response,next:NextFunction)=>{
try {
    
    console.log("files",req.files);

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };



    const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);

    const fileName = files.coverImage[0].filename;

    const filePath = path.resolve(__dirname,'../../public/data/uploads',fileName)

    const uploadedResult = await cloudinary.uploader.upload(filePath,{
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
    
   
    console.log("uploadResult:",uploadedResult);
    
    return res.json({})
} catch (error) {
    console.error(error);
    return next(createHttpError(500,"Error while uploading the files"))
    
}
}

export {createBook}   