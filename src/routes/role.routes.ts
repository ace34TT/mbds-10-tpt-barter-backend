import express from "express";
import { getRolesHandler } from "../controllers/role.controllers";

const router = express.Router();

router.get("/", getRolesHandler);

export { router as RoleRoutes };