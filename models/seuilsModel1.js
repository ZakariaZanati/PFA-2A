var mongoose = require('mongoose')

// data 
var Schema = mongoose.Schema

var seuilsSchema = new Schema({
    temperature: {
        unite: "Celsius",
        abreviation: "°C",
        valMin: {
            type: Number,
            default: 36.5
        },
        valMax: {
            type: Number,
            default: 37.5
        }
    },
    tension: {
        unite: "Millimètre de mercure",
        abreviation: "mmHg",
        systolique : {
            valMin: {
                type: Number,
                default: 110
            },
            valMax: {
                type: Number,
                default: 140
            }
        },
        diastolique : {
            valMin: {
                type: Number,
                default: 70
            },
            valMax: {
                type: Number,
                default: 90
            }
        }, 
    },
    tauxOxygen: {
        unite: "% Sturation",
        abreviation: "%",
        valMin: {
            type: Number,
            default: 95
        },
        valMax: {
            type: Number,
            default: 100
        }
    },
    tauxGlucose: {
        unite: "Gramme de glucose par litre de sang",
        abreviation: "g/L",
        aJeun: {
            valMin: {
                type: Number,
                default: 0.7
            },
            valMax: {
                type: Number,
                default: 1.1
            },
            diabeteGestationnel : {
                type: Number,
                default: 0.95
            }
        },
        postPrandial: {
            diabeteType_1:{
                type: Number,
                default: 1.6
            },
            diabeteType_2:{
                type: Number,
                default: 1.8
            },
            diabeteGestationnel : {
                type: Number,
                default: 1.2
            }
        }
    }
})

var seuils = mongoose.model('seuils',seuilsSchema);

