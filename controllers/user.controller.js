const Home = require("../models/home.model");
const Fav = require("../models/favourite.model");

// Home Page
exports.getHome = async (req, res) => {
  try {
    const homes = await Home.fetchAll();
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
    const favourites = await Fav.fetchFav();
    res.render("./store/wishlists", { fav: favourites });
  } catch (err) {
    res.status(500).send("Error loading wishlist");
  }
};

// Home Details
exports.getDetails = async (req, res) => {
  try {
    const id = req.params.id;
    const home = await Home.fetch(id);

    if (!home) return res.status(404).send("Home not found");

    res.render("./store/home-details", { home });
  } catch (err) {
    res.status(500).send("Error loading details");
  }
};

// Add to Wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const id = req.body.id;

    const message = await Fav.addToFav(id);

    res.json({ success: true, message });
  } catch (err) {
    res.json({ success: false, message: "Error saving" });
  }
};

// Remove from Wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const id = req.body.id;

    const message = await Fav.removeFromFav(id);

    res.json({ success: true, message });
  } catch (err) {
    res.json({ success: false, message: "Error removing" });
  }
};