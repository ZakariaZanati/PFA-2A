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
    alerts: [{
        date: Date,
        temps: String,
        mesure: String,
        text: String,
        difference: Number
    }],
    medecin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'medecin',
        default : null
    }
})

var utilisateur = mongoose.model('utilisateur', utilisateurSchema);

module.exports = utilisateur;
