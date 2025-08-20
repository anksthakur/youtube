import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    // ki kon kon se origin ko allow krna hai
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))
//limit how much we want to accept
app.use(express.json({
    limit:"50kb"
}))
// app.use(express.json())

// url ko encoded krna like 20% ho uhse 20 krna
app.use(express.urlencoded())
app.use(express.static("public"))
// cookie  parse ki server se browser ki cookie access aur set krne ke ley
app.use(cookieParser())

export {app}