const {getDb} = require("../utils/database");
const mongodb = require("mongodb");

module.exports = class Home {
  constructor(name, size, location, price, image, description, favourite) {
    this.houseName = name;
    this.size = size;
    this.location = location;
    this.price = Number(price);
    this.imageUrl = image;
    this.homeDescription = description;
    this.favourite = favourite;
  }

  async save(edit,id) {
    try {

      if (edit) {
        const db=getDb();

        await db.collection('homes').updateOne(
          {_id: new mongodb.ObjectId(id)},
          {$set:this}
        );

      }
      else {
        const db=getDb();
        await db.collection('homes').insertOne(this);
      }

    } catch (err) {
      console.log(err);
    }
  }

  static async fetchAll() {
    try {

      const db=getDb();
      const homes = await db.collection('homes').find().toArray();

      return homes;

    } catch (err) {
      return [];
    }
  }

  static async fetch(id) {
  try {

    const db=getDb();

    const currentHome=await db.collection('homes').findOne({_id: new mongodb.ObjectId(id)});

    return currentHome || null;

  } catch (err) {
    return null;
  }
}

  static async delete(id) {
    try {
      const db=getDb();
      await db.collection('homes').deleteOne({_id: new mongodb.ObjectId(id)});
      console.log("Home deleted!");
    }
    catch (err) {
      console.error("Error deleting home:", err);
      throw err;
    }
  }

};
