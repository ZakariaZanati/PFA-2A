var mongoose = require('mongoose')

// data 
var Schema = mongoose.Schema

var seuilsSchema = new Schema({
    nom: String,
    type: String,
    sousType: String,
    valMin: Number,
    valMax: Number,
    unite: String,
    abreviation: String
})

var seuils = mongoose.model('seuils',seuilsSchema);

module.exports = seuils;