import { MongoClient, ServerApiVersion } from "mongodb";
import mongoose from "mongoose";
require("dotenv").config();

const uri = process.env.MONGODB_URL || "";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
export async function runMongoDbConnection() {
  try {
    mongoose.connect('mongodb://127.0.0.1:27017/barter');
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  } 
}
