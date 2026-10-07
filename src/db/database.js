import mongoose
 from "mongoose";


const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.mongo_uri);
        console.log("mongoDB connected");
    }
    catch(error){
        console.log("MongoDB conncetion error",error);
        process.exit(1);
    }
}

export default connectDB;