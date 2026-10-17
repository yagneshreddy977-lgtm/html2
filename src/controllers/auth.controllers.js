import {user} from "../models/user-models.js"
import { ApiResponse } from "../utils/Api-response.js"
import { ApiError } from "../utils/Api-error.js"
import { asyncHandler } from "../utils/async-handler.js"
import { sendEmail,emailVerificationMailContent } from "../utils/mail.js"
import jwt from "jsonwebtoken";
/*the steps for the registration of a user are 
1.take some Data
2.validate the Data
3.check the db if user already exists
4.save the new user {at,rt,tt,sendemail}
5.user verification =>email
6. send response back to the request */


const generateAccessTokenAndRefreshTokens = async (userId) =>{
    try{
        const User = await user.findById(userId)
        const access_token = User.generateAccessToken()
        const refresh_token = User.generateRefreshToken();

        return {access_token,refresh_token};

       
    }catch(error){
        throw new ApiError(
            500,
            "Something went wrong while generating tokens"
        )
    }
}

const registerUser = asyncHandler(async(req,res)=>{
    const {email,username,password} = req.body;

   const existedUser = await user.findOne({
        $or:[{username},{email}]
    })
    if(existedUser){
        throw new ApiError(409,"User with email or username already exists",[])
    }

    const User = await user.create({
        email,
        password,
        username
    })

    const {unhashedToken,hashedToken,tokenExpiry} = User.generateTemporaryToken();
    User.emailVerificationToken = hashedToken;
    User.emailVerificationExpiry = tokenExpiry;

    await User.save({validateBeforeSave:false});

    await sendEmail(
        {
            email:User?.email,
            subject:"Please verify your email",
            mailgenContent:emailVerificationMailContent(User.username,
                `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unhashedToken}`
            ),
        }
    );
    const createdUser = await User.findById(User._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
    )

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering a user")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(
            200,
            {
                user:createdUser
            },
            "user registered successfully and verification email has been sent on your email",
        ),
    );
});

/*
to login a user
take data from the user
validate
if user exists
if password is correct
generate tokens
send tokens in cookies
*/
const login = asyncHandler(async(req,res)=>{
    const { email, password } = req.body;

    if(!email){
        throw new ApiError(400,"email is required");
    }

    const User = await user.findOne({ email: email.trim() });

    if(!User){
        throw new ApiError(400,"user does not exists");
    }

    const isPasswordvalid = await User.isPasswordcorrect(password);

    if(!isPasswordvalid){
        throw new ApiError(400,"Invalid Credentials");
    }

    const {refresh_token,access_token}=await generateAccessTokenAndRefreshTokens(User._id);

    const loggedInUser = await user.findById(User._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
    );


    const options = {
         httpOnly:true,
         secure:process.env.NODE_ENV === "production",
         sameSite:"lax"
    };

return res
.status(200)
.cookie("accessToken",access_token,options)
.cookie("refreshToken",refresh_token,options)
.json(
    new ApiResponse(
        200,{
            user:loggedInUser,
            access_token,
            refresh_token
        },
        "user Logged In successfully"
    )
);
});


const logoutUser = asyncHandler(async(req,res)=>{
        await user.findByIdAndUpdate(
            req.user._id,
            {
                $set:{
                    refresh_token:""
                }
            },{
                returnDocument:"after"
            },
        );

        const options = {
            httpOnly:true,
            secure:true
        }

        return res
        .status(200)
        .clearCookie("accessToken",options)
        .clearCookie("refreshToken",options)
        .json(new ApiResponse(200,{},"user logged out"));
});

const getUserDetails = asyncHandler(async(req,res)=>{
    return res.status(200)
    .json(new ApiResponse(200,req.user,"current user fetched successfully"));
});

const changePassword = asyncHandler(async(req,res)=>{
    const {oldPassword,newPassword} = req.body;

    if(!oldPassword || !newPassword){
        throw new ApiError(400,"password fields not provided");
    }

    const currentUser = await user.findById(req.user._id).select("+password");

    if(!currentUser){
        throw new ApiError(400,"user not found");
    }

    const isPasswordCorrect =
        await currentUser.isPasswordcorrect(oldPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Old password is incorrect");
    }

    currentUser.password = newPassword;

    currentUser.refreshToken = undefined;

    await currentUser.save();

    return res.status(200)
        .json(new ApiResponse(200,{},"Password changed successfully"));
});

const refreshAcessToken = asyncHandler(async(req,res)=>{
    const incomingRefreshToken = req.cookies.refreshToken||req.body.refreshToken;
    if(!incomingRefreshToken){
        throw new ApiError(401,"unauthorized Access");
    }

    try{
         const decodedToken =  jwt.verify(incomingRefreshToken,PROCESS.env.REFRESH_TOKEN_SECRET);
            const user = await user.findById(decodedToken?._id);
            if(!user){
                throw new ApiError(401,"unauthorized Acess")
            }

            if(incomingRefreshToken !== user?.refreshToken){
                throw new ApiError(401,"Refresh token is Expired");
            }
            const options ={
                httpOnly : true,
                secure : true
            }
            const {accessToken,refreshToken:newRefreshToken} = await generateAccessTokenAndRefreshTokens(user._id);
            user.refreshToken = newRefreshToken;
            await user.save();
            return res
            .status(200)
            .cookie("accessToken" ,accessToken,options)
            .cookie("refreshToken",newRefreshToken,options)
            .json(new ApiResponse(200, {
                accessToken,
                refreshToken: newRefreshToken
            },
        "Access Token Refreshed"))
        

    }catch(error){
        throw new ApiError(401,"invalid refresh token");
    }

})
export {
    registerUser,login,logoutUser,getUserDetails,changePassword,refreshAcessToken
};