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
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            const error = createHttpError(400, "All fields are required");
            return next(error);
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            const error = createHttpError(400, 'User already exists with this e-mail');
            console.error("User already exists with this e-mail");
            return next(error);
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
        return next(createHttpError(500, 'Error saving the user'));
    }
}




export { register };
