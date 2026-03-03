const mongoose = require("mongoose");

const MONGO_URL = process.env.MONGO_URI;

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