import { body, query } from 'express-validator';

export const userReportValidation = [
    body('userMakeReport.id').isInt().withMessage('User maker report ID must be an integer'),
    body('userMakeReport.username').isString().withMessage('User maker report username must be a string'),
    body('userMakeReport.email').isEmail().withMessage('User maker report email must be a valid email'),
    body('userReport.id').optional().isInt().withMessage('User report ID must be an integer'),
    body('userReport.username').optional().isString().withMessage('User report username must be a string'),
    body('userReport.email').optional().isEmail().withMessage('User report email must be a valid email'),
    body('motif').isString().withMessage('Motif must be a string'),
];

export const postReportValidation = [
    body('userMakeReport.id').isInt().withMessage('User maker report ID must be an integer'),
    body('userMakeReport.username').isString().withMessage('User maker report username must be a string'),
    body('userMakeReport.email').isEmail().withMessage('User maker report email must be a valid email'),
    body('objetReport.id').isInt().withMessage('Object report ID must be an integer'),
    body('objetReport.nom').isString().withMessage('Object report name must be a string'),
    body('objetReport.proprietaireId').isInt().withMessage('Object report owner ID must be an integer'),
    body('objetReport.categorieId').isInt().withMessage('Object report category ID must be an integer'),
    body('motif').isString().withMessage('Motif must be a string'),
];

export const statusUpdateValidation = [
    body('statut').isIn(['pending', 'accepted', 'rejected']).withMessage('Status must be one of the following: pending, accepted, rejected'),
];

export const reportTypeValidation = [
    query('type').isIn(['user', 'post']).withMessage('Type must be one of the following: user, post')
];