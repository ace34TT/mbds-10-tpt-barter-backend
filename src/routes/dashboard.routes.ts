import express from "express";
import { getCountInsightsHandler, get14DaysExchangesHandler, get14DaysDeclinedExchangesHandler, getTop5CategoriesHandler } from "../controllers/dashboard.controllers";

const router = express.Router();

router.get("/count-insights", getCountInsightsHandler);
router.get("/14-days-reports", get14DaysExchangesHandler);
router.get("/14-days-declined-reports", get14DaysDeclinedExchangesHandler);
router.get("/top-5-categories", getTop5CategoriesHandler);

export { router as DashboardRoutes };