import { Request, Response } from "express";

export const getCategoriesHandler = (req: Request, res: Response) => {
  return res.status(200).json({
    message: "Categories get is working",
  });
};

export const createCategoryHandler = (req: Request, res: Response) => {
  return res.status(200).json({
    message: "Category create successfully",
  });
};
