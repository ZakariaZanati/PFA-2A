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


    app.get('/demande',(req,res)=>{
        if (req.session.type === 'medecin') {
            Medecin.find({demandes})
            .then((demandes)=>{

            })
        }
    })

}
