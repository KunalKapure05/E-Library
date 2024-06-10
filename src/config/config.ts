
import {config as confi} from 'dotenv'
confi();

const _config ={
    port : process.env.PORT,
    databseUrl : process.env.MONGO_URI
}

//Obj freeze is used for not changing the port and will give only read access to the config 
export const config = Object.freeze(_config);