import mongoose from "mongoose";
import {UserType} from '../Interfaces/UserType'

const userSchema = new mongoose.Schema<UserType>({

    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true,
        sparse:true,
        unique:true
    },

    password:{
        type:String,
        
    },

    googleId:{
        type:String
    }

},
{
    timestamps:true
})

export default mongoose.model<UserType>('User',userSchema);


