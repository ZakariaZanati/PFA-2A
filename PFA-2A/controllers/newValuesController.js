module.exports = (app , mongoose) => {

    const Prelevements = require('../models/valuesModel');
    const Statistics = require('../models/statisticsModel');
    const {moyenneSemaine,moyenneMoi} = require('../moyennes');
    const sendAlerts = require('../alerts');
    var url = require('url');
    var authenticateToken = require('../authenticateToken');
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

    app.get('/newvalues', authenticateToken, (req, res) => {
        if(req.userInfos.type === 'normal') {
            res.render('newvalues');
        }
        else if(req.userInfos.type === 'medecin') {
            res.redirect(url.format({
                pathname:"/home",
                query: {
                    "user": req.userInfos.type
                }
            }));
        }
        else {
            res.redirect('/')
        }
        
    })

    
    app.post('/patientHome', authenticateToken, urlencodedParser, (req, res) => {
        var userId = req.userInfos.userId;
        var currentDate = getFormatDate();
        var _date = currentDate[0];
        var _time = currentDate[1];
        var _day = currentDate[2];
        var action = req.query.action;
        Prelevements.findOne({utilisateur: userId, date: _date}, async(err, values) => {
            if(values) {
                
                var length = values.temperature.length;
                if(length == 4) {
                    console.log("You cannot add more, Max = 4 is reached ");
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
                        console.log(length);
                    if (length +1 == 4) {
                        await Statistics.findOne({utilisateur : userId})
                        .then(result=>{
                            
                            console.log(result);

                            moyenneTemp = 0;
                            moyenneTensionSys = 0;
                            moyenneTensionDyas = 0;
                            moyenneTauxOx = 0;
                            moyenneTauxGluc = 0;

                            values.temperature.forEach((temperature)=>{
                                moyenneTemp += temperature.valeur;
                            });
                            values.tensionSystolique.forEach((tensionSystolique)=>{
                                moyenneTensionSys += tensionSystolique.valeur;
                            });
                            values.tensionDiastolique.forEach((tensionDiastolique)=>{
                                moyenneTensionDyas += tensionDiastolique.valeur;
                            });
                            values.tauxOxygen.forEach((tauxOxygen)=>{
                                moyenneTauxOx += tauxOxygen.valeur;
                            });
                            values.tauxGlucose.forEach((tauxGlucose)=>{
                                moyenneTauxGluc += tauxGlucose.valeur;
                            });
                            moyennesJour = [moyenneTemp/4,moyenneTensionSys/4,moyenneTensionDyas/4,moyenneTauxOx/4,moyenneTauxGluc/4];
                            console.log(moyenneTemp)
                            _moyenne = {jour : _date, moyennesJour : moyennesJour};
                            result.MoyennesJours.push(_moyenne);
                            result.save();
                            console.log(result);

                            moyenneSemaine(userId,_day,_date,result.MoyennesJours[0].moyennesJour);
                            moyenneMoi(userId,result.MoyennesJours[0].moyennesJour);
                            
                        });
                        
                        
        
                        console.log('moyenne ajouté');
                    }
                    
                    var aJeun = req.body.typeTest === 'aJeun';
                    sendAlerts(userId, req.body.temperature, req.body.tauxOxygene, [req.body.tensionSystolique, req.body.tensionDiastolique], req.body.tauxGlucose, aJeun, "", "create");
                

                } 
            }
            else {
                
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
                sendAlerts(userId, req.body.temperature, req.body.tauxOxygene, [req.body.tensionSystolique, req.body.tensionDiastolique], req.body.tauxGlucose, aJeun, "", "create")

                console.log("Values created");
                
            }
        });
        res.redirect('/patientHome');
    }); 

}