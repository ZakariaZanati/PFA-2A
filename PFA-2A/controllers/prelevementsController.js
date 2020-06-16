module.exports = function (app, mongoose) {
    const Statistics = require('../models/statisticsModel')
    const Prelevements = require('../models/valuesModel');
    const User = require('../models/userModel');
    const Medecin = require('../models/medecinModel');
    const Alert = require('../models/alertModel');
    var url = require('url');
    const sendAlerts = require('../alerts');
    var authenticateToken = require('../authenticateToken');
    const bodyParser = require('body-parser');
    var urlencodedParser = bodyParser.urlencoded({
        extended: false
    })

    app.get('/patientValues', authenticateToken, async (req, res) => {
        if (req.userInfos.type === 'normal') {
            if (req.query.id != req.userInfos.userId && req.query.id != null) {
                res.redirect('patientHome')
            }
            else if (req.query.id == req.userInfos.userId && req.query.id != null) {
                res.redirect('patientValues')
            }
            else {
                var date = new Date(new Date().toISOString().split('T')[0]);
                await Prelevements.find({ utilisateur: req.userInfos.userId }).sort([['date', -1]])
                    .then((prelevements) => {
                        User.findById(req.userInfos.userId)
                            .populate('demandes')
                            .then(user => {
                                //Alert.find({utilisateur : req.userInfos.userId, statutPatient : 0})
                                Alert.find({ utilisateur: req.userInfos.userId, date: date })
                                    .then(alerts => {
                                        res.render('patientValues', { estPatient: true, alerts: alerts, demandes: user.demandes, prelevements: prelevements, utilisateur: user, patient: true });
                                    });
                            })
                    });
            }

        }
        else if (req.userInfos.type === 'medecin') {
            console.log("A doctor is logged!!!" + req.userInfos.type);
            var date = new Date(new Date().toISOString().split('T')[0]);
            var users = [];
            Medecin.findById(req.userInfos.userId)
                .populate('demandes')
                .then(medecin => {
                    medecin.utilisateurs.forEach(user => {
                        if (user.finSuivi == null) users.push(user.utilisateur);
                    })
                    //Alert.find({utilisateur: {"$in" : users}, date: date, statutMedecin: {"$ne" : req.userInfos.userId}})
                    Alert.find({ utilisateur: { "$in": users }, date: date, statutMedecin: { "$ne": req.userInfos.userId } })
                        .populate('utilisateur')
                        .then(alerts => {
                            patientId = req.query.id;
                            if (patientId == null) res.redirect('medecinHome');
                            else {
                                User.findById(patientId)
                                    .then((user) => {
                                        var estPatient = user.medecins.find(medecin => medecin.medecin = req.userInfos.userId && medecin.finSuivi == null);
                                        if (estPatient) {
                                            Prelevements.find({ utilisateur: patientId }).sort([['date', -1]])
                                                .then((prelevements) => {
                                                    res.render('patientValues', { estPatient: false, medecin: medecin, alerts: alerts, prelevements: prelevements, utilisateur: user, patient: false });
                                                });
                                        }
                                        else {
                                            res.redirect('medecinHome');
                                        }
                                    })
                            }

                        })

                });
        }
        else {
            console.log("Not logged");
            res.redirect('/login');
        }

    });

    app.post('/patientValues', authenticateToken, urlencodedParser, async (req, res) => {
        var heure = req.query.heure;
        var data = req.body;
        var userId = req.userInfos.userId;
        var date = new Date(new Date().toISOString().split('T')[0]);
        await Prelevements.findOneAndUpdate({ utilisateur: req.userInfos.userId, date: date },
            {
                $set: {
                    "temperature.$[temp].valeur": data.temperature,
                    "tensionSystolique.$[temp].valeur": data.tensionSystolique,
                    "tensionDiastolique.$[temp].valeur": data.tensionDiastolique,
                    "tauxOxygen.$[temp].valeur": data.tauxOxygen,
                    "tauxGlucose.$[temp].valeur": data.tauxGlucose
                }
            },
            { arrayFilters: [{ "temp.temps": heure }] })
            .then((doc) => {
                var aJeun = req.body.typeTest === 'aJeun';
                sendAlerts(userId, data.temperature, data.tauxOxygen, [data.tensionSystolique, data.tensionDiastolique], data.tauxGlucose, aJeun, heure, "update")
            });
        res.redirect('/patientValues')
    });

    app.get('/userAlerts', authenticateToken, (req, res) => {
        if (req.userInfos.type === 'normal') {
            if (req.query.id != req.userInfos.userId && req.query.id != null) {
                res.redirect('patientHome')
            }
            else if (req.query.id == req.userInfos.userId && req.query.id != null) {
                res.redirect('userAlerts')
            }
            else {
                Alert.find({ utilisateur: req.userInfos.userId })
                    .sort({ date: -1, temps: -1 })
                    .then((alerts) => {
                        User.findById(req.userInfos.userId)
                            .populate('demandes')
                            .then(user => {
                                alerts.forEach(alert => {
                                    if (alert.alertedPatient == 0) {
                                        alert.alertedPatient = 1;
                                        alert.save();
                                    }
                                });
                                res.render('userAlerts', { userAlerts: alerts, utilisateur: user, estPatient: true, demandes: user.demandes });
                            })
                    })
            }

        }
        else if (req.userInfos.type === 'medecin') {
            var date = new Date(new Date().toISOString().split('T')[0]);
            var users = [];
            Medecin.findById(req.userInfos.userId)
                .populate('demandes')
                .then(medecin => {
                    medecin.utilisateurs.forEach(user => {
                        if (user.finSuivi == null) users.push(user.utilisateur);
                    })
                    //Alert.find({utilisateur: {"$in" : users}, date: date, statutMedecin: {"$ne" : req.userInfos.userId}})
                    Alert.find({ utilisateur: { "$in": users }, date: date })
                        .populate('utilisateur')
                        .then(alerts => {

                            patientId = req.query.id;
                            if (patientId == null) res.redirect('medecinHome');
                            else {
                                User.findById(patientId)
                                    .then((user) => {
                                        var estPatient = user.medecins.find(medecin => medecin.medecin = req.userInfos.userId && medecin.finSuivi == null);
                                        if (estPatient) {
                                            Alert.find({ utilisateur: patientId })
                                                .sort({ date: -1, temps: -1 })
                                                .then((userAlerts) => {
                                                    res.render('userAlerts', { medecin, alerts: alerts, utilisateur: user, userAlerts: userAlerts, estPatient: false });
                                                });
                                        }
                                        else {
                                            res.redirect('medecinHome');
                                        }
                                    })
                            }

                        })

                });
        }
        else {
            res.redirect('/');
        }
    });

    app.get('/dayValues', authenticateToken, (req, res) => {
        if (req.userInfos.type === 'normal') {
            res.redirect('patientHome');
        }
        else if (req.userInfos.type === 'medecin') {
            var date = new Date(new Date().toISOString().split('T')[0]);
            var users = [];
            Medecin.findById(req.userInfos.userId)
                .populate('demandes')
                .then(medecin => {
                    medecin.utilisateurs.forEach(user => {
                        if (user.finSuivi == null) users.push(user.utilisateur);
                    })
                    Prelevements.find({ utilisateur: { "$in": users }, date: date })
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
                            Alert.find({ utilisateur: { "$in": users }, date: date })
                                .then(alerts => {
                                    res.render('dayValues', { alerts: alerts, medecin: medecin, values: _values });
                                })

                        })

                });
        }
        else {
            res.redirect('/');
        }
    });

    app.get('/medecinHome', authenticateToken, (req, res) => {
        if (req.userInfos.type === 'normal') {
            res.redirect('patientHome');
        }
        else if (req.userInfos.type != 'medecin') {
            res.redirect('/');
        }
        else {
            var date = new Date(new Date().toISOString().split('T')[0]);
            var users = [];
            Medecin.findById(req.userInfos.userId)
                .populate('demandes')
                .then(medecin => {
                    medecin.utilisateurs.forEach(user => {
                        if (user.finSuivi == null) users.push(user.utilisateur);
                    })
                    Alert.find({ utilisateur: { "$in": users }, date: date })
                        .populate('utilisateur')
                        .then(alerts => {
                            alerts.forEach(alert => {
                                if (!alert.alertedMedecin.some(element => element == req.userInfos.userId)) {
                                    alert.alertedMedecin.push(req.userInfos.userId)
                                    alert.save();
                                }
                            });
                            res.render('medecinHome', { medecin: medecin, alerts: alerts });
                        })

                });
        }
    })

    app.get('/patientHome', authenticateToken, async (req, res) => {
        if (req.userInfos.type === 'medecin') {
            res.redirect('medecinHome');
        }
        else if (req.userInfos.type != 'normal') {
            res.redirect('/');
        }
        else {
            await Alert.find({ utilisateur: req.userInfos.userId })
                .sort({ date: -1, temps: -1 })
                .then((alerts) => {
                    User.findById(req.userInfos.userId)
                        .populate('demandes')
                        .then(user => {
                            var _date = new Date(new Date().toISOString().split('T')[0]);
                            Prelevements.find({ utilisateur: req.userInfos.userId })
                                .then(prelevements => {
                                    var length = 0;

                                    if (prelevements) {
                                        var todayValues = prelevements.find(prelevement => prelevement.date + "" == _date)
                                        if (todayValues) length = todayValues.temperature.length;
                                    }
                                    res.render('patientHome', { prelevements: prelevements, demandes: user.demandes, alerts: alerts, length: length });

                                });

                        })
                })
            //res.render('patientHome')
        }
    })

    app.get('/statistics', authenticateToken, async (req, res) => {
        if (req.userInfos.type == 'normal') {
            if (req.query.id != req.userInfos.userId && req.query.id != null) {
                res.redirect('patientHome')
            }
            else if (req.query.id == req.userInfos.userId && req.query.id != null) {
                res.redirect('statistics')
            }
            else {
                Alert.find({ utilisateur: req.userInfos.userId })
                    .then((alerts) => {
                        User.findById(req.userInfos.userId)
                            .populate('demandes')
                            .then(user => {
                                alerts.forEach(alert => {
                                    if (alert.alertedPatient == 0) {
                                        alert.alertedPatient = 1;
                                        alert.save();
                                    }
                                });
                                Prelevements.find({ utilisateur: req.userInfos.userId }).sort([['date', -1]])
                                    .then(prelevements => {
                                        Statistics.find({ utilisateur: req.userInfos.userId })
                                            .then(statistics => {
                                                res.render('statistics', { prelevements: prelevements, alerts: alerts, utilisateur: user, estPatient: true, demandes: user.demandes, statistics: statistics });
                                            })
                                    })
                            })
                    })
            }

        }
        else if (req.userInfos.type == 'medecin') {
            var date = new Date(new Date().toISOString().split('T')[0]);
            var users = [];
            Medecin.findById(req.userInfos.userId)
                .populate('demandes')
                .then(medecin => {
                    medecin.utilisateurs.forEach(user => {
                        if (user.finSuivi == null) users.push(user.utilisateur);
                    })
                    //Alert.find({utilisateur: {"$in" : users}, date: date, statutMedecin: {"$ne" : req.userInfos.userId}})
                    Alert.find({ utilisateur: { "$in": users }, date: date })
                        .populate('utilisateur')
                        .then(alerts => {
                            patientId = req.query.id;
                            if (patientId == null) res.redirect('medecinHome');
                            else {
                                User.findById(patientId)
                                    .then((user) => {
                                        var estPatient = user.medecins.find(medecin => medecin.medecin = req.userInfos.userId && medecin.finSuivi == null);
                                        if (estPatient) {
                                            Prelevements.find({ utilisateur: patientId })
                                                .then((prelevements) => {
                                                    Statistics.find({ utilisateur: patientId })
                                                        .then(statistics => {
                                                            res.render('statistics', { medecin, alerts: alerts, utilisateur: user, prelevements: prelevements, estPatient: false, statistics: statistics });
                                                        })
                                                });
                                        }
                                        else {
                                            res.redirect('medecinHome');
                                        }
                                    })
                            }

                        })

                });
        }
        else {
            res.redirect('/')
        }
    });

}