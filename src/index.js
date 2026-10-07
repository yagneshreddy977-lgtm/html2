import dotenv from "dotenv";
import app from "../app.js";
import connectDB from "./db/database.js";
dotenv.config({
  path: "./.env",
});

const port = process.env.PORT || process.env.port || 3000;

connectDB()
  .then(()=>{
app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
  })
  .catch((err)=>{
    console.log("mongodb connection error",err);
    process.exit(1);
  })


