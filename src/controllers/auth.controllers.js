import user from "../models/user-models.js"
import { ApiResponse } from "../utils/Api-response.js"
import { ApiError } from "../utils/Api-error.js"
import { asyncHandler } from "../utils/async-handler.js"
import { sendEmail,emailVerificationMailContent } from "../utils/mail.js"
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
    const {email,username,password,role} = req.body;

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

    const {unHashedToken,hashedToken,tokenExpiry} = User.generateTemporaryToken();

    await User.save({validateBeforeSave:false})

    await sendEmail(
        {
            email:User?.email,
            subject:"Please verify your email",
            mailgencontent:emailVerificationMailContent(User.username,
                `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`
            ),
        }
    );
    const createdUser = await User.findById(user._id).select(
        "-password -refreshtoken -emailverificationtoken -emailverificationExpiry"
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

export {
    registerUser
};