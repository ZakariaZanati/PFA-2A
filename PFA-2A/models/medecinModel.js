var mongoose = require('mongoose')

// data 
var Schema = mongoose.Schema

var medecinSchema = new Schema({
    nom: String,
    prenom: String,
    sexe: String,
    telephone: String,
    email: String,
    ville: String,
    pays: String,
    password: String,
    specialite: String,
    adresse_lieu_travail : String,
    utilisateurs : [
        {
            utilisateur: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "utilisateur",
                default : null
            },
            debutSuivi: {
                type: Date,
                default: Date.now
            },
            finSuivi: Date
        } 
    ],
    demandes: [
        {
            demande: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "utilisateur",
                default : null
            },
            statut : {
                type: Number,
                default: 0
            }
        } 
    ]

})

var medecin = mongoose.model('medecin',medecinSchema);

module.exports = medecin;