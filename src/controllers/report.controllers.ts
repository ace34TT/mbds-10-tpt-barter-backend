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
    const { userMakeReport, userReport, motif } = req.body;
    const report = await reportService.addUserReport(userMakeReport, userReport, motif);
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
    const { userMakeReport, objetReport, motif } = req.body;
    const report = await reportService.addPostReport(userMakeReport, objetReport, motif);
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


export const updateReportHandler = async (req: Request, res: Response) => {
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

    const report = await reportService.updateReport(id, statut);
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
  try {
    const { type, statut } = req.query;
    const reports = await reportService.getReports(type as 'user' | 'post', statut as 'pending' | 'rejected' | 'accepted');
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getUserReportsHandler = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;

    const reports = await reportService.getUserReports(+id);
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


// admin
export const getReportsAdminHandler = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const { type, statut } = req.query;
    const reports = await reportService.getReportsAdmin(type as 'user' | 'post', statut as 'pending' | 'rejected' | 'accepted', page, limit);
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json(error);
  }
};