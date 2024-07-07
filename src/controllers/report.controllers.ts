import { Request, Response } from "express";
import * as reportService from '../services/report.services';
import { validationResult } from "express-validator";
import mongoose from "mongoose";

export const addUserReportHandler = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { usermakereport, userReport, motif } = req.body;
    const report = await reportService.addUserReport(usermakereport, userReport, motif);
    res.status(201).json(report);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const addPostReportHandler = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { usermakereport, objetReport, motif } = req.body;
    const report = await reportService.addPostReport(usermakereport, objetReport, motif);
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const updateUserReportHandler = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { id } = req.params;
    const { statut } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const report = await reportService.updateUserReport(id, statut);
    if (report) {
      res.status(200).json(report);
    } else {
      res.status(404).json({ message: "Report not found" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export const updatePostReportHandler = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { id } = req.params;
    const { statut } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const report = await reportService.updatePostReport(id, statut);
    if (report) {
      res.status(200).json(report);
    } else {
      res.status(404).json({ message: "Report not found" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getReportsHandler = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { type } = req.query;
    const reports = await reportService.getReports(type as 'user' | 'post');
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getReportByIdHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const report = await reportService.getReportById(id);
    if (report) {
      res.status(200).json(report);
    } else {
      res.status(404).json({ message: "Report not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};