const Fav = require("../models/favourite.model");
const Home = require("../models/home.model");

exports.addHomeGet = (req, res) => {
  res.render("./host/edit-home", { edit: false });
};

exports.addHomePost = async (req, res) => {
  const { "house-name": houseName, size, location, price, "image": imageUrl, "description": homeDescription } = req.body;
  let favourite = false;

  const home = new Home({ houseName, size, location, price, imageUrl, homeDescription, favourite });
  await home.save();

  res.render("./host/add-home-response");
};

exports.getListing = async (req, res) => {
  try {
    const homes = await Home.find().lean();

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

    const { "house-name": houseName, size, location, price, "image": imageUrl, "description": homeDescription } = req.body;

    const id = req.params.id;
    const reqHome = await Home.findById(id);

    await Home.findByIdAndUpdate(id, {
      houseName,
      size,
      location,
      price,
      imageUrl,
      homeDescription,
      favourite: reqHome.favourite
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

    await Home.findByIdAndDelete(homeId);

    res.redirect("/host/listings?toast=Listing deleted successfully 🗑️");

  }
  catch (err) {
    console.log("Failed to delete home");
    res.redirect("/host/listings");
  }
}