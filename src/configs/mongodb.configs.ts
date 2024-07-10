import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from 'dotenv';
dotenv.config();

const uri =  process.env.MONGODB_URL || "";

export async function runMongoDbConnection() {
  try {
    mongoose.connect(uri);
  } catch (error) {
    console.log(error);
  }
}
