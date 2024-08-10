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

export const updateReport = async (id: string, statut: string): Promise<IReport | null> => {
    return await Report.findByIdAndUpdate(id, { statut, updatedAt: new Date() }, { new: true });
};

export const updateUserReport = async (id: string, statut: string): Promise<IReport | null> => {
    return await Report.findByIdAndUpdate(id, { statut, updatedAt: new Date() }, { new: true });
};

export const updatePostReport = async (id: string, statut: string): Promise<IReport | null> => {
    return await Report.findByIdAndUpdate(id, { statut, updatedAt: new Date() }, { new: true });
};

export const getReports = async (type?: 'user' | 'post', statut?: 'pending' | 'rejected' | 'accepted'): Promise<IReport[]> => {
    const query: any = {};
    if (type) {
        if (type === 'user') {
            query.userReport = { $exists: true };
        } else if (type === 'post') {
            query.objetReport = { $exists: true };
        }
    }

    if(statut){
        query.statut = statut;
    }
    
    return await Report.find(query);
};

export const getUserReports = async (userid: number): Promise<IReport[]> => {
    try {
        const reports = await Report.find({ 'usermakereport.id': userid });
        return reports;
    } catch (error) {
        console.error("Erreur lors de la récupération des rapports:", error);
        throw error;
    }
};

export const getReportById = async (id: string): Promise<IReport | null> => {
    return await Report.findById(id);
};