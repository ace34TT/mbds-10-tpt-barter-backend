import { S3 } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";
import express from "express";

dotenv.config();

const s3 = new S3({
  forcePathStyle: false, // Configures to use subdomain/virtual calling format.
  endpoint: "https://ams3.digitaloceanspaces.com",
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.SPACES_KEY,
    secretAccessKey: process.env.SPACES_SECRET,
  },
});

const imageFileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|gif/;
  const extname = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.SPACES_NAME,
    acl: "public-read", // Access control for the file
    key: (req, file, cb) => {
      const folderName = "troc";
      const fileName = `${Date.now().toString()}${path.extname(
        file.originalname
      )}`;

      const fullPath = `${folderName}/${fileName}`;
      cb(null, fullPath); // Use a unique file name
    },
    fileFilter: imageFileFilter,
  }),
});

const app = express();
const port = 3000;

app.post("/upload", upload.single("file"), (req, res) => {
  res.send({
    message: "File uploaded successfully",
    file: req.file.location, // The URL of the uploaded file
  });
});

app.use((err, req, res, next) => {
  if (err) {
    res.status(400).send({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

console.log(s3);