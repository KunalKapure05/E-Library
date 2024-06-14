
import {config as confi} from 'dotenv'
confi();

const _config ={
    port : process.env.PORT,
    databseUrl : process.env.MONGO_URL,
    env:process.env.NODE_ENV,
    jwtKey: process.env.JWT_KEY
}

//Obj freeze is used for not changing and will give only read access to the config 
export const config = Object.freeze(_config);