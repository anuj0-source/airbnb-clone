const mongoose = require("mongoose");
const User = require("./user.model");

const homeSchema = new mongoose.Schema({

  houseName: {
    type: String,
    required: true
  },

  size: {
    type: String,
    required: true
  },

  location: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true
  },
  homeImages: {
    type: [String],
    required: true
  },
  homeDescription: {
    type: String,
    required: false
  },
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

});

homeSchema.pre('findOneAndDelete', async function () {
  try {
    const homeId = this.getQuery()._id;

    await User.updateMany(
      { favourites: homeId },
      { $pull: { favourites: homeId } }
    );

  } catch (err) {
    console.log("Error while pre:", err);
    return err;
  }
});

const Home = mongoose.model("Home", homeSchema);
module.exports = Home;