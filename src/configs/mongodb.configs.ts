import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

const uri = process.env.MONGODB_URL || "";

export async function runMongoDbConnection() {
  try {
    mongoose.connect(uri);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.log(error);
  }
}
