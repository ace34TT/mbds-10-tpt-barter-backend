import { createObjectHandler, deleteObjectHandler, getObjectByIdHandler, getObjectByOwnerHandler, getObjectsHandler, updateObjectHandler } from "../controllers/object.controllers";
import express from "express";
import { createObjectValidationRules } from "../validators/objet.validator";
import dotenv from "dotenv";
import { upload } from "../services/upload.service";

dotenv.config();
const router = express.Router();

router.get("/", getObjectsHandler);
router.get("/:id", getObjectByIdHandler);
router.get("/owner/:id", getObjectByOwnerHandler);
router.post("/", createObjectValidationRules(),  upload.array('files', 10), createObjectHandler);
router.put("/:id", updateObjectHandler);
router.delete("/:id", deleteObjectHandler);
router.get("/user/:userId", getObjectByUserHandler);

export { router as ObjectRoutes };
