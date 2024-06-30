import express from "express";
import { getReportsHandler } from "../controllers/report.controllers";

const router = express.Router();

router.get("/", getReportsHandler);

export { router as ReportRoutes };
