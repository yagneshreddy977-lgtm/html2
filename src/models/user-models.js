import mongoose from "mongoose";


const userschema = new Schema(
    {
       username: {
        required:true,
        type:string,
        lowercase:string 
       },
       email:{
        type:string,
        required:true,
        unique:true
       },
       password:{
        required:[true,"Password is Requiredd"],
        type:string
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

export const user  = mongoose.model('user',userschema);