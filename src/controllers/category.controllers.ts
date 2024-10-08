import { Request, Response } from "express";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  categoryTitleExists
} from "../services/category.services";
import { validationResult } from "express-validator";

export const getCategoriesHandler = async (req: Request, res: Response) => {
  try{
    const categories = await getCategories();
    return res.status(200).json(categories);
  } catch(error) {
    return res.status(500).json({ error: "Failed to fetch categories" });
  }
};

export const getCategoryByIdHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const category = await getCategoryById(Number(id));
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    return res.status(200).json(category);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch category" });
  }
};

export const createCategoryHandler = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { title } = req.body;
  try {
    const titleExists = await categoryTitleExists(title);
    if (titleExists) {
      return res.status(409).json({ error: "Category already exists" });
    }
    
    const newCategory = await createCategory(title);
    return res.status(201).json(newCategory);
  } catch (error) {
    return res.status(500).json({ error: "Failed to create category" });
  }
};

export const updateCategoryHandler = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { id } = req.params;
  const { title } = req.body;
  try {
    const existingCategory = await getCategoryById(Number(id));
    if (!existingCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    const titleExists = await categoryTitleExists(title);
    if (titleExists && existingCategory.title !== title) {
      return res.status(409).json({ error: "Title already exists" });
    }

    const updatedCategory = await updateCategory(Number(id), title);
    return res.status(200).json(updatedCategory);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update category" });
  }
};

export const deleteCategoryHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const category = await getCategoryById(Number(id));
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    await deleteCategory(Number(id));
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete category" });
  }
};