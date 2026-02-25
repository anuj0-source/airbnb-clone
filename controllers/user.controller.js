const Home = require("../models/home.model");
const Fav = require("../models/favourite.model");

// Home Page
exports.getHome = async (req, res) => {
  try {
    const homes = await Home.find().lean();
    res.render("./store/home-list", { homes });
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};

// Bookings Page
exports.bookings = (req, res) => {
  res.render("./store/bookings");
};

// Wishlist Page
exports.favouriteHomes = async (req, res) => {
  try {
    const favourites = await Fav.find().populate("homeId").lean();

    const homes = favourites.map(f => f.homeId);

    res.render("./store/wishlists", { fav: homes });
  } catch (err) {
    res.status(500).send("Error loading wishlist");
  }
};

// Home Details
exports.getDetails = async (req, res) => {
  try {
    const id = req.params.id;
    const home = await Home.findById(id).lean();

    if (!home) return res.status(404).send("Home not found");

    res.render("./store/home-details", { home });
  } catch (err) {
    res.status(500).send("Error loading details");
  }
};

// Add to Wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const homeId = req.body.id;

    const favHome = new Fav({ homeId });

    await Home.findByIdAndUpdate(homeId, {
      favourite: true
    });

    const status = await favHome.save();

    res.json({ success: true, message: status ? 'Saved to wishlist ❤️' : "Something went wrong ⚠️" });
  } catch (err) {
    res.json({ success: false, message: "Error saving" });
  }
};

// Remove from Wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const id = req.body.id;

    let message = await Fav.findOneAndDelete({ homeId: id });

    await Home.findByIdAndUpdate(id, {
      favourite: false
    });

    message = message ? "Removed from wish list 🗑️" : "Failed to remove ⚠️";

    res.json({ success: true, message });
  } catch (err) {
    res.json({ success: false, message: "Error removing" });
  }
};