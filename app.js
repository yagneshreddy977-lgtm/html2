import express from "express";
import cookieParser from "cookie-parser";
const app = express();
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true , limit:"16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

import healthcheckrouter from "./src/routes/healthcheck.routes.js";
import authrouter from "./src/routes/auth.routes.js";
app.use("/api/v1/healthcheck",healthcheckrouter);
app.use("/api/v1/auth",authrouter);
app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/instagram",(req,res)=>{
  res.send("you are in the instagram");
})

export default app;