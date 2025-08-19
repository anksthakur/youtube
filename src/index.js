
import dotenv from "dotenv";
import connectDB from "../src/db/index.js"


dotenv.config({ path: "./.env" });

connectDB();













// import mongoose from "mongoose"
// import { DB_NAME } from "./constants"
// (async()=>{
//     try {
//       await  mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//     } catch (error) {
//         console.log('ERROR :',error)
//     }
// })()
