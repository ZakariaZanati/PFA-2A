module.exports = function (app , mongoose) {

    var Seuils = require('../models/seuilsModel');
    var url = require('url');
    var bodyParser = require('body-parser');
    var urlencodedParser = bodyParser.urlencoded({
        extended: false
    });


    function createSeuil(nom, type, sousType, valMin, valMax, unite, abreviation) {
        var seuil = new Seuils({
            nom: nom,
            type: type,
            sousType: sousType,
            valMin: valMin,
            valMax: valMax,
            unite: unite,
            abreviation: abreviation
        });
    
        Seuils.create(seuil);
    }

    var uniteGlucose = "Gramme de glucose par litre de sang";
    
    Seuils.findOne({})
    .then((result) => {
        if(result) {
            
        }
        else {
            createSeuil("Temperature", "", "", 36.5, 37.5, "Celsius", "°C");
            createSeuil("Taux d'oxygène", "", "", 95, 100, "% Sturation", "%");
            createSeuil("Tension", "systolique", "", 110, 140, "Millimètre de mercure", "mmHg");
            createSeuil("Tension", "diastolique", "", 70, 90, "Millimètre de mercure", "mmHg");
            createSeuil("Taux de glucose", "a jeun", "", 0.7, 1.1, uniteGlucose, "g/L");
            createSeuil("Taux de glucose", "a jeun", "diabete gestationnel", 0.7, 0.95, uniteGlucose, "g/L");
            createSeuil("Taux de glucose", "post prandial", "diabete type 1", 0.7, 1.6, uniteGlucose, "g/L");
            createSeuil("Taux de glucose", "post prandial", "diabete type 2", 0.7, 1.8, uniteGlucose, "g/L");
            createSeuil("Taux de glucose", "post prandial", "diabete gestationnel", 0.7, 1.2, uniteGlucose, "g/L");        
        }
    })
    
    app.get('/seuils', urlencodedParser, (req, res) => {
        var param = req.query.id;
        if(req.session.type === 'normal' || req.session.type === 'medecin') {
            Seuils.find({}).sort('nom')
            .then((seuils) => {
                if(seuils != null) {
                    if(req.session.type === 'normal' && param == null) {
                        res.render('seuils', {seuils: seuils, userType: req.session.type});
                    }
                    else if(req.session.type === 'normal' && param != null) {
                        res.redirect('/seuils')
                    }
                    else if(req.session.type === 'medecin' && param == null) {
                        res.redirect(url.format({
                            pathname:"/seuils",
                            query: {
                                "id": "medecin"
                            }
                        }));
                    }
                    else if(req.session.type === 'medecin' && param != null){
                        res.render('seuils', {seuils: seuils, userType: req.session.type});
                    }
                }    
            }) 
        }
        else {
            res.redirect('/');
            /*res.redirect(url.format({
                pathname:"/home",
                query: {
                    "user": req.session.type
                }
            }));*/
        }
    });

}    
