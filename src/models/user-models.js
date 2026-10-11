import mongoose from "mongoose";
import brcypt from "bcrypt";

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
userschema.pre("save" , async function(){
    if(!this.isModified("password")) return next();
   this.password =  await brcypt.hash(this.password,10);
   next();
})

userschema.methods.isPasswordcorrect = async function(password){
    return await brcypt.compare(password,this.password);
}
export const user  = mongoose.model('user',userschema);