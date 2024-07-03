import mongoose from 'mongoose';
const MessageSchema = new mongoose.Schema({
	expediteur : {
        id: { type: Number, required: true },
        username: { type: String, required: true },
        adresse: { type: String, required: true },
        email: { type: String, required: true , unique: true,isEmail: true},
    },
    destinataire : { id: { type: Number, required: true },
    username: { type: String, required: true },
    adresse: { type: String, required: true },
    email: { type: String, required: true , unique: true,isEmail: true},
    },
	contenu: {type:String ,required:true},
	dateEnvoi:  {type: Date,required : true},
	statut:  {type: String,enum: ['read', 'not_read'],default: 'non_lu'}
});

module.exports = mongoose.model('Message', MessageSchema);
