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

const userLoginvalidator =()=>{
    return [
        body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email is invalid"),

        body("password")
        .notEmpty()
        .withMessage("Password is required")
    ];
};

/*our thinking logic for any validatior is 
1.Identify the input fields
What information is the API expecting? For example, registration expects username, email, and password in req.body.
2.Decide the rules for each field
Username must not be empty. Email must have a valid email format. Password must meet your minimum length requirements.
3.Write the validation chains
Use functions such as body(), followed by rules such as .notEmpty(), .isEmail(), and .isLength().
4.Check the validation results
Use validationResult(req) to determine whether any rules failed.
5.Continue or stop
If the input is valid, call next() so the request proceeds to the controller. Otherwise, forward a validation error to the error-handling middleware
*/
export {
    userRegisterValidator,userLoginvalidator
}