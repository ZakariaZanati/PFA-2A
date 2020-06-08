module.exports = function (app , mongoose) {

    var Seuils = require('../models/seuilsModel');
    var Alert = require('../models/alertModel');
    var User = require('../models/userModel');
    var url = require('url');
    var bodyParser = require('body-parser');
    var authenticateToken = require('../authenticateToken');
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
    
    app.get('/seuils', authenticateToken, (req, res) => {
        if(req.userInfos.type === 'normal') {
            var date = new Date(new Date().toISOString().split('T')[0]);
            Seuils.find({}).sort('nom')
            .then((seuils) => {
                var names = [];
                seuils.forEach(seuil => {
                    if(names.indexOf(seuil.nom) == -1) {
                        names.push(seuil.nom)
                    }
                })
                
                if(seuils != null) {
                    User.findById(req.userInfos.userId)
                    .populate('demandes')
                    .then(user => {
                        //Alert.find({utilisateur: req.userInfos.userId, statutPatient: 0})
                        Alert.find({utilisateur: req.userInfos.userId, date: date})
                        .then(alerts => {
                            res.render('seuils', {demandes : user.demandes, alerts : alerts, names : names, seuils: seuils, userType: req.userInfos.type});
                        }) 
                    })
                    
                }
            }) 
        }
        else {
            res.redirect('/');
            /*res.redirect(url.format({
                pathname:"/home",
                query: {
                    "user": req.userInfos.type
                }
            }));*/
        }
    });

}    
