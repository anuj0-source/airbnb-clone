const express = require("express");
const multer = require("multer");
const {CloudinaryStorage} = require("multer-storage-cloudinary");
const path = require("path");
const hostRouter = express.Router();
const hostController = require("../controllers/host.controller");
const cloudinary = require("../utils/cloudinaryConfig");

// Multer config for home images
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "airbnb/homes",
        allowed_formats: ["jpg", "jpeg", "png"],
        transformation: [{ width: 800, height: 600, crop: "fill" }]
    }
});

const uploadHomeImages = multer({storage});

hostRouter.get("/add-home", hostController.addHomeGet);

hostRouter.post("/add-home/:userId", uploadHomeImages.array("images", 5), hostController.addHomePost);

hostRouter.get("/listings", hostController.getListing);

hostRouter.get("/edit-home/:id", hostController.getEditHome);

hostRouter.post("/edit-home/:id", uploadHomeImages.array("images", 5), hostController.postEditHome);

hostRouter.delete("/delete/:id", hostController.deleteHome);


module.exports = {
    hostRouter
};