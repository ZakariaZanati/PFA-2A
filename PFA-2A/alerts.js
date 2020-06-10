var mongoose = require('mongoose');
const User = require('./models/userModel');
const Seuils = require('./models/seuilsModel');
const Alert = require('./models/alertModel');

function getFormatDate(){
    var dateArray = Date().split(' ');
    var _month = new Date().getMonth() + 1;
    var month = _month < 10 ? '0' + _month : _month;
    var date = dateArray[3] + '-' + month + '-' + dateArray[2];
    var time = dateArray[4];  
    var day = new Date().getDay();
    return [date, time,day];
}

function sendAlert(userId, valeur, nom, type, sousType, heure, operation) {
    var currentDate = getFormatDate();
    var _date = currentDate[0];
    var _time = currentDate[1];
    Seuils.findOne({nom: nom, type: type, sousType: sousType})
    .then((mesure) => {
        var nomMesure = mesure.nom + " " + type;
        var unite = mesure.abreviation;
        var seuilMin = mesure.valMin;
        var seuilMax = mesure.valMax;
        var valSeuil;
        var comparaison;
        var level;
        if(valeur < seuilMin) {
            valSeuil = seuilMin;
            comparaison = " est inferieure au seuil min ";
            level = -1;
        }
        else if(valeur > seuilMax) {
            valSeuil = seuilMax;
            comparaison = " est superieure au seuil max ";
            level = 1;
        }
        else {
            level = 0;
        }
        var difference = valeur - valSeuil;
        if(operation == 'create') {
            var alert = new Alert({
                utilisateur: userId,
                date: _date, 
                valeur: valeur,
                temps: _time, 
                mesure: nomMesure,
                text: nomMesure + " : " + valeur + " " + unite + comparaison + valSeuil + " " + unite,
                difference: difference         
            });
            Alert.create(alert);
        }
        
        else if(operation == 'update') {
            if(level == 0) {
                Alert.findOneAndDelete({utilisateur: userId, date: _date, mesure: nomMesure, temps: heure})
                .then((doc) => {
                    
                });
            }
            else {
                Alert.findOneAndUpdate({utilisateur: userId, date: _date, mesure: nomMesure, temps: heure, valeur: {$nin: [valeur]}},
                    {$set: {difference: valeur - valSeuil,
                        text: nomMesure + " : " + valeur + " " + unite + comparaison + valSeuil + " " + unite,
                        valeur: valeur,
                        alertedPatient: 0,
                        alertedMedecin: []}})
                .then((doc) => {
                    
                });
            }
        }
        
        
    })
}

var sendAlerts = (userId, temperature, tauxOxygen, tensionArray, tauxGlucose, aJeun, heure, operation) => {
    sendAlert(userId, temperature, "Temperature", "", "", heure, operation);
    sendAlert(userId, tauxOxygen, "Taux d'oxygène", "", "", heure, operation);
    sendAlert(userId, tensionArray[0], "Tension", "systolique", "", heure, operation);
    sendAlert(userId, tensionArray[1], "Tension", "diastolique", "", heure, operation);
    User.findById(userId)
    .then((user) => {
        if(user.maladies.indexOf("Diabete type 1") != -1) {
            aJeun ? sendAlert(userId, tauxGlucose, "Taux de glucose", "a jeun", "", heure, operation)
                    : sendAlert(userId, tauxGlucose, "Taux de glucose", "post prandial", "diabete type 1", heure, operation);
        }
        else if(user.maladies.indexOf("Diabete type 2") != -1) {
            aJeun ? sendAlert(userId, tauxGlucose, "Taux de glucose", "a jeun", "", heure, operation)
                    : sendAlert(userId, tauxGlucose, "Taux de glucose", "post prandial", "diabete type 2", heure, operation);
        }
        else if(user.maladies.indexOf("Diabete gestationnel") != -1) {
            aJeun ? sendAlert(userId, tauxGlucose, "Taux de glucose", "a jeun", "diabete gestationnel", heure, operation)
                    : sendAlert(userId, tauxGlucose, "Taux de glucose", "post prandial", "diabete gestationnel", heure, operation);
        }
        else {
            aJeun ? sendAlert(userId, tauxGlucose, "Taux de glucose", "a jeun", "", heure, operation)
                    : sendAlert(userId, tauxGlucose, "Taux de glucose", "post prandial", "diabete type 2", heure, operation);
        }
    });
    
}



module.exports = sendAlerts;