module.exports = function (app , mongoose) {
    const Prelevements = require('../models/valuesModel');
    const User = require('../models/userModel');
    const Medecin = require('../models/medecinModel');
    const Alert = require('../models/alertModel');
    var url = require('url');
    var authenticateToken = require('../authenticateToken');

    app.get('/patientValues',authenticateToken, (req,res)=>{
        if (req.userInfos.type === 'normal') {
            if(req.query.id != req.userInfos.userId && req.query.id != null) {
                res.redirect('patientHome')
            }
            else {
                Prelevements.find({utilisateur: req.userInfos.userId}).sort([['date', -1]])
                .then((prelevements)=>{
                    User.findById(req.userInfos.userId)
                    .then(user => {
                        res.render('patientValues',{prelevements : prelevements, utilisateur: user});
                    })
                });
            }
            
        }
        else if(req.userInfos.type === 'medecin') {
            console.log("A doctor is logged!!!" + req.userInfos.type);
            patientId = req.query.id;
            User.findById(patientId)
            .then((user) => {
                var estPatient = user.medecins.find(medecin => medecin.medecin = req.userInfos.userId && medecin.finContrat == null);
                if(estPatient) {
                    Prelevements.find({utilisateur: patientId}).sort([['date', -1]])
                    .then((prelevements)=>{
                        User.findById(patientId)
                        .then(user => {
                            res.render('patientValues',{prelevements : prelevements, utilisateur: user});
                        })
                        
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

    app.get('/userAlerts',authenticateToken, (req, res) => {
        if(req.userInfos.type === 'normal') {
            Alert.find({utilisateur: req.userInfos.userId})
            .then((alerts) => {
                User.findById(req.userInfos.userId)
                .then(user => {
                    res.render('userAlerts', {alerts: alerts, utilisateur: user});
                })
            })
        }
        else if(req.userInfos.type === 'medecin') {
            patientId = req.query.id;
            User.findById(patientId)
            .then((user) => {
                var estPatient = user.medecins.find(medecin => medecin.medecin = req.userInfos.userId && medecin.finContrat == null);
                if(estPatient) {
                    Alert.find({utilisateur: patientId})
                    .then((alerts)=>{
                        User.findById(patientId)
                        .then(user => {
                            res.render('userAlerts', {alerts: alerts, utilisateur: user});
                        })
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

    app.get('/dayValues',authenticateToken, (req, res) => {
        if(req.userInfos.type === 'normal'){
            res.redirect('patientHome');
        }
        else if(req.userInfos.type === 'medecin') {
            var date = new Date(new Date().toISOString().split('T')[0]);
            var users = [];
            Medecin.findById(req.userInfos.userId)
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

    app.get('/medecinHome',authenticateToken, (req, res) => {
        if(req.userInfos.type === 'normal'){
            res.redirect('patientHome');
        }
        else if(req.userInfos.type != 'medecin'){
            res.redirect('/');
        }
        else {
            var date = new Date(new Date().toISOString().split('T')[0]);
            var users = [];
            Medecin.findById(req.userInfos.userId)
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

    app.get('/patientHome',authenticateToken, (req, res) => {
        if(req.userInfos.type === 'medecin'){
            res.redirect('medecinHome');
        }
        else if(req.userInfos.type != 'normal'){
            res.redirect('/');
        }
        else {
            Alert.find({utilisateur: req.userInfos.userId})
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