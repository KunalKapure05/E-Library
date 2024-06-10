
import app from "./src/app"
import {config} from "./src/config/config";
import connectDb from './src/config/db';

const startServer= async ()=>{

    await connectDb();

    const port =  config.port || 3000;

    app.listen(port,()=>{
        console.log(`Listening on Port: ${port}`);
        
    })
}


startServer();
 
