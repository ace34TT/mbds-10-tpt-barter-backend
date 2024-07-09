import express from "express";
import { addPostReportHandler, addUserReportHandler, getReportByIdHandler, getReportsHandler, getUserReportsHandler, updatePostReportHandler, updateReportHandler, updateUserReportHandler } from "../controllers/report.controllers";
import { postReportValidation, reportTypeValidation, statusUpdateValidation, userReportValidation } from "../validators/report.validators";

const router = express.Router();

router.get('/', reportTypeValidation, getReportsHandler);
router.post('/user', userReportValidation, addUserReportHandler);
router.post('/post', postReportValidation, addPostReportHandler);
router.put('/:id', statusUpdateValidation, updateReportHandler);
router.get('/:id', getReportByIdHandler);
router.get('/:id/user', getUserReportsHandler);

export { router as ReportRoutes };
