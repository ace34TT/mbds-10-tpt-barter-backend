import { S3 } from "@aws-sdk/client-s3";
import multer, { FileFilterCallback } from "multer";
import path from 'path';
import multerS3 from 'multer-s3';
import dotenv from "dotenv";
import { Request, Response } from "express";

dotenv.config();

const s3 = new S3({
    forcePathStyle: false,
    endpoint: "https://ams3.digitaloceanspaces.com",
    region: "us-east-1",
    credentials: {
        accessKeyId: process.env.SPACES_KEY!,
        secretAccessKey: process.env.SPACES_SECRET!,
    },
});

const imageFileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    console.log(file);
    const allowedFileTypes = /jpeg|jpg|png|gif/;
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());

    if (extname) {
        return cb(null, true);
    } else {
        cb(new Error("Only image files are allowed!"));
    }
};

export const upload = multer({
    storage: multerS3({
        s3,
        bucket: process.env.SPACES_NAME!,
        acl: "public-read",
        key: (req: Request, file: Express.Multer.File, cb: (error: any, key?: string) => void) => {
            const folderName = "troc";
            const fileName = `${Date.now().toString()}${path.extname(file.originalname)}`;
            const fullPath = `${folderName}/${fileName}`;
            cb(null, fullPath);
        },
    }),
    fileFilter: imageFileFilter,
});