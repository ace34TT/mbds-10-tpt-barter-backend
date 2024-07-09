import { body, query } from 'express-validator';

export const notificationValidation = [
    body('userId').isNumeric().withMessage('User Id is not specified'),
    body('subject').isString().not().isEmpty().withMessage('Subject must be a string'),
    body('message').isString().not().isEmpty().withMessage('Message must be a string'),
];