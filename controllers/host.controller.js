const Home = require("../models/home.model");
const User = require("../models/user.model");


exports.addHomeGet = (req, res) => {
  res.render("./host/edit-home", { edit: false });
};

exports.addHomePost = async (req, res) => {
  const userId = req.session.userId;
  const homeImages = req.files.map(file => file.path);

  const { "house-name": houseName, size, location, price, "description": homeDescription } = req.body;
  const home = new Home({ houseName, size, location, price, homeImages, homeDescription, hostId: userId });
  await home.save();
  const user = await User.findById(userId);
  user.listings.push(home._id);
  await user.save();
  res.render("./host/add-home-response");
};



exports.getListing = async (req, res) => {
  try {
    const userId = req.session.userId;

    const user = await User.findById(userId);

    const listedHomes = user.listings;

    const homes = await Home.find({
      _id: { $in: listedHomes }
    }).lean();

    res.render("./host/host-home-list", { homes: homes });
  }
  catch (err) {
    return err;
  }
};

exports.getEditHome = async (req, res) => {
  try {
    const id = req.params.id;
    const editing = true;

    const home = await Home.findById(id);
    const userId=req.session.userId;

    if(home.hostId.toString() != userId){
      return res.redirect("/host/listings?toast=You are not authorized to edit this listing 🚫");
    }

    res.render("./host/edit-home", {
      home: home,
      edit: editing
    })
  }
  catch (err) {
    res.redirect("/host/listings");
  }
}

exports.postEditHome = async (req, res) => {
  try {

    const userId=req.session.userId;
    const homeId=req.params.id;
    const home=await Home.findById(homeId);
    const hostId=home.hostId.toString();

    if(hostId != userId){
      return res.redirect("/host/listings?toast=You are not authorized to edit this listing 🚫");
    }

    const { "house-name": houseName, size, location, price, "description": homeDescription } = req.body;

    const id = req.params.id;

    await Home.findByIdAndUpdate(id, {
      houseName,
      size,
      location,
      price,
      homeDescription
    });

    res.redirect("/host/listings?toast=Property updated successfully ✅");

  }
  catch (err) {
    console.log("Failed to edit home!");
    res.redirect("/host/listings");
  }

}

exports.deleteHome = async (req, res) => {
  try {

    const homeId = req.params.id;
    const userId = req.session.userId;
    const home=await Home.findById(homeId);

    if(home.hostId.toString() != userId){
      return res.redirect("/host/listings?toast=You are not authorized to delete this listing 🚫");
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { listings: homeId } }
    );

    await Home.findByIdAndDelete(homeId);

    res.redirect("/host/listings?toast=Listing deleted successfully 🗑️");

  }
  catch (err) {
    console.log("Failed to delete home");
    res.redirect("/host/listings");
  }
};