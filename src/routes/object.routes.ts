import { createObjectHandler, deleteObjectHandler, getObjectByIdHandler, getObjectsPaginHandler,updateObjectWithPhoto, getObjectsHandler,deleteObjectStatus, updateObjectHandler,getObjectByIdAllDataHandler,getObjectByOwnerHandler } from "../controllers/object.controllers";
import express from "express";
import { createObjectValidationRules } from "../validators/objet.validator";
import {upload} from "../services/upload"

const router = express.Router();
router.get("/", getObjectsHandler);
router.get("/pagin",getObjectsPaginHandler);
router.get("/:id", getObjectByIdHandler);
router.get("/owner/:id", getObjectByOwnerHandler);
router.get("/allData/:id", getObjectByIdAllDataHandler);
router.post("/", createObjectValidationRules(), upload.array('files', 10), createObjectHandler);
router.put("/:id",upload.array('files', 10), updateObjectWithPhoto);
router.delete("/:id", deleteObjectHandler);
router.delete("/status/:id", deleteObjectStatus);

export { router as ObjectRoutes };
