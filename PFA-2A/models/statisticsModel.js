var mongoose = require('mongoose')

// data 
var Schema = mongoose.Schema

var moyenneSchema = new Schema({
    moyenneTemperature : {
        type : Number,
        default : null,
    },
    moyenneTensionSystolique : {
        type : Number,
        default : null,
    },
    moyenneTensionDiastolique : {
        type : Number,
        default : null,
    },
    moyenneTauxOxygen : {
        type : Number,
        default : null,
    },
    moyenneTauxGlucose : {
        type : Number,
        default : null,
    }
})

var moyenneMoiSchema = new Schema({
    moi : {
        type : Number,
        default : null
    },
    moyenneTemperature : {
        type : Number,
        default : null,
    },
    moyenneTensionSystolique : {
        type : Number,
        default : null,
    },
    moyenneTensionDiastolique : {
        type : Number,
        default : null,
    },
    moyenneTauxOxygen : {
        type : Number,
        default : null,
    },
    moyenneTauxGlucose : {
        type : Number,
        default : null,
    }

})

var statisticSchema = new Schema({

    utilisateur : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "utilisateur",
        default : null
    },

    MoyennesJours : [{
        jour : {
            type : Date,
            default : null
        },

        moyennesJour: [Number]

    }],

    MoyennesSemaines : [
        {
            debutSemaine : {
                type : Date,
                default : null
            },
            finSemaine : {
                type : Date,
                default : null
            },
            moyenneTemperature : {
                type : Number,
                default : null,
            },
            moyenneTensionSystolique : {
                type : Number,
                default : null,
            },
            moyenneTensionDiastolique : {
                type : Number,
                default : null,
            },
            moyenneTauxOxygen : {
                type : Number,
                default : null,
            },
            moyenneTauxGlucose : {
                type : Number,
                default : null,
            }

        }
    ],

    MoyennesAnnees : [
        {
            annee : {
                type : Number,
                default : null,
            },

            moyennesMois : [moyenneMoiSchema],

            moyenneAnnee : moyenneSchema
            
        }
    ]

})

var statistic = mongoose.model('statistic' , statisticSchema);

module.exports = statistic;