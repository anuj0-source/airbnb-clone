const express = require("express");
const multer = require("multer");
const path = require("path");
const hostRouter = express.Router();
const hostController = require("../controllers/host.controller");

// Multer config for home images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
});

const uploadHomeImages = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowed = ["image/jpeg", "image/png", "image/jpg"];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type"), false);
        }
    }
});

hostRouter.get("/add-home", hostController.addHomeGet);

hostRouter.post("/add-home/:userId", uploadHomeImages.array("images", 5), hostController.addHomePost);

hostRouter.get("/listings", hostController.getListing);

hostRouter.get("/edit-home/:id", hostController.getEditHome);

hostRouter.post("/edit-home/:id", uploadHomeImages.array("images", 5), hostController.postEditHome);

hostRouter.delete("/delete/:id", hostController.deleteHome);


module.exports = {
    hostRouter
};