import mongoose from 'mongoose';
const ReportingSchema = new mongoose.Schema({
	usermakereport : {
        id: { type: Number, required: true },
        username: { type: String, required: true },
        adresse: { type: String, required: true },
    },
    userReport  :{
        id: { type: Number},
        username: { type: String, unique: true },
        adresse: { type: String, },
        email: { type: String, unique: true,isEmail: true},
    },
    objetReport  :{
        id: { type: Number },
        nom: { type: String},
        proprietaireId: { type: Number},
        categorieId: { type: Number},
    },
    motif : { type: String, required: true },
	dateCreation:  {type: Date,required : true},
	statut:  {type: String,enum: ['pending', 'accepted','rejected'],default: 'pending'}
});

module.exports = mongoose.model('Reporting', ReportingSchema);
