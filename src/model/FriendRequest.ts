import mongoose from 'mongoose';
const FriendRequestSchema = new mongoose.Schema({
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
	dateDemande:  {type: Date,required : true},
	statut:  {type: String,enum: ['pending', 'accepted','rejected'],default: 'pending'}
});

module.exports = mongoose.model('FriendRequest', FriendRequestSchema);
