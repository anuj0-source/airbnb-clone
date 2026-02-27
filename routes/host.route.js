const express=require("express");
const hostRouter=express.Router();
const hostController=require("../controllers/host.controller");

hostRouter.get("/add-home",hostController.addHomeGet);

hostRouter.post("/add-home/:userId",hostController.addHomePost);

hostRouter.get("/listings",hostController.getListing);

hostRouter.get("/edit-home/:id",hostController.getEditHome);

hostRouter.post("/edit-home/:id",hostController.postEditHome);

hostRouter.delete("/delete/:id",hostController.deleteHome);


module.exports={
    hostRouter
};