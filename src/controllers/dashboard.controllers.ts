import { Request, Response } from "express";
import mongoose from "mongoose";
import * as dashboardService from "../services/dashboard.services";
import { getDeclinedExchangesForLast14Days, getExchangesForLast14Days, getTop5Categories } from "../services/dashboard.services";

export const getCountInsightsHandler = async (req: Request, res: Response) => {
    try {
        const [pendingReports, acceptedReports, rejectedReports, usersCount, dailyExchange, failedExchange] = await Promise.all([
            dashboardService.countPendingReport(),
            dashboardService.countAcceptedReport(),
            dashboardService.countRejectedReport(),
            dashboardService.countUsers(),
            dashboardService.countDailyExchange(),
            dashboardService.countDeclinedExchange()
        ]);

        const statistics = {
            pending: pendingReports,
            accepted: acceptedReports,
            rejected: rejectedReports,
            usersCount: usersCount,
            dailyExchange: dailyExchange,
            failedExchange: failedExchange
        };

        

        res.status(200).json(statistics);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving dashboard statistics.' });
    }
}

export const get14DaysExchangesHandler = async (req: Request, res: Response) => {
    try{
      const daysReports = await getExchangesForLast14Days();
      return res.status(200).json(daysReports);
    } catch(error) {
      return res.status(500).json({ error: "Failed to fetch 14 days exchanges" });
    }
};

export const get14DaysDeclinedExchangesHandler = async (req: Request, res: Response) => {
    try{
      const daysReports = await getDeclinedExchangesForLast14Days();
      return res.status(200).json(daysReports);
    } catch(error) {
      return res.status(500).json({ error: "Failed to fetch 14 days exchanges" });
    }
};

export const getTop5CategoriesHandler = async (req: Request, res: Response) => {
    try{
      const categories = await getTop5Categories();
      return res.status(200).json(categories);
    } catch(error) {
      return res.status(500).json({ error: "Failed to fetch Top 5 categories" });
    }
};