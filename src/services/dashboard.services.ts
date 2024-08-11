import prisma from '../configs/prisma.configs';
import { IObjetReport, IReport, IUserReport, Report } from "../models/report.models";

export const countPendingReport = async (): Promise<number> => {
    try {
        return await Report.countDocuments({ statut: 'pending' });
    } catch (error) {
        throw error;
    }
};

export const countAcceptedReport = async (): Promise<number> => {
    try {
        return await Report.countDocuments({ statut: 'accepted' });
    } catch (error) {
        throw error;
    }
};

export const countRejectedReport = async (): Promise<number> => {
    try {
        return await Report.countDocuments({ statut: 'rejected' });
    } catch (error) {
        throw error;
    }
};

export const countUsers = async () : Promise<number> => {
    try {
        return await prisma.user.count();
    } catch (error) {
        throw error;
    }
}