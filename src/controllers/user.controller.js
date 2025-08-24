import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apierror.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

const generateAccessAndRefreshTokens = async (userId)=>{
try {
  const user = await User.findById(userId)
  const accessToken = user.generateAccessToken()
  const refreshToken = user.generateRefreshToken()
  user.refreshToken=refreshToken
  await user.save({validateBeforeSave:false})
  return {refreshToken,accessToken}

} catch (error) {
  throw new ApiError(500,"something went wrong")
}
}
// register user
const registerUser = asyncHandler(async (req, res) => {
  const { username, fullName, email, password } = req.body;
  // console.log("email :", email);
  if (
    [username, fullName, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All field are required");
  }
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }
  const avatarUpload = req.files?.avatarImage[0]?.path;
  // console.log("Avatar : ", avatarUpload);
  // const coverUpload = req.files?.coverImage[0]?.path;
  // console.log("Cover Image : ", coverUpload);
  let coverUpload;
  if(req.files && Array
    .isArray(req.files.coverUpload) && req.files.coverUpload.length >0
  ){
coverUpload = req.files.coverUpload[0].path
  }
  if (!avatarUpload) {
    throw new ApiError(400, "Avatar file is required");
  }
  const avatar = await uploadOnCloudinary(avatarUpload);
 if (!avatar) {
    throw new ApiError(400, "avatar not uploaded");
  }
  const cover = await uploadOnCloudinary(coverUpload);
 
  const user = await User.create({
    fullName,
    username: username.toLowerCase(),
    email,
    password,
    avatarImage: avatar?.url,
    coverImage: cover?.url || "",
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "something went wrong");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

//login user
const loginUser = asyncHandler(async (req,res)=>{
// login with username or email
//find the user
// password check
//access and refresh token generate
//send them in cookies
const {username,email,password} = req.body
if(!username||!email){
throw new ApiError(400,"username or email is required")
}
const user = await User.findOne({
  $or:[{username},{email}]
})
if(!user){
  throw new ApiError(404,"User does not exists")
}
const isPasswordValid = await user.isPasswordCorrect(password)
if(!isPasswordValid){
  throw new ApiError(401,"Invalid credentials")
}
const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id)
const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
//ye options krne se only server se cookies ko modify kar skte hai
const options ={
  httpOnly:true,
  secure:true
}
return res.status(200).cookie("accessToken",accessToken,options)
.cookie("refreshToken",refreshToken,options)
.json(
  new ApiResponse(200,{
  user:loggedInUser,accessToken,refreshToken
},
"user logged in successfully"))
})

const logoutUser = asyncHandler(async (req,res)=>{
await User.findByIdAndUpdate(req.user._id ,{
  $set:{
    refreshToken:undefined
  }
 })
 const options ={
  httpOnly:true,
  secure:true
}
return res.status(200)
.clearCookie("accessToken",options)
.clearCookie("refreshToken",options)
.json(new ApiResponse(200,{},"user logged out"))
})

export { registerUser,loginUser,logoutUser };

// get user details from frontned
// validation - not empty field
// check user exists-username and email
// check user image
//if image then upload them to cloudinary
// create user object- create entry in db
//remove password and refresh token from response
// checking user creation
// return response
