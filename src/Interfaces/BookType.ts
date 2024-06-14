import {UserType} from "../Interfaces/UserType";

export interface BookType{
    _id:string;
    title:string;
    author:UserType;
    genre:string;
    coverImage:string;
    file:string;
    createdAt:Date;
    updatedAt:Date;

}