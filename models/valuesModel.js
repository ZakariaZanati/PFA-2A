var mongoose = require('mongoose')

var Schema = mongoose.Schema

var oneValueSchema = new Schema({
    temps: String,
    valeur: Number,
})

var valuesSchema = new Schema({
    id: String,
    date: Date,
    temperature: [oneValueSchema],
    tension: [oneValueSchema],
    tauxOxygen: [oneValueSchema],
    tauxGlucose: [oneValueSchema],
})

var prelevements = mongoose.model('prelevements', valuesSchema)

module.exports = prelevements;
