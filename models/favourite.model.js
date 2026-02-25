const mongoose = require("mongoose");

const favouriteSchema = new mongoose.Schema({
  homeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Home",
    required: true,
    unique: true
  }
});

const Fav = mongoose.model("Favourite", favouriteSchema);

module.exports = Fav;