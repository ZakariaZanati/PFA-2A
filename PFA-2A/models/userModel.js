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
            demande: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "medecin",
                default : null
            },
            statut : {
                type: Number,
                default: 0
            }
            
        }
    ],
    medecins: [
        {
            medecin: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'medecin',
                default : null
            },
            debutSuivi: {
                type: Date,
                default: Date.now
            },
            finSuivi: Date
        }
    ]
})

var utilisateur = mongoose.model('utilisateur', utilisateurSchema);

module.exports = utilisateur;
