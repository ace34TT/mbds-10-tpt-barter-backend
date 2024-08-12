import { createObjectHandler, deleteObjectHandler, getObjectByIdHandler, getObjectByOwnerListHandler, getObjectByOwnerHandler, getObjectByUserHandler, getObjectsHandler, updateObjectHandler } from "../controllers/object.controllers";
import express from "express";
import { createObjectValidationRules } from "../validators/objet.validator";
import dotenv from "dotenv";
import { upload } from "../services/upload.service";
import { getObjectsPaginHandler,updateObjectWithPhoto,deleteObjectStatus,getObjectByIdAllDataHandler } from "../controllers/object.controllers";

dotenv.config();
const router = express.Router();

router.get("/", getObjectsHandler);
router.get("/pagin",getObjectsPaginHandler);
router.get("/:id", getObjectByIdHandler);
router.get("/owner/:id", getObjectByOwnerHandler);
router.get("/objectOwner/:id", getObjectByOwnerListHandler);

router.post("/", createObjectValidationRules(),  upload.array('files', 10), createObjectHandler);
router.delete("/:id", deleteObjectHandler);
router.get("/user/:userId", getObjectByUserHandler);
router.get("/allData/:id", getObjectByIdAllDataHandler);
router.put("/:id",upload.array('files', 10), updateObjectWithPhoto);
router.delete("/:id", deleteObjectHandler);
router.delete("/status/:id", deleteObjectStatus);

export { router as ObjectRoutes };
