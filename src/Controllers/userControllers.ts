import { NextFunction, Request, Response } from "express";
import User from '../Models/User';
import createHttpError from "http-errors";
import bcrypt from 'bcrypt';
import { config } from '../config/config';
import { sign } from 'jsonwebtoken';

async function hashingPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

const register = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const { name, email, password,confirmPassword } = req.body;
        if (!name || !email || !password || !confirmPassword) {
            const error = createHttpError(400, "All fields are required");
            return next(error);
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            const error = createHttpError(400, 'User already exists with this e-mail');
            console.error("User already exists with this e-mail");
            return next(error);
        }

        if(password!== confirmPassword){
            return next(createHttpError(400,"password and confirm password do not match"))
        }
        const hashedPassword = await hashingPassword(password);
        const newUser = new User({ name, email, password: hashedPassword });
        const response = await newUser.save();
        console.log("User created");

        const jwtToken = sign({ sub: newUser._id }, config.jwtKey as string, { expiresIn: "21d" });
        return res.status(201).json({ accessToken: jwtToken, user: response });
  

    }
        
    
    catch (error) {
        console.error(error);
        return next(createHttpError(500, 'Server Error'));
    }
}

const login = async function(req:Request,res:Response,next:NextFunction){
try {
    const {email,password} = req.body;
if(!email || !password){
    const error = createHttpError(400, "All fields are required");
    return next(error);
}
const user = await User.findOne({email})
if(!user){
    console.error("User not found");
    const error = createHttpError(404, "User not found");
    return next(error);
}
const matchPassword = await bcrypt.compare(password,user.password)
if(!matchPassword){
    console.error("E-mail or Password incorrect");
    
    const error = createHttpError(400, "E-mail or Password incorrect");
    return next(error);
}

const jwtToken = sign({ sub: user._id }, config.jwtKey as string, { expiresIn: "21d" });

res.cookie("token",jwtToken,{
    httpOnly:true,
    sameSite:"lax",
    path:'/',
    expires: new Date( Date.now() + 1000*60*60*24)
})
return res.status(201).json({ accessToken: jwtToken });



} 

catch (error) {
    console.error(error);
    return next(createHttpError(500, 'Server Error'));
}
}

const logout = async (req:Request, res:Response, next:NextFunction) => {
    res.clearCookie("token",{path:'/'});
    return res.json({message: "Logged Out"})
}

const fetchUsers = async (req:Request , res:Response, next:NextFunction) => {

   try {
    const page = Number(req.query.page) || 1;  
    const limit = Number(req.query.limit ) || 2;
    const skip = (page - 1) * limit;

    
const Users = await User.find().sort({_id:-1}).skip(skip).limit(limit);
const totalUsers = await User.find();
const TotalUsers = totalUsers.length;




        return res.json({
            Users,
            TotalUsers,
            totalPages: Math.ceil(TotalUsers / limit),
            currentPage: page
        });

 }
   catch (error) {
    return next(createHttpError(500,"Server Issue"))
   }
}


export { register , login,fetchUsers};
