module.exports = function (app , mongoose) {
    const Prelevements = require('../models/valuesModel');
    const User = require('../models/userModel');
    var url = require('url');

    app.get('/patientValues', (req,res)=>{
        if (req.session.type === 'normal') {
            if(req.query.id != req.session.userId) {
                res.render('home', {userType: req.session.type});
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
                if(user.medecin != null) {
                    if(user.medecin == req.session.userId){
                        Prelevements.find({utilisateur: patientId}).sort([['date', -1]])
                        .then((prelevements)=>{
                            res.render('patientValues',{prelevements : prelevements, userType: req.session.type});
                        });
                    }
                    else {
                        res.render('home', {userType: req.session.type});
                    }
                }
                else {
                    res.render('home', {userType: req.session.type});
                }
                
            })
    
        }
        else {
            console.log("Not logged");
            res.redirect('/login');
        }
        
    });

    app.get('/home', (req, res) => {
        if(req.session.type === 'normal') {
            res.render('home', {userType: req.session.type});
        }
        else if(req.session.type === 'medecin'){
            res.render('home', {userType: req.session.type});
        }
        else {
            res.redirect('/');
        }
    })

}