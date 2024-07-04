import express from "express";
import { addPostReportHandler, addUserReportHandler, getReportByIdHandler, getReportsHandler, updatePostReportHandler, updateUserReportHandler } from "../controllers/report.controllers";
import { postReportValidation, reportTypeValidation, statusUpdateValidation, userReportValidation } from "../validators/report.validators";

const router = express.Router();

router.get('/', reportTypeValidation, getReportsHandler);
router.post('/user', userReportValidation, addUserReportHandler);
router.post('/post', postReportValidation, addPostReportHandler);
router.put('/user/:id', statusUpdateValidation, updateUserReportHandler);
router.put('/post/:id', statusUpdateValidation, updatePostReportHandler);
router.get('/:id', getReportByIdHandler);

export { router as ReportRoutes };
