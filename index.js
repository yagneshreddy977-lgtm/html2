import dotenv from "dotenv";
import express from "express";
dotenv.config({
    path:"./.env",
});



const port = process.env.port || 3000;
const app = express();

app.get('/',(req,res)=>{
    res.send("Hello world");
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})


