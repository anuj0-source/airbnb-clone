const express=require("express");
const authController=require("../controllers/auth.controller");
const otpController=require("../controllers/otp.controller");

const authRouter=express.Router();

authRouter.get("/login",authController.getLogin);

authRouter.get("/signup",authController.getSignUp);

authRouter.post("/login",authController.postLogin);

authRouter.post("/logout",authController.postLogout);

authRouter.post("/signup",authController.postSignUp);

// ── OTP Login Routes ──
authRouter.get("/login-otp", otpController.getLoginOtp);
authRouter.post("/login-otp/send", otpController.postSendOtp);
authRouter.post("/login-otp/verify", otpController.postVerifyOtp);
authRouter.post("/login-otp/resend", otpController.postResendOtp);

module.exports=authRouter;