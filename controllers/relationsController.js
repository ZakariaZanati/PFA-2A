module.exports = function (app , mongoose) {

    var User = require('../models/userModel');
    var Medecin = require('../models/medecinModel');
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
    });

    app.get('/medecinProfile',(req,res)=>{
        if (req.session.type === 'normal') {
            id = req.query.id;
            Medecin.findById(id)
            .then((medecin)=>{
            res.render('medecinProfile',{medecin : medecin});
        })
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
            Medecin.findById(req.session.medecinId)
            .populate('demandes')
            .then((medecin)=>{
                res.render('demandes',{demandes : medecin.demandes});
            })
        }
    })

    app.get('/userProfile',(req,res)=>{
        if (req.session.type === 'medecin') {
            id = req.query.id
            User.findById(id)
            .then((user)=>{
                res.render('userProfile',{user : user});
            })
        }
    });

    app.post('/userProfile',urlencodedParser,(req,res)=>{
        if (req.session.type === 'medecin') {
            userId = req.query.id;
            action = req.query.action
            console.log(action)
            if (action === 'yes') {
                Medecin.findById(req.session.medecinId)
                .then((medecin)=>{
                    medecin.utilisateurs.push(userId);
                    medecin.demandes.pull(userId);
                    medecin.save();
                    User.findById(userId)
                    .then((user)=>{
                        user.medecin = req.session.medecinId;
                        user.save();
                        Medecin.find({})
                        .then((medecins)=>{
                            medecins.forEach((medecin)=>{
                                var isInArray = medecin.demandes.some((user)=>{
                                    return user.equals(userId);
                                })
                                if (isInArray) {
                                    medecin.demandes.pull(userId);
                                    medecin.save();
                                }
                            })
                        })
                    });
                })
            }
            if (action === 'no') {
                Medecin.findById(req.session.medecinId)
                .then((medecin)=>{
                    medecin.demandes.pull(userId)
                    medecin.save();
                })
            }
            res.redirect('demandes')
        }
    })

}
