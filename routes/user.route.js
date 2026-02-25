const express=require("express");
const userController=require("../controllers/user.controller");
const isAuth=require("../middlewares/isAuth");


const userRouter=express.Router();

userRouter.get("/",userController.getHome);

userRouter.get("/bookings",isAuth,userController.bookings);

userRouter.get("/wishlists",isAuth,userController.favouriteHomes);

userRouter.get("/homes/:id",isAuth,userController.getDetails);

userRouter.post("/wishlists",isAuth,userController.addToWishlist);

userRouter.delete("/wishlists",isAuth,userController.removeFromWishlist);

module.exports={userRouter};