import { body, check } from "express-validator";
// Validator middleware
export const createObjectValidationRules = () => {
    return [
      check('name').isString().withMessage('Name must be a string'),
      check('categoryId').isInt().withMessage('Category ID must be an integer'),
      check('description').isString().withMessage('Description must be a string'),
      check('ownerId').isInt().withMessage('Owner ID must be an integer'),
    ];
  };