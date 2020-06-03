module.exports = function (app , mongoose) {

    var User = require('../models/userModel');
    var Medecin = require('../models/medecinModel');
    var url = require('url');
    var bodyParser = require('body-parser');
    var authenticateToken = require('../authenticateToken');
    var urlencodedParser = bodyParser.urlencoded({
        extended: false
    })

    function getFormatDate(){
        var dateArray = Date().split(' ');
        var _month = new Date().getMonth() + 1;
        var month = _month < 10 ? '0' + _month : _month;
        var date = dateArray[3] + '-' + month + '-' + dateArray[2];
        var time = dateArray[4];  
        return [date, time];
    }

    app.get('/medecins',authenticateToken,(req,res)=>{
        if (req.userInfos.type === 'normal') {
            Medecin.find({})
            .then((medecins)=>{
                res.render('medecins',{medecins : medecins});
            });
        }
        else if(req.userInfos.type === 'medecin') {
            res.redirect('medecinHome');
            /*res.redirect(url.format({
                pathname:"/home",
                query: {
                    "user": req.userInfos.type
                }
            }));*/
        }
        else {
            console.log('not logged')
            res.redirect('/login');
        }
    });

    app.get('/medecinProfile',authenticateToken,(req,res)=>{
        if (req.userInfos.type === 'normal') {
            id = req.query.id;
            Medecin.findById(id)
            .then((medecin)=>{
                User.findById(req.userInfos.userId)
                .then((user) => {
                    var isMedecin = user.medecins.find(_medecin => _medecin.medecin == id && _medecin.finContrat == null);
                    var haveMedecin = user.medecins.some((medecin)=>{
                        return medecin.finContrat == null;
                    });
                    var sentDemande = medecin.demandes.find(demande => demande == user.id);
                    if(haveMedecin) {
                        if(isMedecin) {
                            var debutContrat = isMedecin.debutContrat;
                            sentDemande ? 
                                res.render('medecinProfile',{medecin : medecin, estMedecin: true, sentDemande: true, debutContrat: debutContrat})
                                : res.render('medecinProfile',{medecin : medecin, estMedecin: true, sentDemande: false, debutContrat: debutContrat});
                        }
                        else {
                            res.render('medecinProfile',{medecin : medecin, estMedecin: false})
                        }
                        
                    }
                    else {
                        sentDemande ? res.render('medecinProfile',{medecin : medecin, estMedecin: null, sentDemande: true})
                                    : res.render('medecinProfile',{medecin : medecin, estMedecin: null, sentDemande: false});
                    }
                })
            })
        }
        else if(req.userInfos.type === 'medecin') {
            res.redirect('medecinHome');
            /*res.redirect(url.format({
                pathname:"/home",
                query: {
                    "user": req.userInfos.type
                }
            }));*/
        }
        else {
            console.log('not logged')
            res.redirect('/login');
        }
        
    });
    

    app.post('/medecinProfile',authenticateToken,urlencodedParser,(req,res,next)=>{
        id = req.query.id;
        action = req.query.action;
        console.log(id)
        console.log(action);
        if (req.userInfos.type === 'normal') {
            if(action === 'yes') {
                User.findById(req.userInfos.userId)
                .then((user)=>{
                    var haveMedecin = user.medecins.find(medecin => medecin.finContrat == null);
                    if (haveMedecin) {
                        var err = new Error("Vous disposez déjà d'un medecin ");
                        next(err);
                    }
                    else{
                        Medecin.findById(id)
                        .then((medecin)=>{
                            var isInArray = medecin.demandes.some((user)=>{
                                return user.equals(req.userInfos.userId);
                            })
                            if (!isInArray) {
                                medecin.demandes.push(req.userInfos.userId);
                                medecin.save();
                            }
    
                        })                    
                    }
                })
                .catch((err)=>next(err));
            }
            else if(action === 'end') {
                Medecin.findById(id)
                .then((medecin)=>{
                    var isInArray = medecin.demandes.some((user)=>{
                        return user.equals(req.userInfos.userId);
                    })
                    if (!isInArray) {
                        medecin.demandes.push(req.userInfos.userId);
                        medecin.save();
                    }

                }) 
            }
            else if(action === 'no') {
                Medecin.findById(id)
                .then((medecin)=>{
                    var isInArray = medecin.demandes.some((user)=>{
                        return user.equals(req.userInfos.userId);
                    })
                    if (isInArray) {
                        medecin.demandes.pull(req.userInfos.userId);
                        medecin.save();
                    }

                }) 
            }
        }
        res.redirect('medecins');
    })

    app.get('/demandes',authenticateToken, (req,res)=>{
        if (req.userInfos.type === 'medecin') {
            Medecin.findById(req.userInfos.userId)
            .populate('demandes')
            .then((medecin)=>{
                var allDemandes = [];
                medecin.demandes.forEach(demande => {
                    var estMedecin = medecin.utilisateurs.find(user => user.utilisateur == demande.id && user.finContrat == null);
                    estMedecin ?
                        allDemandes.unshift({user: demande, type: "Fin contrat"}) 
                            : allDemandes.unshift({user: demande, type: "Debut contrat"}) 
                    
                })
                console.log(allDemandes);
                res.render('demandes',{demandes : allDemandes});
            })
        }
        else if(req.userInfos.type === 'normal') {
            res.redirect('patientHome');
            /*res.redirect(url.format({
                pathname:"/home",
                query: {
                    "user": req.userInfos.type
                }
            }));*/
        }
        else {
            console.log('not logged');
            res.redirect('/login');
        }
    })

    

    app.get('/userProfile',authenticateToken,(req,res)=>{
        if (req.userInfos.type === 'medecin') {
            console.log("hELLO");
            id = req.query.id
            User.findById(id)
            .then((user)=>{
                Medecin.findById(req.userInfos.userId)
                .then((medecin) => {
                    var isInArray = medecin.utilisateurs.some((user)=>{
                        return user.utilisateur.equals(id) && user.finContrat == null;
                    })
                    var demande = medecin.demandes.find(demande => demande == id);
                    if(isInArray) {
                        demande ? res.render('userProfile',{user : user, estPatient: true, demandeFin: true})
                                   : res.render('userProfile',{user : user, estPatient: true, demandeFin: false});
                    }
                    else {
                        var old = medecin.utilisateurs.some((user)=>{
                            return user.utilisateur.equals(id) && user.finContrat != null;
                        })
                        if(old) {
                            demande ? res.render('userProfile',{user : user, estPatient: false, demandeDebut: true})
                                    : res.render('userProfile',{user : user, estPatient: false, demandeDebut: false});
                        }
                        else {
                            demande ? res.render('userProfile',{user : user, estPatient: false, demandeDebut: true})
                                    : res.redirect('/patients');
                        }
                    }
                });
            })
        }
        else {
            res.redirect('patientHome');
            /*res.redirect(url.format({
                pathname:"/home",
                query: {
                    "user": req.userInfos.type
                }
            }));*/
        }
    });

    app.post('/userProfile',authenticateToken,urlencodedParser,(req,res)=>{
        if (req.userInfos.type === 'medecin') {
            patientId = req.query.id;
            action = req.query.action
            console.log(action)
            if (action === 'yes') {
                Medecin.findById(req.userInfos.userId)
                .then((medecin)=>{
                    medecin.utilisateurs.push({utilisateur: patientId});
                    medecin.demandes.pull(patientId);
                    medecin.save();
                    User.findById(patientId)
                    .then((user)=>{
                        console.log("HI HERE");
                        console.log(user.nom);
                        user.medecins.push({medecin: req.userInfos.userId});
                        user.save();
                        Medecin.find({})
                        .then((medecins)=>{
                            medecins.forEach((medecin)=>{
                                var isInArray = medecin.demandes.some((user)=>{
                                    return user.equals(patientId);
                                })
                                if (isInArray) {
                                    medecin.demandes.pull(patientId);
                                    medecin.save();
                                }
                            })
                        })
                    });
                })
            }
            else if (action === 'no') {
                Medecin.findById(req.userInfos.userId)
                .then((medecin)=>{
                    medecin.demandes.pull(patientId)
                    medecin.save();
                })
            }
            else if(action === 'end') {   
                Medecin.findByIdAndUpdate(req.userInfos.userId, 
                    {$set: {"utilisateurs.$[user].finContrat": new Date()}},
                    {arrayFilters: [{"user.utilisateur": patientId, "user.finContrat": null}]})
                    .then((medecin) => {
                        User.findByIdAndUpdate(patientId, 
                            {$set: {"medecins.$[medec].finContrat": new Date()}},
                            {arrayFilters: [{"medec.medecin": req.userInfos.userId, "medec.finContrat": null}]})
                            .then((doc) => {
                                console.log(doc);
                            })
                    })  
            }
            else if(action === 'yesEnd') {
                Medecin.findById(req.userInfos.userId)
                .then((medecin)=>{
                    medecin.demandes.pull(patientId)
                    medecin.save();
                });
                Medecin.findByIdAndUpdate(req.userInfos.userId, 
                    {$set: {"utilisateurs.$[user].finContrat": new Date()}},
                    {arrayFilters: [{"user.utilisateur": patientId, "user.finContrat": null}]})
                    .then((medecin) => {
                        User.findByIdAndUpdate(patientId, 
                            {$set: {"medecins.$[medec].finContrat": new Date()}},
                            {arrayFilters: [{"medec.medecin": req.userInfos.userId, "medec.finContrat": null}]})
                            .then((doc) => {
                                console.log(doc);
                            })
                    }) 
            }
            else if(action === 'noEnd') {
                Medecin.findById(req.userInfos.userId)
                .then((medecin)=>{
                    medecin.demandes.pull(patientId)
                    medecin.save();
                })
            }
            res.redirect('demandes')
        }
    })

    app.get('/patients',authenticateToken, (req, res) => {
        if(req.userInfos.type === 'normal'){
            res.redirect('patientHome');
            /*res.redirect(url.format({
                pathname:"/home",
                query: {
                    "user": req.userInfos.type
                }
            }));*/
        }
        else if(req.userInfos.type === 'medecin') {
            Medecin.findById(req.userInfos.userId)
            .populate('utilisateurs.utilisateur')
            .then((medecin) => {
                var oldPatients = [];
                var currentPatients = [];
                medecin.utilisateurs.forEach((user) =>
                {
                    if(user.finContrat == null) {
                        currentPatients.push(user);
                    }
                    else {
                        oldPatients.push(user);
                    }
                })
                res.render('patients', {allPatients: medecin.utilisateurs, oldPatients: oldPatients, currentPatients: currentPatients});
            })
        }
        else {
            res.redirect('/');
        }
    });

}

