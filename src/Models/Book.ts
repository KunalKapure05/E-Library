import mongoose from "mongoose";

import { BookType } from "../Interfaces/BookType";

const bookSchema = new mongoose.Schema<BookType>({

    title:{
        type:String,
        required:true
    },

    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },

    coverImage:{
        type:String,
        required:true
    },

    file:{
        type:String,
        required:true
    },

    genre:{
        type:String,
        required:true
    }
},{
    timestamps:true
})

export default mongoose.model<BookType>('Book',bookSchema);




