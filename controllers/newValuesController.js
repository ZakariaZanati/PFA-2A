module.exports = (app , mongoose) => {

    const Prelevements = require('../models/valuesModel');
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
        if(req.session.email) {
            res.render('newvalues');
        }
        else {
            res.redirect('/')
        }
        
    })

    app.post('/newvalues', urlencodedParser, (req, res) => {
        var docId = req.session.userId;
        var currentDate = getFormatDate();
        var _date = currentDate[0];
        var _time = currentDate[1];
        Prelevements.findOne({id: docId, date: _date}, (err, values) => {
            if(values) {
                var length = values.temperature.length;
                if(length == 4) {
                    console.log("You cannot add more, Max = 4 is reached ")
                }   
                else {
                    values.temperature.push({temps: _time, valeur: req.body.temperature});
                    values.tension.push({temps: _time, valeur: req.body.tension});
                    values.tauxOxygen.push({temps: _time, valeur: req.body.tauxOxygene});
                    values.tauxGlucose.push({temps: _time, valeur: req.body.tauxGlucose});
                    values.save();
                } 
            }
            else {
                var _values = new Prelevements({
                    id: docId,
                    date: _date,
                    temperature: [{temps: _time, valeur: req.body.temperature}],
                    tension: [{temps: _time, valeur: req.body.tension}],
                    tauxOxygen: [{temps: _time, valeur: req.body.tauxOxygene}],
                    tauxGlucose: [{temps: _time, valeur: req.body.tauxGlucose}]
                });

                Prelevements.create(_values);
                console.log("Values created");
            }
        });
        console.log("Post function");
        res.redirect('newvalues');
    }); 

}