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
            type: mongoose.Schema.Types.ObjectId,
            ref: "utilisateur",
            default : null
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