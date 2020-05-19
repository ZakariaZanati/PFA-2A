module.exports = function (app , mongoose) {
    const Prelevements = require('../models/valuesModel');
    const User = require('../models/userModel');
    const Medecin = require('../models/medecinModel');
    const Alert = require('../models/alertModel');
    var url = require('url');

    app.get('/patientValues', (req,res)=>{
        if (req.session.type === 'normal') {
            if(req.query.id != req.session.userId && req.query.id != null) {
                res.redirect('patientHome')
            }
            else {
                Prelevements.find({utilisateur: req.session.userId}).sort([['date', -1]])
                .then((prelevements)=>{
                    res.render('patientValues',{prelevements : prelevements, userType: req.session.type});
                });
            }
            
        }
        else if(req.session.type === 'medecin') {
            console.log("A doctor is logged!!!" + req.session.type);
            patientId = req.query.id;
            User.findById(patientId)
            .then((user) => {
                var estPatient = user.medecins.find(medecin => medecin.medecin = req.session.userId && medecin.finContrat == null);
                if(estPatient) {
                    Prelevements.find({utilisateur: patientId}).sort([['date', -1]])
                    .then((prelevements)=>{
                        res.render('patientValues',{prelevements : prelevements, userType: req.session.type});
                    });
                }
                else {
                    res.redirect('medecinHome');
                }
            })
    
        }
        else {
            console.log("Not logged");
            res.redirect('/login');
        }
        
    });

    app.get('/userAlerts', (req, res) => {
        if(req.session.type === 'normal') {
            Alert.find({utilisateur: req.session.userId})
            .then((alerts) => {
                res.render('userAlerts', {alerts: alerts});
            })
        }
        else if(req.session.type === 'medecin') {
            patientId = req.query.id;
            User.findById(patientId)
            .then((user) => {
                var estPatient = user.medecins.find(medecin => medecin.medecin = req.session.userId && medecin.finContrat == null);
                if(estPatient) {
                    Alert.find({utilisateur: patientId})
                    .then((alerts)=>{
                        res.render('userAlerts', {alerts: alerts});
                    });
                }
                else {
                    res.redirect('medecinHome');
                }
            })
        }
        else {
            res.redirect('/');
        }
    });

    app.get('/dayValues', (req, res) => {
        if(req.session.type === 'normal'){
            res.redirect('patientHome');
        }
        else if(req.session.type === 'medecin') {
            var date = new Date(new Date().toISOString().split('T')[0]);
            var users = [];
            Medecin.findById(req.session.userId)
            .then(medecin => {
                medecin.utilisateurs.forEach(user => {
                    if(user.finContrat == null) users.push(user.utilisateur);
                })
                Prelevements.find({utilisateur: {"$in" : users}, date: date})
                .populate('utilisateur')
                .then(values => {
                    var _values = [];
                    values.forEach(value => {
                        _values.push({
                            utilisateur: value.utilisateur,
                            date: value.date.toISOString().split('T')[0],
                            temperature: value.temperature,
                            tensionSystolique: value.tensionSystolique,
                            tensionDiastolique: value.tensionDiastolique,
                            tauxOxygen: value.tauxOxygen,
                            tauxGlucose: value.tauxGlucose
                        })
                    });
                    res.render('dayValues', {values: _values});
                })
                
            });
        }
        else {
            res.redirect('/');
        }
    });

    app.get('/medecinHome', (req, res) => {
        if(req.session.type === 'normal'){
            res.redirect('patientHome');
        }
        else if(req.session.type != 'medecin'){
            res.redirect('/');
        }
        else {
            var date = new Date(new Date().toISOString().split('T')[0]);
            var users = [];
            Medecin.findById(req.session.userId)
            .then(medecin => {
                medecin.utilisateurs.forEach(user => {
                    if(user.finContrat == null) users.push(user.utilisateur);
                })
                Alert.find({utilisateur: {"$in" : users}, date: date})
                .populate('utilisateur')
                .then(alerts => {
                    var _alerts = [];
                    alerts.forEach(alert => {
                        _alerts.push({
                            utilisateur: alert.utilisateur,
                            date: alert.date.toISOString().split('T')[0],
                            temps: alert.temps,
                            mesure: alert.mesure,
                            text: alert.text,
                            difference: alert.difference
                        })
                    });
                    res.render('medecinHome', {alerts: _alerts});
                })
                
            });
        }
    })

    app.get('/patientHome', (req, res) => {
        if(req.session.type === 'medecin'){
            res.redirect('medecinHome');
        }
        else if(req.session.type != 'normal'){
            res.redirect('/');
        }
        else {
            Alert.find({utilisateur: req.session.userId})
            .then((alerts) => {
                var _alerts = [];
                alerts.forEach(alert => {
                    _alerts.push({
                        utilisateur: alert.utilisateur,
                        date: alert.date.toISOString().split('T')[0],
                        temps: alert.temps,
                        mesure: alert.mesure,
                        text: alert.text,
                        difference: alert.difference
                    })
                });
                res.render('patientHome', {alerts: _alerts});
            })
            //res.render('patientHome')
        }
    })

}