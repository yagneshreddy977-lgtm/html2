import { body } from "express-validator";

/*middle ware -> validation ->routing ->middleware (here the middleware is coming once again is the error handler middleware)*/
const userRegisterValidator = ()=>{
    return [
        body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is req")
        .isEmail()
        .withMessage("Email is invalid"),

        body("username")
        .trim()
        .notEmpty()
        .withMessage("username is required")
        .isLowercase()
        .withMessage("username must be in Lowercase")
        .isLength({min:3})
        .withMessage("username must be atleat 3 characters"),
        body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is Required")
    ];
};

export {
    userRegisterValidator
}