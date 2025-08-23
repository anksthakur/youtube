import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      //to make the field searchable use index:true
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);
//middleware , arrow fun tab ni lete hai kyuki uhske pass this ka refrence ni hota hai
userSchema.pre("save", async function (next) {
  if(!this.isModified("password")) return next()
  this.password =await bcrypt.hash(this.password, 10)
  next();
});
//password checking
userSchema.methods.isPasswordCorrect = async function (password){
return await bcrypt.compare(password,this.password)
}
// generating access token
userSchema.methods.generateAccessToken = function (){
  return jwt.sign({
    //data we want to include in the token
    _id:this._id,
    email:this.email,
    username:this.username
  },
  process.env.ACCESS_TOKEN_SECRET,{
    expiresIn:process.env.ACCESS_TOKEN_EXPIRY
  }
)
}
// generating refresh token
userSchema.methods.generateRefreshToken= function (){
  return jwt.sign({
    _id:this._id,
  },
  process.env.REFRESH_TOKEN_SECRET,{
    expiresIn:process.env.REFRESH_TOKEN_EXPIRY
  }
)
}
export const User = mongoose.model("User", userSchema);
