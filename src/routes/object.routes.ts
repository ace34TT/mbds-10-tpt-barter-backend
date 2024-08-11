import {
  createObjectHandler,
  deleteObjectHandler,
  getObjectByIdHandler,
  getObjectByUserHandler,
  getObjectsHandler,
  updateObjectHandler,
} from "../controllers/object.controllers";
import express from "express";
import { createObjectValidationRules } from "../validators/objet.validator";
import { google } from "googleapis";
import multer from "multer";
import fs from "fs";
import { getActivePostsHandler } from "../controllers/post.controllers";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
});

router.get("/", getObjectsHandler);
router.get("/:id", getObjectByIdHandler);
router.post(
  "/",
  createObjectValidationRules(),
  upload.array("files", 5),
  createObjectHandler
);
router.put("/:id", updateObjectHandler);
router.delete("/:id", deleteObjectHandler);
router.get("/user/:userId", getObjectByUserHandler);

export { router as ObjectRoutes };
