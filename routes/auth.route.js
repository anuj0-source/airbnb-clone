const express=require("express");
const authController=require("../controllers/auth.controller");

const authRouter=express.Router();

authRouter.get("/login",authController.getLogin);

authRouter.get("/signup",authController.getSignUp);

authRouter.post("/login",authController.postLogin);

authRouter.post("/logout",authController.postLogout);

authRouter.post("/signup",authController.postSignUp);

module.exports=authRouter;