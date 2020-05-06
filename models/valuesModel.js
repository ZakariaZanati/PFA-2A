var mongoose = require('mongoose')

var Schema = mongoose.Schema

var oneValueSchema = new Schema({
    temps: String,
    valeur: Number,
})

var valuesSchema = new Schema({
    utilisateur :
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "utilisateur",
            default : null
        },
    date: Date,
    temperature: [oneValueSchema],
    tensionSystolique: [oneValueSchema],
    tensionDiastolique: [oneValueSchema],
    tauxOxygen: [oneValueSchema],
    tauxGlucose: [oneValueSchema],
    moyennesJour: [Number],
})

var prelevements = mongoose.model('prelevements', valuesSchema)

module.exports = prelevements;
