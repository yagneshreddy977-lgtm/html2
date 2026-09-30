import dotenv from "dotenv";

dotenv.config({
    path:"./.env",
});


let myusername = process.env.database;

console.log(myusername);
console.log("Start of a backend project");


