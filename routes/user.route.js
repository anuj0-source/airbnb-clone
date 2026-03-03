const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinaryConfig");
const userController = require("../controllers/user.controller");
const isAuth = require("../middlewares/isAuth");
const changeToTravelling = require("../middlewares/toTravelling");

// Multer config for profile picture
const profileStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "airbnb/profiles",
        allowed_formats: ["jpg", "jpeg", "png"],
        transformation: [{ width: 400, height: 400, crop: "fill", gravity: "face" }]
    }
});

const uploadProfilePic = multer({ storage: profileStorage });

const userRouter = express.Router();

userRouter.get("/", changeToTravelling, userController.getHome);

userRouter.get("/bookings", isAuth, changeToTravelling, userController.bookings);

userRouter.get("/wishlists", isAuth, changeToTravelling, userController.favouriteHomes);

userRouter.get("/homes/:id", changeToTravelling, userController.getDetails);

userRouter.post("/wishlists", isAuth, userController.addToWishlist);

userRouter.delete("/wishlists", isAuth, userController.removeFromWishlist);

userRouter.post("/change-user/:userId", userController.postChangeUserType);

userRouter.get("/profile/:userId", isAuth, userController.getProfile);

userRouter.get("/profile/:userId/edit", isAuth, userController.getEditProfile);

userRouter.post("/profile/:userId/edit", isAuth, uploadProfilePic.single("profilePic"), userController.postEditProfile);

module.exports = { userRouter };