import mongoose, { Schema, Document } from 'mongoose';

export interface IUserReport {
    id: number;
    username: string;
    adresse: string;
    email?: string;
}

export interface IObjetReport {
    id: number;
    nom: string;
    proprietaireId: number;
    categorieId: number;
}

export interface IReport extends Document {
    usermakereport: IUserReport;
    userReport: IUserReport;
    objetReport: IObjetReport;
    motif: string;
    dateCreation: Date;
    statut: 'pending' | 'accepted' | 'rejected';
}

const UserReportSchema: Schema = new Schema({
    id: { type: Number, required: true },
    username: { type: String, required: true },
    adresse: { type: String, required: true },
    email: { type: String, sparse: true, match: /.+\@.+\..+/ }
});

const ObjetReportSchema: Schema = new Schema({
    id: { type: Number, required: true },
    nom: { type: String, required: true },
    proprietaireId: { type: Number, required: true },
    categorieId: { type: Number, required: true }
});

const ReportSchema: Schema = new Schema({
    usermakereport: { type: UserReportSchema, required: true },
    userReport: { type: UserReportSchema },
    objetReport: { type: ObjetReportSchema },
    motif: { type: String, required: true },
    dateCreation: { type: Date, required: true, default: Date.now },
    statut: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
}, {
    timestamps: true
});


export const Report = mongoose.model<IReport>('Report', ReportSchema);
