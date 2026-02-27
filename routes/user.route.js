const express = require("express");
const userController = require("../controllers/user.controller");
const isAuth = require("../middlewares/isAuth");
const changeToTravelling = require("../middlewares/toTravelling");


const userRouter = express.Router();

userRouter.get("/",changeToTravelling, userController.getHome);

userRouter.get("/bookings", isAuth,changeToTravelling, userController.bookings);

userRouter.get("/wishlists", isAuth, changeToTravelling, userController.favouriteHomes);

userRouter.get("/homes/:id", changeToTravelling, userController.getDetails);

userRouter.post("/wishlists", isAuth, userController.addToWishlist);

userRouter.delete("/wishlists", isAuth, userController.removeFromWishlist);

userRouter.post("/change-user/:userId", userController.postChangeUserType);

module.exports = { userRouter };