module.exports = function (app , mongoose) {

    var User = require('../models/userModel');
    var Medecin = require('../models/medecinModel');
    var Alert = require('../models/alertModel');
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


    app.get('/medecins', authenticateToken, (req,res)=>{
        if (req.userInfos.type === 'normal') {
            Medecin.find({})
            .then((medecins)=>{
                User.findById(req.userInfos.userId)
                .populate('medecins.medecin')
                .populate('demandes')
                .then(user => {
                    var oldMedecins = [];
                    var currentMedecins = [];
                    var specialites = [];
                    var villes = [];
                    var pays = [];
                    medecins.forEach(medecin => {
                        var isInArray = specialites.find(specialite => specialite == medecin.specialite);
                        var isInPays = pays.find(pays => pays == medecin.pays);
                        var isInVille = villes.find(ville => ville == medecin.ville);
                        if(!isInArray) {
                            specialites.push(medecin.specialite);
                        }
                        if(!isInPays) {
                            pays.push(medecin.pays);
                        }
                        if(!isInVille) {
                            villes.push(medecin.ville);
                        }
                    })
                    user.medecins.forEach(medecin => {
                        if(medecin.finSuivi != null ) oldMedecins.push(medecin);
                        else currentMedecins.push(medecin);
                    })
                    Alert.find({utilisateur: req.userInfos.userId, statutPatient: 0})
                    .then(alerts => {
                        res.render('medecins', {demandes : user.demandes, alerts: alerts, villes: villes, pays: pays, specialites: specialites, allMedecins: medecins, currentMedecins: currentMedecins , oldMedecins: oldMedecins});
                    })  
                })
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

    app.get('/medecinProfile', authenticateToken, (req,res)=>{
        if (req.userInfos.type === 'normal') {
            id = req.query.id;
            Medecin.findById(id)
            .then((medecin)=>{
                User.findById(req.userInfos.userId)
                .populate('demandes')
                .then((user) => {
                    var isMedecin = user.medecins.find(_medecin => _medecin.medecin == id && _medecin.finSuivi == null);
                    var sentMeDemande = user.demandes.find(demande => demande == id);
                    var sentDemande = medecin.demandes.find(demande => demande == user.id);
                    var oldMedecin = user.medecins.find(_medecin => _medecin.medecin == id && _medecin.finSuivi != null);
                    Alert.find({utilisateur: req.userInfos.userId, statutPatient: 0})
                    .then(alerts => {
                        res.render('medecinProfile',{demandes: user.demandes, alerts: alerts, medecin : medecin, estMedecin: isMedecin, ancienMedecin: oldMedecin, sentDemande: sentDemande, sentMeDemande: sentMeDemande});   
                    })
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
    

    app.post('/medecinProfile', authenticateToken, urlencodedParser,(req,res,next)=>{
        id = req.query.id;
        action = req.query.action;
        if (req.userInfos.type === 'normal') {
            if(action === 'yes') {
                User.findById(req.userInfos.userId)
                .then((user)=>{
                    var isInArray = user.demandes.some((medecin)=>{
                        return medecin.equals(id);
                    });
                    if (isInArray) {
                        user.medecins.push({
                            $each: [{medecin: id}],
                            $position: 0});
                        user.demandes.pull(id);
                        user.save();
                        Medecin.findById(id)
                        .then(medecin => {
                            medecin.utilisateurs.push({
                                $each: [{utilisateur: req.userInfos.userId}],
                                $position: 0});
                            medecin.save();
                        }) 
                    }
                });
            }
            else if(action === 'no') {
                User.findById(req.userInfos.userId)
                .then((user)=>{
                    var isInArray = user.demandes.some((medecin)=>{
                        return medecin.equals(id);
                    })
                    if (isInArray) {
                        user.demandes.pull(id);
                        user.save();  
                    }
                });
            }    
            else if(action === 'end') {
                User.findByIdAndUpdate(req.userInfos.userId, 
                    {$set: {"medecins.$[medec].finSuivi": new Date()}},
                    {arrayFilters: [{"medec.medecin": id, "medec.finSuivi": null}]})
                    .then((user) => {
                        Medecin.findByIdAndUpdate(id, 
                            {$set: {"utilisateurs.$[user].finSuivi": new Date()}},
                            {arrayFilters: [{"user.utilisateur": req.userInfos.userId, "user.finSuivi": null}]})
                            .then((doc) => {
                                console.log(doc);
                            })
                    })
            }
            else if(action === "annuler") {
                Medecin.findById(id)
                .then((medecin)=>{
                    var isInArray = medecin.demandes.some((user)=>{
                        return user.equals(req.userInfos.userId);
                    });
                    if (isInArray) {
                        medecin.demandes.pull(id);
                        medecin.save();  
                    }
                });
            }
            else if(action === "send") {
                Medecin.findById(id)
                .then((medecin)=>{
                    var isInArray = medecin.demandes.some((user)=>{
                        return user.equals(req.userInfos.userId);
                    });
                    if (!isInArray) {
                        medecin.demandes.push({
                            $each: [req.userInfos.userId],
                            $position: 0});
                        medecin.save();  
                    }
                });
            }
        }       
        res.redirect(url.format({
            pathname:"/medecinProfile",
            query: {
                "id": id
            }
        }));
    })

    app.get('/demandes',  authenticateToken, (req,res)=>{
        if (req.userInfos.type === 'medecin') {
            User.find()
            .then(users => {
                Medecin.findById(req.userInfos.userId)
                .populate('demandes')
                .then((medecin) => {
                    var maladies = [];
                    var villes = [];
                    var pays = [];
                    users.forEach(user => {
                        user.maladies.forEach(maladie => {
                            var isInArray = maladies.find(_maladie => _maladie.toLowerCase() == maladie.toLowerCase());
                            if(!isInArray) {
                                maladies.push(maladie);
                            }
                        })
                        
                        var isInPays = pays.find(pays => pays == user.pays);
                        var isInVille = villes.find(ville => ville == user.ville);
                        if(!isInPays) {
                            pays.push(user.pays);
                        }
                        if(!isInVille) {
                            villes.push(user.ville);
                        }
                    })
                    
                    res.render('demandes', {villes: villes, pays: pays, maladies: maladies, demandes: medecin.demandes});
                })
            })
        }
        else if(req.userInfos.type === 'normal') {
            res.redirect('patientHome');
        }
        else {
            console.log('not logged');
            res.redirect('/login');
        }
    })

    app.get('/patientDemandes',  authenticateToken, (req,res)=>{
        if (req.userInfos.type === 'normal') {
            User.findById(req.userInfos.userId)
            .populate('demandes')
            .then((user)=>{
                var specialites = [];
                var villes = [];
                var pays = [];
                user.demandes.forEach(medecin => {
                    var isInArray = specialites.find(specialite => specialite == medecin.specialite);
                    var isInPays = pays.find(pays => pays == medecin.pays);
                    var isInVille = villes.find(ville => ville == medecin.ville);
                    if(!isInArray) {
                        specialites.push(medecin.specialite);
                    }
                    if(!isInPays) {
                        pays.push(medecin.pays);
                    }
                    if(!isInVille) {
                        villes.push(medecin.ville);
                    }
                })
                Alert.find({utilisateur: req.userInfos.userId, statutPatient: 0})
                .then(alerts => {
                    res.render('patientDemandes',{alerts : alerts, villes : villes, specialites : specialites, pays : pays , demandes : user.demandes});    
                })
            })
        }
        else if(req.userInfos.type === 'medecin') {
            res.redirect('medecinHome');
        }
        else {
            console.log('not logged');
            res.redirect('/login');
        }
    })

    app.post('/userProfile', authenticateToken, urlencodedParser,(req,res,next)=>{
        id = req.query.id;
        action = req.query.action;
        if (req.userInfos.type === 'medecin') {
            if(action === 'yes') {
                Medecin.findById(req.userInfos.userId)
                .then((medecin)=>{
                    var isInArray = medecin.demandes.some((user)=>{
                        return user.equals(id);
                    });
                    if (isInArray) {
                        medecin.utilisateurs.push({
                            $each: [{utilisateur: id}],
                            $position: 0});
                        medecin.demandes.pull(id);
                        medecin.save();
                        User.findById(id)
                        .then(user => {
                            user.medecins.push({
                                $each: [{medecin: req.userInfos.userId}],
                                $position: 0});
                            user.save();
                        })
                    }
                });
            }
            else if(action === 'no') {
                Medecin.findById(req.userInfos.userId)
                .then((medecin)=>{
                    var isInArray = medecin.demandes.some((user)=>{
                        return user.equals(id);
                    })
                    if (isInArray) {
                        medecin.demandes.pull(id);
                        medecin.save();  
                    }
                });
            }    
            else if(action === 'end') {
                Medecin.findByIdAndUpdate(req.userInfos.userId, 
                    {$set: {"utilisateurs.$[user].finSuivi": new Date()}},
                    {arrayFilters: [{"user.utilisateur": id, "user.finSuivi": null}]})
                    .then((medecin) => {
                        User.findByIdAndUpdate(id, 
                            {$set: {"medecins.$[medec].finSuivi": new Date()}},
                            {arrayFilters: [{"medec.medecin": req.userInfos.userId, "medec.finSuivi": null}]})
                            .then((doc) => {
                                console.log(doc);
                            })
                    })
            }
            else if(action === "annuler") {
                User.findById(id)
                .then((user)=>{
                    var isInArray = user.demandes.some((medecin)=>{
                        return medecin.equals(req.userInfos.userId);
                    });
                    if (isInArray) {
                        user.demandes.pull(req.userInfos.userId);
                        user.save();  
                    }
                });
            }
            else if(action === "send") {
                User.findById(id)
                .then((user)=>{
                    var isInArray = user.demandes.some((medecin)=>{
                        return medecin.equals(req.userInfos.userId);
                    });
                    if (!isInArray) {
                        user.demandes.push({
                            $each: [req.userInfos.userId],
                            $position: 0});
                        user.save();  
                    }
                });
            }
        }       
        res.redirect(url.format({
            pathname:"/userProfile",
            query: {
                "id": id
            }
        }));
    })   

    app.get('/userProfile', authenticateToken, (req,res)=>{
        if (req.userInfos.type === 'medecin') {
            id = req.query.id
            User.findById(id)
            .then((user)=>{
                Medecin.findById(req.userInfos.userId)
                .then((medecin) => {

                    var isPatient = medecin.utilisateurs.find(user => user.utilisateur == id && user.finSuivi == null);
                    var sentMeDemande = medecin.demandes.find(demande => demande == id);
                    var sentDemande = user.demandes.find(demande => demande == medecin.id);
                    var oldPatient = medecin.utilisateurs.find(user => user.utilisateur == id && user.finSuivi != null);
                    res.render('userProfile',{user : user, estPatient: isPatient, ancienPatient: oldPatient, sentDemande: sentDemande, sentMeDemande: sentMeDemande});
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

    app.get('/patients',  authenticateToken, (req,res) => {
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
            User.find()
            .then(users => {
                Medecin.findById(req.userInfos.userId)
                .populate('utilisateurs.utilisateur')
                .then((medecin) => {
                    var oldPatients = [];
                    var currentPatients = [];
                    var maladies = [];
                    var villes = [];
                    var pays = [];
                    users.forEach(user => {
                        user.maladies.forEach(maladie => {
                            var isInArray = maladies.find(_maladie => _maladie.toLowerCase() == maladie.toLowerCase());
                            if(!isInArray) {
                                maladies.push(maladie);
                            }
                        })
                        
                        var isInPays = pays.find(pays => pays == user.pays);
                        var isInVille = villes.find(ville => ville == user.ville);
                        if(!isInPays) {
                            pays.push(user.pays);
                        }
                        if(!isInVille) {
                            villes.push(user.ville);
                        }
                    })
                    medecin.utilisateurs.forEach((user) =>
                    {
                        if(user.finSuivi == null) {
                            currentPatients.push(user);
                        }
                        else {
                            oldPatients.push(user);
                        }
                    })
                    res.render('patients', {villes: villes, pays: pays, maladies: maladies, allPatients: users, oldPatients: oldPatients, currentPatients: currentPatients});
                })
            })
        }
        else {
            res.redirect('/');
        }
    });

}

