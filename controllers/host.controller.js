const Fav = require("../models/favourite.model");
const Home = require("../models/home.model");

exports.addHomeGet = (req, res) => {
  res.render("./host/edit-home", { edit: false });
};

exports.addHomePost = async (req, res) => {
  const { "house-name": houseName, size, location, price, image, description } = req.body;
  let favourite = false;
  const edit=false;
  const home = new Home(houseName, size, location, price, image, description, favourite);
  await home.save(edit);
  res.render("./host/add-home-response");
  console.log(home);
};

exports.getListing = async (req, res) => {
  try {
    const homes = await Home.fetchAll();

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

    const home = await Home.fetch(id);

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
    const { "house-name": houseName, size, location, price, image, description } = req.body;
    const id = req.params.id;
    const reqHome=await Home.fetch(id);
    const fav=reqHome.favourite;

    const home = new Home(houseName, size, location, price, image, description, fav);

    await home.save(true,id);

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
    const existingHome = await Home.fetch(homeId);
    const fav = existingHome.favourite;

    await Home.delete(homeId);

    if (fav) await Fav.removeFromFav(homeId);

    res.redirect("/host/listings?toast=Listing deleted successfully 🗑️");

  }
  catch (err) {
    console.log("Failed to delete home");
    res.redirect("/host/listings");
  }
}