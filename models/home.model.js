const path = require("path");
const fs = require("fs/promises");
const rootdir = path.dirname(require.main.filename);
const dataFilePath = path.join(rootdir, "data", "home.json");

module.exports = class Home {
  constructor(id, name, size, location, price, image, description, favourite) {
    this.id = id;
    this.houseName = name;
    this.size = size;
    this.location = location;
    this.price = price;
    this.image = image;
    this.description = description;
    this.favourite = favourite;
  }

  async save(edit) {
    try {

      let homes = await Home.fetchAll();

      if (edit) {

        homes = homes.map(home => this.id == home.id ? this : home);

      }
      else {
        homes.push(this);
      }

      await fs.writeFile(dataFilePath, JSON.stringify(homes));
      console.log("Data saved in file!");

    } catch (err) {
      console.log(err);
    }
  }

  static async fetchAll() {
    try {
      const data = await fs.readFile(dataFilePath, "utf-8");
      let registeredHomes = JSON.parse(data);
      return registeredHomes;
    } catch (err) {
      return [];
    }
  }

  static async fetch(id) {
    try {
      const homes = await this.fetchAll();

      const home = homes.find(h => h.id == id); // loose compare safe here

      return home || null;

    } catch (err) {
      return null;
    }
  }

  static async delete(id) {
    try {
      let homes = await Home.fetchAll();

      const initialLength = homes.length;

      homes = homes.filter(home => home.id != id);

      if (homes.length === initialLength) {
        console.log("No home found with this ID");
      }

      else {
        await fs.writeFile(
          dataFilePath,
          JSON.stringify(homes, null, 2)
        );

        console.log("Home deleted!");
      }

    } catch (err) {
      console.error("Error deleting home:", err);
      throw err;
    }
  }

};
