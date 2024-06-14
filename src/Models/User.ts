import mongoose from "mongoose";
import {UserType} from '../Interfaces/UserType'

const userSchema = new mongoose.Schema<UserType>({

    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        unique:true,
        required:true
    },

    password:{
        type:String,
        required:true
    }

},
{
    timestamps:true
})

export default mongoose.model<UserType>('User',userSchema);


