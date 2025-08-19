import dotenv from "dotenv";
import connectDB from "../src/db/index.js";
import { app } from "./app.js";

dotenv.config({ path: "./.env" });

const PORT = process.env.PORT || 3002

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App is running on ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Mongo Db connection failed", error);
  });

// import mongoose from "mongoose"
// import { DB_NAME } from "./constants"
// (async()=>{
//     try {
//       await  mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//     } catch (error) {
//         console.log('ERROR :',error)
//     }
// })()
