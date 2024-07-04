import { IObjetReport, IReport, IUserReport, Report } from "../models/report.models";

export const addUserReport = async (usermakereport: IUserReport, userReport: IUserReport, motif: string): Promise<IReport> => {
    try {
        const newReport = new Report({
            usermakereport,
            userReport,
            motif,
            dateCreation: new Date(),
            statut: 'pending'
        });
        return await newReport.save();
    } catch (error) {
        throw error;
    }
};

export const addPostReport = async (usermakereport: IUserReport, objetReport: IObjetReport, motif: string): Promise<IReport> => {
    try {
        const newReport = new Report({
            usermakereport,
            objetReport,
            motif,
            dateCreation: new Date(),
            statut: 'pending'
        });
        return await newReport.save();
    } catch (error) {
        throw error;
    }
};

export const updateUserReport = async (id: string, motif: string): Promise<IReport | null> => {
    return await Report.findByIdAndUpdate(id, { motif, updatedAt: new Date() }, { new: true });
};

export const updatePostReport = async (id: string, motif: string): Promise<IReport | null> => {
    return await Report.findByIdAndUpdate(id, { motif, updatedAt: new Date() }, { new: true });
};

export const getReports = async (type?: 'user' | 'post'): Promise<IReport[]> => {
    const query: any = {};
    if (type) {
        if (type === 'user') {
            query.userReport = { $exists: true };
        } else if (type === 'post') {
            query.objetReport = { $exists: true };
        }
    }
    return await Report.find(query);
};

export const getReportById = async (id: string): Promise<IReport | null> => {
    return await Report.findById(id);
};