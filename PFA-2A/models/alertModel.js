var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var alertSchema = new Schema({
    utilisateur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "utilisateur",
    },
    date: Date,
    temps: String,
    mesure: String,
    text: String,
    difference: Number,
    /*statutPatient: {
        type: Number,
        default: 0
    },
    statutMedecin: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "medecin",
        }
    ]*/
    alertedPatient: {
        type: Number,
        default: 0
    },
    alertedMedecin: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "medecin",
        }
    ]
})

var alert = mongoose.model('alert', alertSchema);

module.exports = alert;