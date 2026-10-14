import {user} from "../models/user-models.js";
import {ApiError} from "../utils/Api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import jwt from "jsonwebtoken";

export  const jwtVerify = asyncHandler(async(req,res,next)=>{
   const token =  req.cookie?.accessToken || req.header("Authorization")?.replace("Bearer ","");

   if(!token){
    throw new ApiError(401,"Unauthorized user request");
   }

   try{
   const decodedToken =  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
   const User = await user.findById(decodedToken?._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
   );
   if(!User){
    throw new ApiError(401,"invalid Access Token")
   }

   req.User = User;
   next()
   }catch{
    throw new ApiError(401,"invalid Access Token");
   }
})