import express from "express";
import { getCountInsights } from "../controllers/dashboard.controllers";

const router = express.Router();

router.get("/count-insights", getCountInsights);

export { router as DashboardRoutes };