const mongo = require("mongodb");

const MongoClient = mongo.MongoClient;

const MONGO_URL = "mongodb+srv://anuj6202188:anujdb@cluster0.fnmyvge.mongodb.net/?appName=Cluster0";

let _db;

async function mongoConnect() {
    try {
        const client = await MongoClient.connect(MONGO_URL);
        _db=client.db("airbnb");
        return client;
    } catch (err) {
        console.log("Error while connecting to mongoDb: ", err);
    }
}

const getDb = () => {
  if (!_db) {
    throw "Database not connected!";
  }
  return _db;
};

exports.mongoConnect=mongoConnect;

exports.getDb=getDb;