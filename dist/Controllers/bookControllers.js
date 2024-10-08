"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteBook = exports.getSingleBook = exports.getAllBooks = exports.updateBook = exports.createBook = void 0;
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const path_1 = __importDefault(require("path"));
const http_errors_1 = __importDefault(require("http-errors"));
const fs_1 = __importDefault(require("fs"));
const Book_1 = __importDefault(require("../Models/Book"));
const createBook = async (req, res, next) => {
    try {
        const user = req.params.user;
        const { title, genre } = req.body;
        console.log("files", req.files);
        const files = req.files;
        const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
        const fileName = files.coverImage[0].filename;
        const ImagefilePath = path_1.default.resolve(__dirname, '../../public/data/uploads', fileName);
        const uploadedResult = await cloudinary_1.default.uploader.upload(ImagefilePath, {
            filename_override: fileName,
            folder: 'book-covers',
            format: coverImageMimeType,
        });
        const bookFileName = files.file[0].filename;
        const bookFilePath = path_1.default.resolve(__dirname, '../../public/data/uploads', bookFileName);
        const bookFileUpload = await cloudinary_1.default.uploader.upload(bookFilePath, {
            resource_type: 'raw',
            filename_override: bookFileName,
            folder: 'book-pdfs',
            format: 'pdf'
        });
        console.log("BookuploadResult:", bookFileUpload);
        const _req = req;
        const newBook = await Book_1.default.create({
            title,
            genre,
            coverImage: uploadedResult.secure_url,
            file: bookFileUpload.secure_url,
            author: _req.userId
        });
        console.log("uploadResult:", uploadedResult);
        //This will delete temp files which are there in Public/data/uploads folder
        try {
            await fs_1.default.promises.unlink(ImagefilePath);
            await fs_1.default.promises.unlink(bookFilePath);
        }
        catch (error) {
            return next((0, http_errors_1.default)('500', 'Server Issue encountered for deletion of temp files'));
        }
        await newBook.populate('author', 'name');
        return res.status(201).json({
            _id: newBook.id,
            author_id: newBook.author,
        });
    }
    catch (error) {
        console.error(error);
        return next((0, http_errors_1.default)(500, "Server Issue encountered while uploading the files"));
    }
};
exports.createBook = createBook;
const updateBook = async (req, res, next) => {
    try {
        const { title, genre } = req.body;
        const bookId = req.params.bookId;
        const book = await Book_1.default.findById(bookId);
        if (!book)
            return next((0, http_errors_1.default)(404, "Book not found"));
        const _req = req;
        if (book.author.toString() !== _req.userId) {
            return next((0, http_errors_1.default)(403, "Unauthorized to update book"));
        }
        const files = req.files;
        // Check if Image field exists
        let completeCoverImage = book.coverImage;
        if (files.coverImage) {
            const fileName = files.coverImage[0].filename;
            const convertMimeType = files.coverImage[0].mimetype.split('/').at(-1);
            const ImagefilePath = path_1.default.resolve(__dirname, '../../public/data/uploads', fileName);
            const uploadedResult = await cloudinary_1.default.uploader.upload(ImagefilePath, {
                filename_override: fileName,
                folder: 'book-covers',
                format: convertMimeType
            });
            completeCoverImage = uploadedResult.secure_url;
            await fs_1.default.promises.unlink(ImagefilePath);
        }
        // Check if the file field exists
        let completeFileName = book.file;
        if (files.file) {
            const bookFileName = files.file[0].filename;
            const bookFilePath = path_1.default.resolve(__dirname, '../../public/data/uploads', bookFileName);
            const uploadBookPdf = await cloudinary_1.default.uploader.upload(bookFilePath, {
                resource_type: 'raw',
                filename_override: bookFileName,
                folder: 'book-pdfs',
                format: 'pdf'
            });
            completeFileName = uploadBookPdf.secure_url;
            try {
                await fs_1.default.promises.unlink(bookFilePath);
            }
            catch (error) {
                return next((0, http_errors_1.default)(500, " Server Issue encountered in unlinking book files path"));
            }
        }
        const updatedBook = await Book_1.default.findByIdAndUpdate(bookId, {
            title,
            genre,
            coverImage: completeCoverImage,
            file: completeFileName
        }, {
            new: true,
            runValidators: true
        });
        return res.json(updatedBook);
    }
    catch (error) {
        console.error(error);
        return next((0, http_errors_1.default)(500, ' Server Issue encountered while updating the files'));
    }
};
exports.updateBook = updateBook;
const getAllBooks = async (req, res, next) => {
    try {
        //Added Pagination for fetching list of books  
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 2;
        const skip = (page - 1) * limit;
        const books = await Book_1.default.find().sort({ _id: -1 }).skip(skip).limit(limit);
        const totalBooks = await Book_1.default.find();
        const TotalBooks = totalBooks.length;
        return res.json({
            books,
            TotalBooks,
            totalPages: Math.ceil(TotalBooks / limit),
            currentPage: page
        });
    }
    catch (error) {
        return next((0, http_errors_1.default)(500, "Server Issue encountered to get list of books"));
    }
};
exports.getAllBooks = getAllBooks;
const getSingleBook = async (req, res, next) => {
    const bookId = req.params.bookId;
    try {
        const book = await Book_1.default.findById(bookId).populate("author", "name");
        ;
        if (!book) {
            return next((0, http_errors_1.default)(404, "Book not found"));
        }
        return res.json(book);
    }
    catch (error) {
        return next((0, http_errors_1.default)(500, "Server Issue encountered while getting the book"));
    }
};
exports.getSingleBook = getSingleBook;
const DeleteBook = async (req, res, next) => {
    const bookId = req.params.bookId;
    try {
        const book = await Book_1.default.findById(bookId);
        if (!book) {
            return next((0, http_errors_1.default)(404, "Book Not Found"));
        }
        //Check for Access
        const _req = req;
        if (book.author.toString() !== _req.userId) {
            return next((0, http_errors_1.default)(403, "You dont have access to delete the book of others."));
        }
        const coverFileSplits = book.coverImage.split('/');
        console.log(coverFileSplits);
        const coverImagePublicId = coverFileSplits.at(-2) + "/" + coverFileSplits.at(-1)?.split('.').at(-2);
        console.log("coverImagePublicId: ", coverImagePublicId);
        const bookFileSplits = book.file.split('/');
        console.log(bookFileSplits);
        const bookFilePublicId = bookFileSplits.at(-2) + "/" + bookFileSplits.at(-1);
        console.log("bookFilePublicId: ", bookFilePublicId);
        await cloudinary_1.default.uploader.destroy(coverImagePublicId);
        await cloudinary_1.default.uploader.destroy(bookFilePublicId, {
            resource_type: "raw"
        });
        await Book_1.default.deleteOne({ _id: bookId });
        return res.sendStatus(204).json({ _id: bookId });
    }
    catch (error) {
        return next((0, http_errors_1.default)(500, 'Server Issue encountered while deletion of book'));
    }
};
exports.DeleteBook = DeleteBook;
