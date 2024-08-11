import { S3 } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import multer, { FileFilterCallback } from "multer";
import multerS3 from "multer-s3";
import path from "path";
import { Request } from "express";

dotenv.config();

const s3 = new S3({
  forcePathStyle: false, // Configures to use subdomain/virtual calling format.
  endpoint: "https://ams3.digitaloceanspaces.com",
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.SPACES_KEY || "",
    secretAccessKey: process.env.SPACES_SECRET || "",
  },
});

const imageFileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowedFileTypes = /jpeg|jpg|png|gif/;
  const extname = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

export const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.SPACES_NAME || "", // Ensure that the bucket name is provided
    acl: "public-read", // Access control for the file
    key: (req: Request, file: Express.Multer.File, cb: (error: any, key?: string) => void) => {
      const folderName = "troc";
      const fileName = `${Date.now().toString()}${path.extname(
        file.originalname
      )}`;

      const fullPath = `${folderName}/${fileName}`;
      cb(null, fullPath); // Use a unique file name
    },
  }),
  fileFilter: imageFileFilter,
});
