var mongoose = require('mongoose')

// data 
var Schema = mongoose.Schema

var medecinSchema = new Schema({
    nom_complet: String,
    sexe: String,
    telephone: String,
    email: String,
    ville: String,
    pays: String,
    password: String,
    adresse_lieu_travail : String,
    utilisareurs : {
        type : [String],
        default : null
    },

    demandes : {
        type : [String],
        default : null
    }


})

var medecin = mongoose.model('medecin',medecinSchema);

module.exports = medecin;