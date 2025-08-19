// import dotenv from "dotenv";
import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"

// dotenv.config({ path: "./.env" });
const connectDB = async ()=>{
    try {
        // console.log(`env values MongoDB  : ${process.env.MONGODB_URI} DB Name :${DB_NAME}`)
        const dbConnection = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        // const dbConnection = await mongoose.connect("mongodb://localhost:27017/youtube")
        console.log('mongo db connected')
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}
export default connectDB