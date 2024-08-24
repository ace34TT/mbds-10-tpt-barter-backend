import * as admin from "firebase-admin";

require("dotenv").config();

let serviceAccount = require("./barter-be0e3-firebase-adminsdk-tdtqn-3fd29327d3.json");

console.log(serviceAccount)

const firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


// const { privateKey } = JSON.parse(process.env.FIREBASE_PRIVATE_KEY || "");
// const firebaseAdmin = admin.initializeApp(
//     {
//       credential: admin.credential.cert({
//         projectId: process.env.FIREBASE_PROJECT_ID,
//         clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//         privateKey,
//       }),
//       // storageBucket: process.env.FIREBSE_STORAGE_BACKET,
//     },
//     // "firebase"
// );

export {firebaseAdmin};