var mongoose = require('mongoose')

// data 
var Schema = mongoose.Schema

var utilisateurSchema = new Schema({
    nom: String,
    prenom: String,
    sexe : String,
    telephone: String,
    dateNaissance: Date,
    email: String,
    age: Number,
    ville: String,
    pays: String,
    password: String,
    groupeSanguin: String,
    maladies: [String],
    demandes: [
        {
            medecin: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "medecin",
                default : null
            },
            type: String,
            statut: String
        }
    ],
    medecins: [
        {
            medecin: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'medecin',
                default : null
            },
            debutContrat: {
                type: Date,
                default: Date.now
            },
            finContrat: Date
        }
    ]
})

var utilisateur = mongoose.model('utilisateur', utilisateurSchema);

module.exports = utilisateur;
