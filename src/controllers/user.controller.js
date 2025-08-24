import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apierror.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

// import path from "path"

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

export { registerUser };

// get user details from frontned
// validation - not empty field
// check user exists-username and email
// check user image
//if image then upload them to cloudinary
// create user object- create entry in db
//remove password and refresh token from response
// checking user creation
// return response
