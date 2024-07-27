import { createObjectHandler, deleteObjectHandler, getObjectByIdHandler, getObjectsPaginHandler, getObjectsHandler, updateObjectHandler,getObjectByIdAllDataHandler } from "../controllers/object.controllers";
import express from "express";
import { createObjectValidationRules } from "../validators/objet.validator";
import { google } from "googleapis";
import multer from 'multer';
import fs from 'fs';

const router = express.Router();
const upload = multer({
    storage: multer.memoryStorage(),
  }); 

router.get("/", getObjectsHandler);
router.get("/pagin",getObjectsPaginHandler);
router.get("/:id", getObjectByIdHandler);
router.get("/allData/:id", getObjectByIdAllDataHandler);
router.post("/", createObjectValidationRules(), upload.array('files', 5), createObjectHandler);
router.put("/:id", updateObjectHandler);
router.delete("/:id", deleteObjectHandler);

export { router as ObjectRoutes };
