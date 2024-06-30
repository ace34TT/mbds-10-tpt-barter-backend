import { getObjectsHandler } from "../controllers/object.controllers";
import express from "express";

const router = express.Router();

router.get("/", getObjectsHandler);

export { router as ObjectRoutes };
