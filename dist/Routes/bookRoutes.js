"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const bookControllers_1 = require("../Controllers/bookControllers");
const multer_1 = __importDefault(require("multer"));
const jwtAuth_1 = __importDefault(require("../middlewares/jwtAuth"));
const router = express_1.default.Router();
const upload = (0, multer_1.default)({
    dest: path_1.default.resolve(__dirname, '../../public/data/uploads'),
    limits: { fileSize: 1e7 } // 1e7 represents 10mb ie 1x10 power 7
});
router.post('/', jwtAuth_1.default, upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 }
]), bookControllers_1.createBook);
router.put('/update/:bookId', jwtAuth_1.default, upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
]), bookControllers_1.updateBook);
router.get('/getAllBooks', bookControllers_1.getAllBooks);
router.get('/:bookId', bookControllers_1.getSingleBook);
router.delete('/delete/:bookId', jwtAuth_1.default, bookControllers_1.DeleteBook);
exports.default = router;
