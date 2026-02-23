const express=require("express");
const userController=require("../controllers/user.controller");

const userRouter=express.Router();

userRouter.get("/",userController.getHome);

userRouter.get("/bookings",userController.bookings);

userRouter.get("/wishlists",userController.favouriteHomes);

userRouter.get("/homes/:id",userController.getDetails);

userRouter.post("/wishlists",userController.addToWishlist);

userRouter.delete("/wishlists",userController.removeFromWishlist);

module.exports={userRouter};