var mongoose = require('mongoose')

// data 
var Schema = mongoose.Schema

var utilisateurSchema = new Schema({
    nom_complet: String,
    sexe : String,
    telephone: String,
    dateNaissance: Date,
    email: String,
    age: Number,
    ville: String,
    pays: String,
    password: String,
    groupeSanguin: String,
    Medecin : {
        type : String,
        default : null
    }

})

var utilisateur = mongoose.model('utilisateur', utilisateurSchema);

module.exports = utilisateur;
