import mongoose from "mongoose";

import {config} from "./config";

const connectDb = async()=>{
try {

    const db = mongoose.connection;

    db.on('connected',()=>{
        console.log("Connected to db Successfully"); 
        
    })

    db.on('error',(err)=>{
        console.log("Error in connecting to db",err);
        
    })




    await mongoose.connect(config.databseUrl as string); 

   


} 


catch (err) {
    console.error("Failed to connect",err);
    process.exit(1);
    
}
}

export default connectDb;