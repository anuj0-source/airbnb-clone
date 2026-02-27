const Home = require("../models/home.model");
const User = require("../models/user.model");

// Home Page
exports.getHome = async (req, res) => {
  try {

    const homes = await Home.find().lean();

    // Mark homes that are in the user's wishlist
    let userFavourites = [];
    if (req.session.isLoggedIn && req.session.userId) {
      const user = await User.findById(req.session.userId).lean();
      if (user && user.favourites) {
        userFavourites = user.favourites.map(id => id.toString());
      }
    }

    homes.forEach(home => {
      home.favourite = userFavourites.includes(home._id.toString());
    });

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
    const userId = req.session.userId;

    const user = await User.findById(userId).lean();

    if (!user) {
      return res.redirect("/login");
    }

    const favourites = user.favourites || [];

    if (favourites.length === 0) {
      return res.render("./store/wishlists", { fav: [] });
    }

    const homes = await Home.find({
      _id: { $in: favourites }
    }).lean();

    homes.forEach(home => { home.favourite = true; });

    res.render("./store/wishlists", { fav: homes });

  } catch (err) {
    console.log(err);
    res.status(500).send("Error loading wishlist");
  }
};

// Home Details
exports.getDetails = async (req, res) => {
  try {
    const id = req.params.id;
    const home = await Home.findById(id).lean();

    if (!home) return res.status(404).send("Home not found");

    // Check if this home is in the user's wishlist
    if (req.session.isLoggedIn && req.session.userId) {
      const user = await User.findById(req.session.userId).lean();
      if (user && user.favourites) {
        home.favourite = user.favourites.map(fid => fid.toString()).includes(home._id.toString());
      }
    }

    res.render("./store/home-details", { home });
  } catch (err) {
    res.status(500).send("Error loading details");
  }
};

// Add to Wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const homeId = req.body.id;

    const userId = req.session.userId;

    const user = await User.findById(userId);

    user.favourites.push(homeId);

    const status = await user.save();

    res.json({ success: true, message: status ? 'Saved to wishlist ❤️' : "Something went wrong ⚠️" });
  } catch (err) {
    res.json({ success: false, message: "Error saving" });
  }
};

// Remove from Wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const homeId = req.body.id;

    const userId = req.session.userId;

    const user = await User.findById(userId);

    let favourites = user.favourites;

    favourites = favourites.filter(home => home != homeId);

    let message = await User.findByIdAndUpdate(userId, { favourites });

    message = message ? "Removed from wish list 🗑️" : "Failed to remove ⚠️";

    res.json({ success: true, message });
  } catch (err) {
    res.json({ success: false, message: "Error removing" });
  }
};

//change user-type

exports.postChangeUserType = async (req, res) => {
  try {
    const userId = req.params.userId;

    const userType = req.session.userType;

    if (userType == 'guest') {

      await User.findByIdAndUpdate(userId, { userType: "host" });

      req.session.userType = 'host';
      req.session.toast = { msg: '🎉 You are now in hosting mode! Start listing your property', type: 'success' };
      return req.session.save(() => {
        res.redirect('/host/listings');
      });
    }
    else {

      await User.findByIdAndUpdate(userId, { userType: "guest" });

      req.session.userType = 'guest';

      req.session.toast = { msg: '🎉 You are now in travelling mode! Start exploring', type: 'success' };

      return req.session.save(() => {
        res.redirect("/");
      });
    }

  }
  catch (err) {
    return err;
  }
}