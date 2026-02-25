const mongoose = require("mongoose");

const MONGO_URL = "mongodb+srv://anuj6202188:anujdb@cluster0.fnmyvge.mongodb.net/airbnb?retryWrites=true&w=majority";

async function dbConnect() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("✅ MongoDB connected");
    } catch (err) {
        console.log("Error while connecting to mongoDb: ", err);
    }
}

exports.dbConnect=dbConnect;
exports.MONGO_URL=MONGO_URL;