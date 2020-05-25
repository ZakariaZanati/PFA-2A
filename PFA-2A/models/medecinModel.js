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
    adresse_lieu_travail : String,
    utilisateurs : [
        {
            utilisateur: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "utilisateur",
                default : null
            },
            debutContrat: {
                type: Date,
                default: Date.now
            },
            finContrat: Date
        } 
    ],
    demandes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "utilisateur",
            default : null
        } 
    ]

})

var medecin = mongoose.model('medecin',medecinSchema);

module.exports = medecin;