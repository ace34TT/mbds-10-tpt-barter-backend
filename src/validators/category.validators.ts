import { body } from "express-validator";

export const createCategoryValidationRules = () => {
    return [
      body('title')
        .isString()
        .withMessage('Title must be a string')
        .isLength({ min: 1 })
        .withMessage('Title cannot be empty'),
    ];
  };