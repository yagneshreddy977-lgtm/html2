import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
const { Schema } = mongoose;

const userschema = new Schema(
    {
       username: {
        required:true,
        type:String,
        lowercase:true 
       },
       email:{
        type:String,
        required:true,
        unique:true
       },
       password:{
        required:[true,"Password is Requiredd"],
        type:String
       },
       forgotPasswordToken:{
        type:String
       },
       forgotPasswordExpiry:{
        type:Date
       }
    },
    {
        timestamps:true
    }
) 
userschema.pre("save" , async function(next){
    if(!this.isModified("password")) return next();
   this.password =  await bcrypt.hash(this.password,10);
   next();
})

userschema.methods.isPasswordcorrect = async function(password){
    return await bcrypt.compare(password,this.password);
}

userschema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    );
};

userschema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    );
};

userschema.methods.generateTemporaryToken = function(){
   const unhashedToken = crypto.randomBytes(20).toString("hex");
   const hashedToken = crypto.createHash
                        .update(unhashedToken)
                        .digest("hex");
const tokenExpiry  = Date.now() + (20*60*1000) //20mins

return {unhashedToken , hashedToken ,tokenExpiry}
};
export const user  = mongoose.model('user',userschema);