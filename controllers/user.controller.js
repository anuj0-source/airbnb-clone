const Home = require("../models/home.model");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const cloudinary = require("../utils/cloudinaryConfig");

// Home Page
exports.getHome = async (req, res) => {
  try {

    let homes = await Home.find().lean();

    // Mark homes that are in the user's wishlist
    let userFavourites = [];
    if (req.session.isLoggedIn && req.session.userId) {
      const user = await User.findById(req.session.userId).lean();
      if (user && user.favourites) {
        userFavourites = user.favourites.map(id => id.toString());

        if (user.listings && user.listings.length > 0) {
          const userListings = user.listings.map(id => id.toString());
          homes = homes.filter(home => !userListings.includes(home._id.toString()));
        }
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
    const home = await Home.findById(id).populate('hostId').lean();

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
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).lean();

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Populate listings
    let listings = [];
    if (user.listings && user.listings.length > 0) {
      listings = await Home.find({ _id: { $in: user.listings } }).lean();
    }

    // Get favourites count
    const favouritesCount = user.favourites ? user.favourites.length : 0;

    // Calculate member since date from MongoDB ObjectId
    const memberSince = new Date(parseInt(user._id.toString().substring(0, 8), 16) * 1000);

    res.render("./store/profile", {
      user,
      listings,
      favouritesCount,
      memberSince
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};

// Edit Profile Page
exports.getEditProfile = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Only allow editing own profile
    if (req.session.userId !== userId) {
      return res.redirect("/profile/" + userId);
    }

    const user = await User.findById(userId).lean();

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.render("./store/edit-profile", {
      user,
      successMsg: null,
      errorMsg: null
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};

// Post Edit Profile
exports.postEditProfile = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Only allow editing own profile
    if (req.session.userId !== userId) {
      return res.redirect("/profile/" + userId);
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    const { firstName, lastName, currentPassword, newPassword, confirmPassword, removeProfilePic } = req.body;

    // Update basic info
    user.firstName = firstName.trim();
    user.lastName = (lastName || '').trim();

    // Handle profile picture
    if (req.file) {
      user.profilePic = req.file.path;
      req.session.profilePic = req.file.path;
    } else if (removeProfilePic === 'true') {
      user.profilePic = 'https://res.cloudinary.com/dcrsi07me/image/upload/v1772456092/avatar_ft4hwd.png';
      req.session.profilePic = user.profilePic;
    }

    // Handle password change
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        const userLean = await User.findById(userId).lean();
        return res.render("./store/edit-profile", {
          user: userLean,
          successMsg: null,
          errorMsg: "Current password is incorrect"
        });
      }

      if (newPassword !== confirmPassword) {
        const userLean = await User.findById(userId).lean();
        return res.render("./store/edit-profile", {
          user: userLean,
          successMsg: null,
          errorMsg: "New passwords do not match"
        });
      }

      if (newPassword.length < 6) {
        const userLean = await User.findById(userId).lean();
        return res.render("./store/edit-profile", {
          user: userLean,
          successMsg: null,
          errorMsg: "Password must be at least 6 characters"
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      user.password = hashedPassword;
    }

    await user.save();

    // Update session data
    req.session.toast = { msg: 'Profile updated successfully ✅', type: 'success' };

    req.session.save(() => {
      res.redirect("/profile/" + userId);
    });

  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};
