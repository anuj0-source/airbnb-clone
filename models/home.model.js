const mongoose = require("mongoose");
const Fav = require("./favourite.model");

const homeSchema=new mongoose.Schema({

  houseName:{
    type:String,
    required:true
  },

  size:{
    type:String,
    required:true
  },

  location:{
    type:String,
    required:true
  },

  price:{
    type:Number,
    required:true
  },

  imageUrl:{
    type:String,
    required:true
  },

  homeDescription:{
    type:String,
    required:false
  },
  
  favourite:{
    type:Boolean,
    required:true
  }

});

homeSchema.pre('findOneAndDelete', async function () {
  try {
    const homeId = this.getQuery()._id;

    await Fav.deleteMany({ homeId: homeId });

  } catch (err) {
    console.log("Error while pre:", err);
    return err;
  }
});

const Home = mongoose.model("Home", homeSchema);
module.exports=Home;