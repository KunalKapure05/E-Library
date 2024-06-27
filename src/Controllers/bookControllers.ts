import { NextFunction,Request,Response } from "express";
import cloudinary  from "../config/cloudinary";
import path from "path";
import createHttpError from "http-errors";
import fs from "fs"
import Book from "../Models/Book";
import { AuthRequest } from "../Interfaces/AuthRequest";

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
    
    const _req  = req as unknown as AuthRequest
    const newBook = await Book.create({
        title,
        genre ,
        coverImage:uploadedResult.secure_url,
        file:bookFileUpload.secure_url,
        author: _req.userId
       })
   
    console.log("uploadResult:",uploadedResult);
    
    //This will delete temp files which are there in Public/data/uploads folder
   try {
     await fs.promises.unlink(ImagefilePath)
     await fs.promises.unlink(bookFilePath)
   } catch (error) {
    return next(createHttpError('500','Server Issue for deletion of temp files'))
   }
    
    return res.status(201).json({id: newBook._id})
} catch (error) {
    console.error(error);
    return next(createHttpError(500,"Server Issue while uploading the files"))
    
}
}


const updateBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, genre } = req.body;
        const bookId = req.params.bookId;

        const book = await Book.findById(bookId);
        if (!book) return next(createHttpError(404, "Book not found"));

        const _req = req as unknown as AuthRequest;
        if (book.author.toString() !== _req.userId) {
            return next(createHttpError(403, "Unauthorized to update book"));
        }

        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        // Check if Image field exists
        let completeCoverImage = book.coverImage;
        if (files.coverImage) {
            const fileName = files.coverImage[0].filename;
            const convertMimeType = files.coverImage[0].mimetype.split('/').at(-1);
            const ImagefilePath = path.resolve(__dirname, '../../public/data/uploads', fileName);

            const uploadedResult = await cloudinary.uploader.upload(ImagefilePath, {
                filename_override: fileName,
                folder: 'book-covers',
                format: convertMimeType
            });

            completeCoverImage = uploadedResult.secure_url;
            await fs.promises.unlink(ImagefilePath);
        }

        // Check if the file field exists
        let completeFileName = book.file;
        if (files.file) {
            const bookFileName = files.file[0].filename;
            const bookFilePath = path.resolve(__dirname, '../../public/data/uploads', bookFileName);

            const uploadBookPdf = await cloudinary.uploader.upload(bookFilePath, {
                resource_type: 'raw',
                filename_override: bookFileName,
                folder: 'book-pdfs',
                format: 'pdf'
            });

            completeFileName = uploadBookPdf.secure_url;
            try {
                
                
                await fs.promises.unlink(bookFilePath);
            } catch (error) {
                return next(createHttpError(500," Server Issue in unlinking book files path"));
            }
        }

        const updatedBook = await Book.findByIdAndUpdate(
            bookId,
            {
                title,
                genre,
                coverImage: completeCoverImage,
                file: completeFileName
            },
            {
                new: true,
                runValidators: true
            }
        );

        return res.json(updatedBook);
    } catch (error) {
        console.error(error);
        return next(createHttpError(500, ' Server Issue while updating the files'));
    }
}



const getAllBooks = async (req: Request, res: Response,next: NextFunction)=>{
    try {
          //Added Pagination for fetching list of books  
        const page = Number(req.query.page) || 1;  
        const limit = Number(req.query.limit ) || 2;
        const skip = (page - 1) * limit;
    
    
    const books = await Book.find().sort({_id:-1}).skip(skip).limit(limit);
    const totalBooks = await Book.find();
    const TotalBooks = totalBooks.length;
    
    
    
    
            return res.json({
                books,
                TotalBooks,
                totalPages: Math.ceil(TotalBooks / limit),
                currentPage: page
            });
    }
    
    catch (error) {
        return next(createHttpError(500,"Server Issue to get list of books"));
    }
}



const DeleteBook = async(req: Request, res: Response,next: NextFunction)=>{
    const bookId = req.params.bookId;
   try {
     const book = await Book.findById(bookId);
     if(!book){
         return next(createHttpError(404,"Book Not Found"))
     }
 
     //Check for Access
     const _req = req as unknown as AuthRequest;
     if(book.author.toString() !== _req.userId){
         return next(createHttpError(403,"You dont have access to delete the book of others."))
 
     }
 

     const coverFileSplits = book.coverImage.split('/');
     console.log(coverFileSplits);
     const coverImagePublicId = coverFileSplits.at(-2) + "/" + coverFileSplits.at(-1)?.split('.').at(-2);
     console.log("coverImagePublicId: ",coverImagePublicId);
     
 
 
     const bookFileSplits = book.file.split('/');
     console.log(bookFileSplits);
     const bookFilePublicId = bookFileSplits.at(-2) + "/" + bookFileSplits.at(-1);
     console.log("bookFilePublicId: ",bookFilePublicId);
     
     await cloudinary.uploader.destroy(coverImagePublicId);
     await cloudinary.uploader.destroy(bookFilePublicId,{
         resource_type:"raw"
     });
 
     await Book.deleteOne({_id:bookId});
 
    return res.sendStatus(204).json({_id:bookId});
   } catch (error) {
    return next(createHttpError(500,'Server Issue while deletion of book'));
   }
    
}




    export {createBook,updateBook,getAllBooks,DeleteBook} ;   