import { Router } from "express";
import { registerUser } from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import { userRegisterValidator } from "../validators/index.js";
const router = Router();

router.route("/register").post(userRegisterValidator(),validate,registerUser);
/* so see what happens is the route is like this because whenever the validators are getting the error in the content part they call the errorhandler midleware which is the main one which looks upon this and shows the error to the user or client that's why the route is like this */



export default router;