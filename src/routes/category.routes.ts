import express from "express";
import {
  createCategoryHandler,
  getCategoriesHandler,
} from "../controllers/category.controllers";

const router = express.Router();

router.get("/", getCategoriesHandler);
router.post("/", createCategoryHandler);
export { router as CategoryRoutes };
