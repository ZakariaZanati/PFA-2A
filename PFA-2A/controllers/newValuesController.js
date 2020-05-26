module.exports = (app , mongoose) => {

    const Prelevements = require('../models/valuesModel');
    const User = require('../models/userModel');
    const Seuils = require('../models/seuilsModel');
    const Alert = require('../models/alertModel');
    const Statistics = require('../models/statisticsModel');
    const {moyenneSemaine,moyenneMoi} = require('../moyennes');
    var url = require('url');
    const bodyParser = require('body-parser');
    var urlencodedParser = bodyParser.urlencoded({
        extended: false
    })

    function getFormatDate(){
        var dateArray = Date().split(' ');
        var _month = new Date().getMonth() + 1;
        var month = _month < 10 ? '0' + _month : _month;
        var date = dateArray[3] + '-' + month + '-' + dateArray[2];
        var time = dateArray[4];  
        var day = new Date().getDay();
        return [date, time,day];
    }

    app.get('/newvalues', (req, res) => {
        if(req.session.type === 'normal') {
            res.render('newvalues');
        }
        else if(req.session.type === 'medecin') {
            res.redirect(url.format({
                pathname:"/home",
                query: {
                    "user": req.session.type
                }
            }));
        }
        else {
            res.redirect('/')
        }
        
    })

    
    app.post('/patientHome', urlencodedParser, (req, res) => {
        var userId = req.session.userId;
        var currentDate = getFormatDate();
        var _date = currentDate[0];
        var _time = currentDate[1];
        var _day = currentDate[2];
        Prelevements.findOne({utilisateur: userId, date: _date}, (err, values) => {
            if(values) {
                
                var length = values.temperature.length;
                if(length == 4) {
                    console.log("You cannot add more, Max = 4 is reached ")
                }   
                else {
                    
                    values.temperature.push({
                        $each: [{temps: _time, valeur: req.body.temperature}],
                        $position: 0});
                    values.tensionSystolique.push({
                        $each: [{temps: _time, valeur: req.body.tensionSystolique}],
                        $position: 0}); 
                    values.tensionDiastolique.push({
                        $each: [{temps: _time, valeur: req.body.tensionDiastolique}],
                        $position: 0});  
                    values.tauxOxygen.push({
                        $each: [{temps: _time, valeur: req.body.tauxOxygene}],
                        $position: 0});
                    values.tauxGlucose.push({
                        $each: [{temps: _time, valeur: req.body.tauxGlucose}],
                        $position: 0});  
                        values.save();
                    
                    Statistics.findOne({utilisateur : userId} ,{ "MoyennesJours" : {$elemMatch : {"jour" : _date}}})
                    .then(result =>{
                        
                        for (i = 0; i < result.MoyennesJours[0].moyennesJour.length; i++) {
                            var newMoyenne = result.MoyennesJours[0].moyennesJour[0] * length;
                            //values.moyennesJour.remove(values.moyennesJour[0]);
                            result.MoyennesJours[0].moyennesJour.shift();
                            switch(i) {
                                case 0:
                                    newMoyenne += parseFloat(req.body.temperature);
                                    break;
                                case 1:
                                    newMoyenne += parseFloat(req.body.tensionSystolique);
                                    break;
                                case 2:
                                    newMoyenne += parseFloat(req.body.tensionDiastolique);
                                    break;    
                                case 3:
                                    newMoyenne += parseFloat(req.body.tauxOxygene);
                                    break;
                                case 4:
                                    newMoyenne += parseFloat(req.body.tauxGlucose);
                                    break;
                            }
                            newMoyenne = newMoyenne / (length + 1);
                            result.MoyennesJours[0].moyennesJour.push(newMoyenne);
                            
                        }
                        result.save();
                        console.log(values.temperature.length);
                        
                        if(values.temperature.length === 4){
                            moyenneSemaine(userId,_day,_date,result.MoyennesJours[0].moyennesJour);
                            moyenneMoi(userId,result.MoyennesJours[0].moyennesJour);
                        }
                    })

                    
                    
                    
                    sendAlerts(userId, req.body.temperature, req.body.tauxOxygene, [req.body.tensionSystolique, req.body.tensionDiastolique], req.body.tauxGlucose, aJeun)
                
                } 
            }
            else {
                moyennesjour = [req.body.temperature, req.body.tensionSystolique, req.body.tensionDiastolique, req.body.tauxOxygene, req.body.tauxGlucose]
                console.log(req.body.tensionSystolique + " " + req.body.tensionDiastolique);
                var _values = new Prelevements({
                    utilisateur: userId,
                    date: _date,
                    temperature: [{temps: _time, valeur: req.body.temperature}],
                    tensionSystolique: [{temps: _time, valeur: req.body.tensionSystolique}],
                    tensionDiastolique: [{temps: _time, valeur: req.body.tensionDiastolique}],
                    tauxOxygen: [{temps: _time, valeur: req.body.tauxOxygene}],
                    tauxGlucose: [{temps: _time, valeur: req.body.tauxGlucose}],
                });
                Prelevements.create(_values);
                var aJeun = req.body.typeTest === 'aJeun';
                sendAlerts(userId, req.body.temperature, req.body.tauxOxygene, [req.body.tensionSystolique, req.body.tensionDiastolique], req.body.tauxGlucose, aJeun)

                console.log("Values created");

                Statistics.findOne({utilisateur : userId})
                .then(result=>{
                    
                    console.log(result);
                    _moyenne = {jour : _date, moyennesJour : moyennesjour};
                    result.MoyennesJours.push(_moyenne);
                    result.save();
                });

                console.log('moyenne ajouté');
            }
        });
        res.redirect('patientHome');
    }); 


    function sendAlert(userId, valeur, nom, type, sousType) {
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
            if(valeur < seuilMin) {
                valSeuil = seuilMin;
                comparaison = " est inferieure au seuil min ";
            }
            if(valeur > seuilMax) {
                valSeuil = seuilMax;
                comparaison = " est superieure au seuil max ";
            }
            var alert = new Alert({
                utilisateur: userId,
                date: _date, 
                temps: _time, 
                mesure: nomMesure,
                text: nomMesure + " : " + valeur + " " + unite + comparaison + valSeuil + " " + unite,
                difference: valeur - valSeuil         
            });
            Alert.create(alert);
            /*User.findById(userId)
            .then( async (user) => {
                var valSeuil;
                var comparaison;
                if(valeur < seuilMin) {
                    valSeuil = seuilMin;
                    comparaison = " est inferieure au seuil min ";
                }
                if(valeur > seuilMax) {
                    valSeuil = seuilMax;
                    comparaison = " est superieure au seuil max ";
                }
                await user.alerts.push({
                    $each: [{date: _date, temps: _time, mesure: nomMesure,
                        text: nomMesure + " : " + valeur + " " + unite + comparaison + valSeuil + " " + unite,
                        difference: valeur - valSeuil}],
                    $position: 0});

                user.save();
            });*/
        })
    }

    function sendAlerts(userId, temperature, tauxOxygen, tensionArray, tauxGlucose, aJeun) {
        sendAlert(userId, temperature, "Temperature", "", "");
        sendAlert(userId, tauxOxygen, "Taux d'oxygène", "", "");
        sendAlert(userId, tensionArray[0], "Tension", "systolique", "");
        sendAlert(userId, tensionArray[1], "Tension", "diastolique", "");
        User.findById(userId)
        .then((user) => {
            if(user.maladies.indexOf("Diabete type 1") != -1) {
                aJeun ? sendAlert(userId, tauxGlucose, "Taux de glucose", "a jeun", "")
                        : sendAlert(userId, tauxGlucose, "Taux de glucose", "post prandial", "diabete type 1");
            }
            else if(user.maladies.indexOf("Diabete type 2") != -1) {
                aJeun ? sendAlert(userId, tauxGlucose, "Taux de glucose", "a jeun", "")
                        : sendAlert(userId, tauxGlucose, "Taux de glucose", "post prandial", "diabete type 2");
            }
            else if(user.maladies.indexOf("Diabete gestationnel") != -1) {
                aJeun ? sendAlert(userId, tauxGlucose, "Taux de glucose", "a jeun", "diabete gestationnel")
                        : sendAlert(userId, tauxGlucose, "Taux de glucose", "post prandial", "diabete gestationnel");
            }
            else {
                aJeun ? sendAlert(userId, tauxGlucose, "Taux de glucose", "a jeun", "")
                        : sendAlert(userId, tauxGlucose, "Taux de glucose", "post prandial", "diabete type 2");
            }
        });
        
    }

}