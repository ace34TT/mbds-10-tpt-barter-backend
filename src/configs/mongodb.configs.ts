import mongoose from "mongoose";
require("dotenv").config();

const uri = process.env.MONGODB_URL || "";

export async function runMongoDbConnection() {
  try {
    mongoose.connect(uri);
  } catch(error) {
    console.log(error);
  }
}
