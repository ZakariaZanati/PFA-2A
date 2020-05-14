module.exports = function (app , mongoose) {

    var User = require('../models/userModel');
    var Medecin = require('../models/medecinModel');
    var url = require('url');
    var bodyParser = require('body-parser');
    var urlencodedParser = bodyParser.urlencoded({
        extended: false
    })


    var MILLISECONDS_IN_A_YEAR = 1000*60*60*24*365;
    function get_age(time){
        var date_array = time.split('-')
        var years_elapsed = (new Date() - new Date(date_array[0],date_array[1],date_array[2]))/(MILLISECONDS_IN_A_YEAR);
        return Math.trunc(years_elapsed) ; 
    }

    app.get('/',(req,res)=>{
        if(req.session.type === 'normal') {
            res.redirect(url.format({
                pathname:"/home",
                query: {
                    "user": req.session.type
                }
            }));
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
            res.render('login');
        }
    });

    app.get('/login',function(req,res){
        if(req.session.type === 'normal') {
            res.redirect(url.format({
                pathname:"/home",
                query: {
                    "user": req.session.type
                }
            }));
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
            res.render('login');
        }
    });
    
    
    app.post('/login',urlencodedParser,function(req,res){
        console.log(req.body);

        User.findOne({email : req.body.email , password : req.body.password},(err,user)=>{
            if(user){
                req.session.email = req.body.email;
                req.session.nom = user.nom;
                req.session.prenom = user.prenom;
                req.session.userId = user._id;
                req.session.type = 'normal';
                console.log('user connecté');
                res.redirect(url.format({
                    pathname:"/home",
                    query: {
                        "user": req.session.type
                    }
                }));
            }
            else{
                Medecin.findOne({email : req.body.email , password : req.body.password},(err,medecin)=>{
                    if (medecin) {

                        req.session.email = req.body.email;
                        req.session.nom = medecin.nom;
                        req.session.prenom = medecin.prenom;
                        req.session.userId = medecin._id;
                        req.session.type = 'medecin';

                        console.log('medecin connecté');
                        res.redirect(url.format({
                            pathname:"/home",
                            query: {
                                "user": req.session.type
                            }
                        }));
                    } else {
                        console.log('echec de connexion');
                        res.render('login',{err : 'Email ou mot de passe incorrecte'});
                    }
                });
            }
        });
    });
    
    app.get('/registration',function(req,res){
        console.log(req.query);
        res.render('registration');
    })
    
    app.post('/registration',urlencodedParser, function(req,res,next){
        console.log(req.body);
        
     
        var type = req.body.type;
        var data = req.body;

        User.findOne({email : data.email})
        .then((user)=>{
            if(user != null) {
                res.render('registration',{error : "L'émail "+ data.email + " exist déjà !"});
                var err = new Error("L'émail "+ data.email + " exist déjà !");
                err.status = 500;
                next(err);
            }
            else{
                if (type === 'normal') {
                    if(data.diabete === "none"){
                        var user = new User({
                            nom : data.nom,
                            prenom : data.prenom,
                            sexe : data.gender,
                            telephone : data.telephone,
                            dateNaissance : data.dateNaissance,
                            email : data.email,
                            age : get_age(data.dateNaissance),
                            ville : data.ville,
                            pays : data.pays,
                            password : data.password,
                            groupeSanguin : data.grpsang,
                        });
                        User.create(user);
                    }
                    else {
                        var user = new User({
                            nom : data.nom,
                            prenom : data.prenom,
                            sexe : data.gender,
                            telephone : data.telephone,
                            dateNaissance : data.dateNaissance,
                            email : data.email,
                            age : get_age(data.dateNaissance),
                            ville : data.ville,
                            pays : data.pays,
                            password : data.password,
                            groupeSanguin : data.grpsang,
                            maladies: [data.diabete]
                        });
                        User.create(user);
                    }

                }
                else if(type === 'medecin'){
                    var medecin = new Medecin({
                        nom : data.nom,
                        prenom: data.prenom,
                        sexe: data.gender,
                        telephone: data.telephone,
                        email: data.email,
                        ville: data.ville,
                        pays: data.pays,
                        password: data.password,
                        adresse_lieu_travail : data.adresse
                    })
        
                    Medecin.create(medecin);
                    
                }

                console.log('user created');
                res.redirect('/login');
            }
        })
        .catch((err)=>next(err));
        
    });

    app.get('/myProfileUser', (req, res) => {
        if(req.session.type === 'normal') {
            User.findById(req.session.userId)
            .populate('medecins.medecin')
            .then((user) => {
                var currentMedecin = user.medecins.find(medecin => medecin.finContrat == null);
                if(currentMedecin) {
                    res.render('myProfileUser', {user: user, currentMedecin: currentMedecin.medecin});
                }
                else {
                    res.render('myProfileUser', {user: user, currentMedecin: null})
                }
                
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
            res.redirect('/');
        }
    });

    app.get('/oldMedecins', (req, res) => {
        if(req.session.type === 'normal') {
            User.findById(req.session.userId)
            .populate('medecins.medecin')
            .then(user => {
                var oldMedecins = [];
                user.medecins.forEach(medecin => {
                    if(medecin.finContrat != null ) oldMedecins.unshift(medecin);
                })
                res.render('oldMedecins', {oldMedecins: oldMedecins});
            })
        }
        else if(req.session.type === 'medecin'){
            res.redirect(url.format({
                pathname:"/home",
                query: {
                    "user": req.session.type
                }
            }));
        }
        else {
            res.redirect('/');
        }
    })


    app.get('/logout',(req,res)=>{
        
        req.session.destroy(function(err) {
            if(err) {
                console.log(err);
            } else {
                res.redirect('/');
            }
        });
    });
   
}