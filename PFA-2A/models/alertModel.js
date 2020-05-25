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
    difference: Number
})

var alert = mongoose.model('alert', alertSchema);

module.exports = alert;