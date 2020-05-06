module.exports = (app , mongoose) => {

    const Prelevements = require('../models/valuesModel');
    var url = require('url');
    const bodyParser = require('body-parser');
    var urlencodedParser = bodyParser.urlencoded({
        extended: false
    })

    function getFormatDate(){
        var dateArray = Date().split(' ');
        var _month = new Date().getMonth() + 1;
        var month = _month < 10 ? '0' + _month : _month;
        var date = dateArray[3] + '-' + _month + '-' + dateArray[2];
        var time = dateArray[4];  
        return [date, time];
    }

    app.get('/newvalues', (req, res) => {
        console.log("new values from new values controller");
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

    
    app.post('/newvalues', urlencodedParser, (req, res) => {
        var userId = req.session.userId;
        var currentDate = getFormatDate();
        var _date = currentDate[0];
        var _time = currentDate[1];
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
        
                    for (i = 0; i < values.moyennesJour.length; i++) {
                        var newMoyenne = values.moyennesJour[0] * length;
                        //values.moyennesJour.remove(values.moyennesJour[0]);
                        values.moyennesJour.shift();
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
                        values.moyennesJour.push(newMoyenne);
                    }
                    values.save();
                } 
            }
            else {
                console.log(req.body.tensionSystolique + " " + req.body.tensionDiastolique);
                var _values = new Prelevements({
                    utilisateur: userId,
                    date: _date,
                    temperature: [{temps: _time, valeur: req.body.temperature}],
                    tensionSystolique: [{temps: _time, valeur: req.body.tensionSystolique}],
                    tensionDiastolique: [{temps: _time, valeur: req.body.tensionDiastolique}],
                    tauxOxygen: [{temps: _time, valeur: req.body.tauxOxygene}],
                    tauxGlucose: [{temps: _time, valeur: req.body.tauxGlucose}],
                    moyennesJour: [req.body.temperature, req.body.tensionSystolique, req.body.tensionDiastolique, req.body.tauxOxygene, req.body.tauxGlucose]
                });

                Prelevements.create(_values);
                console.log("Values created");
            }
        });
        console.log("Post function");
        res.redirect('newvalues');
    }); 

}