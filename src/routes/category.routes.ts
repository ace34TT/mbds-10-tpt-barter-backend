import express from "express";
import {
  createCategoryHandler,
  getCategoriesHandler,
  getCategoryByIdHandler,
  updateCategoryHandler,
  deleteCategoryHandler
} from "../controllers/category.controllers";
import { createCategoryValidationRules } from "../validators/category.validators";

const router = express.Router();

router.get("/", getCategoriesHandler);
router.get("/:id", getCategoryByIdHandler);
router.post("/", createCategoryValidationRules(),createCategoryHandler);
router.put("/:id", createCategoryValidationRules(),updateCategoryHandler);
router.delete("/:id", deleteCategoryHandler);

export { router as CategoryRoutes };
