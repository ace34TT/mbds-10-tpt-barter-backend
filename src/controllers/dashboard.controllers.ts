import { Request, Response } from "express";
import mongoose from "mongoose";
import * as dashboardService from "../services/dashboard.services";

export const getCountInsights = async (req: Request, res: Response) => {
    try {
        const [pendingReports, acceptedReports, rejectedReports, usersCount] = await Promise.all([
            dashboardService.countPendingReport(),
            dashboardService.countAcceptedReport(),
            dashboardService.countRejectedReport(),
            dashboardService.countUsers(),
        ]);

        const statistics = {
            pending: pendingReports,
            accepted: acceptedReports,
            rejected: rejectedReports,
            usersCount: usersCount
        };

        res.status(200).json(statistics);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving dashboard statistics.' });
    }
}