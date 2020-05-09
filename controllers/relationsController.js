module.exports = function (app , mongoose) {

    var User = require('../models/userModel');
    var Medecin = require('../models/medecinModel');
    var url = require('url');
    var bodyParser = require('body-parser');
    var urlencodedParser = bodyParser.urlencoded({
        extended: false
    })


    app.get('/medecins',(req,res)=>{
        if (req.session.type === 'normal') {
            Medecin.find({})
            .then((medecins)=>{
                res.render('medecins',{medecins : medecins});
            });
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
            console.log('not logged')
            res.redirect('/login');
        }
    });

    app.get('/medecinProfile',(req,res)=>{
        if (req.session.type === 'normal') {
            id = req.query.id;
            Medecin.findById(id)
            .then((medecin)=>{
                res.render('medecinProfile',{medecin : medecin});
            })
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
            console.log('not logged')
            res.redirect('/login');
        }
        
    });

    app.post('/medecinProfile',urlencodedParser,(req,res,next)=>{
        id = req.query.id;
        if (req.session.type === 'normal') {
            User.findById(req.session.userId)
            .then((user)=>{
                if (user.medecin != null) {
                    var err = new Error("Vous disposez déjà d'un medecin ");
                    next(err);
                }
                else{
                    Medecin.findById(id)
                    .then((medecin)=>{
                        var isInArray = medecin.demandes.some((user)=>{
                            return user.equals(req.session.userId);
                        })
                        if (!isInArray) {
                            medecin.demandes.push(req.session.userId);
                            medecin.save();
                        }

                    })                    
                }
            })
            .catch((err)=>next(err));
        }
        res.redirect('medecins');
    })


    app.get('/demandes',(req,res)=>{
        if (req.session.type === 'medecin') {
            Medecin.findById(req.session.userId)
            .populate('demandes')
            .then((medecin)=>{
                res.render('demandes',{demandes : medecin.demandes});
            })
        }
        else if(req.session.type === 'normal') {
            res.redirect(url.format({
                pathname:"/home",
                query: {
                    "user": req.session.type
                }
            }));
        }
        else {
            console.log('not logged');
            res.redirect('/login');
        }
    })

    app.get('/userProfile',(req,res)=>{
        if (req.session.type === 'medecin') {
            console.log("hELLO");
            id = req.query.id
            User.findById(id)
            .then((user)=>{
                Medecin.findById(req.session.userId)
                .then((medecin) => {
                    var isInArray = medecin.utilisateurs.some((user)=>{
                        return user.equals(id);
                    })
                    if(isInArray) {
                        res.render('userProfile',{user : user, estPatient: "yes"});
                    }
                    else {
                        res.render('userProfile',{user : user, estPatient: "no"});
                    }
                });
            })
        }
        else {
            res.redirect(url.format({
                pathname:"/home",
                query: {
                    "user": req.session.type
                }
            }));
        }
    });

    app.post('/userProfile',urlencodedParser,(req,res)=>{
        if (req.session.type === 'medecin') {
            patientId = req.query.id;
            action = req.query.action
            console.log(action)
            if (action === 'yes') {
                Medecin.findById(req.session.userId)
                .then((medecin)=>{
                    medecin.utilisateurs.push(patientId);
                    medecin.demandes.pull(patientId);
                    medecin.save();
                    User.findById(patientId)
                    .then((user)=>{
                        console.log("HI HERE");
                        console.log(user.nom);
                        user.medecin = req.session.userId;
                        user.save();
                        console.log("User medecin:" + user.medecin);
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
                Medecin.findById(req.session.userId)
                .then((medecin)=>{
                    medecin.demandes.pull(patientId)
                    medecin.save();
                })
            }
            else if(action === 'end') {
                Medecin.findById(req.session.userId)
                .then((medecin)=>{
                    medecin.utilisateurs.pull(patientId);
                    medecin.save();
                    User.findById(patientId)
                    .then((user)=>{
                        user.medecin = undefined;
                        user.save();
                    });
                })
            }
            res.redirect('demandes')
        }
    })

    app.get('/patients', (req, res) => {
        if(req.session.type === 'normal'){
            res.redirect(url.format({
                pathname:"/home",
                query: {
                    "user": req.session.type
                }
            }));
        }
        else if(req.session.type === 'medecin') {
            Medecin.findById(req.session.userId)
            .populate('utilisateurs')
            .then((medecin) => {
                res.render('patients', {patients: medecin.utilisateurs});
            })
        }
        else {
            res.redirect('/');
        }
    });

}

