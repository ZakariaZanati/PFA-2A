module.exports = function (app , mongoose) {

    require('dotenv').config();
    var User = require('../models/userModel');
    var Medecin = require('../models/medecinModel');
    var Statistics = require('../models/statisticsModel');
    const cookieParser = require('cookie-parser');
    const bcrypt = require('bcrypt');
    var url = require('url');
    const jwt = require('jsonwebtoken');
    var authenticateToken = require('../authenticateToken');
    var generateToken = require('../generateToken');
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

    app.get('/',async (req,res)=>{
        const token = req.cookies.token || '';
        console.log(token);
        if (!token) {
            console.log(token);
            res.render('index');
        }
        else{
            const decrypt = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            
            if(decrypt.type === 'normal') {
                res.redirect('patientHome');
               
            }
            else if(decrypt.type === 'medecin') {
                res.redirect('medecinHome');
               
            }
        }
    });

    app.get('/login', function(req,res){
        
        const token = req.cookies.token || '';
        if (token == '') {
            res.render('login');
        }
        else{
            jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
                if(err) return res.sendStatus(403);
                req.user = user
                next();
            });
            if(req.userInfos.type === 'normal') {
                res.redirect('patientHome');
               
            }
            else if(req.userInfos.type === 'medecin') {
                res.redirect('medecinHome');
               
            }
        }
        
       
    });
    
    
    app.post('/login',urlencodedParser , async (req,res)=>{

        User.findOne({email : req.body.email},async (err,user)=>{
            if(user && ( bcrypt.compare(req.body.password,user.password))){

                
                console.log('user connecté');

                userInfos = {
                    nom : user.nom,
                    prenom : user.prenom,
                    email : user.email,
                    userId : user._id,
                    type : 'normal'
                }

                await generateToken(res,user._id,user.nom,user.prenom,user.email,'normal');

                Statistics.findOne({utilisateur : user._id})
                .then(value =>{
                    if (!value) {
                        Statistics.create({utilisateur : user._id});
                    }
                })
                res.redirect('patientHome');
                
            }
            else{
                Medecin.findOne({email : req.body.email},async(err,medecin)=>{
                    if (medecin && bcrypt.compare(req.body.password,medecin.password)) {

                        userInfos = {
                            nom : medecin.nom,
                            prenom : medecin.prenom,
                            email : medecin.email,
                            userId : medecin._id,
                            type : 'medecin'
                        }
        
                        await generateToken(res,medecin._id,medecin.nom,medecin.prenom,medecin.email,'medecin');

                        console.log('medecin connecté');
                        res.redirect('medecinHome')
                       
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

    app.post('/registration',urlencodedParser,async (req,res,next)=>{
        console.log(req.body);
        
        var data = req.body;
        var type = req.query.user;
        console.log(type);
        User.findOne({email : data.email})
        .then(async(user)=>{
            if(user != null) {
                res.render('registration',{error : "L'émail "+ data.email + " exist déjà !"});
                var err = new Error("L'émail "+ data.email + " exist déjà !");
                err.status = 500;
                next(err);
            }
            else{
                if(data.password != data.confirmation) {
                    res.render('registration',{error : "Confirmation du mot de passe n'est pas correcte"});
                    var err = new Error("Confirmation du mot de passe n'est pas correcte");
                    err.status = 500;
                    next(err);
                }
                else if (type === 'normal' || type == null) {
                    try {
                        const hashedPassword = await bcrypt.hash(data.password,10);
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
                                password : hashedPassword,
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
                                password : hashedPassword,
                                groupeSanguin : data.grpsang,
                                maladies: [data.diabete]
                            });
                            User.create(user);
                        }
                        console.log('patient created');
                        res.redirect('/login');
                    } catch {
                        res.status(500).send();
                    }
                    
                }
                else if(type === 'medecin'){
                    
                    try {
                        const hashedPassword = await bcrypt.hash(data.password,10);

                        var medecin = new Medecin({
                            nom : data.nom,
                            prenom: data.prenom,
                            sexe: data.gender,
                            telephone: data.telephone,
                            email: data.email,
                            ville: data.ville,
                            pays: data.pays,
                            password: hashedPassword,
                            specialite: data.specialite,
                            adresse_lieu_travail : data.adresse
                        })
            
                        Medecin.create(medecin);
                        console.log('Medecin created');
                        res.redirect('/login');
                    } catch {
                        res.status(500).send();
                    }
                    
                }

                
            }
        })
        .catch((err)=>next(err));
        
    });

    app.get('/myProfileMedecin', authenticateToken, (req, res) => {
        if(req.userInfos.type === 'medecin') {
            Medecin.findById(req.userInfos.userId)
            .then((medecin) => {
                res.render('myProfileMedecin', {medecin: medecin});
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
            res.redirect('/');
        }
    });

    app.get('/myProfileUser', authenticateToken, (req, res) => {
        console.log(req.userInfos.type);
        if(req.userInfos.type === 'normal') {
            User.findById(req.userInfos.userId)
            .populate('medecins.medecin')
            .then((user) => {
                var currentMedecin = user.medecins.find(medecin => medecin.finSuivi == null);
                if(currentMedecin) {
                    res.render('myProfileUser', {user: user, currentMedecin: currentMedecin.medecin});
                }
                else {
                    res.render('myProfileUser', {user: user, currentMedecin: null})
                }
                
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
            res.redirect('/');
        }
    });

    app.post('/myProfileUser', authenticateToken, urlencodedParser, function(req,res,next){
        console.log(req.body);
        
        var data = req.body;
        var type = req.query.user;
        
        User.findOne({email : data.email})
        .then((user)=>{
            if(user != null && user.id != req.userInfos.userId) {
                res.render('registration',{error : "L'émail "+ data.email + " exist déjà !"});
                var err = new Error("L'émail "+ data.email + " exist déjà !");
                err.status = 500;
                next(err);
            }
            else{
                User.findByIdAndUpdate(req.userInfos.userId, 
                    {$set: {email: data.email, 
                            telephone : data.telephone,
                            dateNaissance : data.dateNaissance,
                            age : get_age(data.dateNaissance),
                            ville : data.ville,
                            pays : data.pays,
                            groupeSanguin : data.grpsang
                            }
                        })
                .then(user => {
                    res.redirect('myProfileUser');
                });
            }
        })
        .catch((err)=>next(err));
        
    });

    app.post('/myProfileMedecin', authenticateToken, urlencodedParser, function(req,res,next){
        console.log(req.body);
        
        var data = req.body;
        
        Medecin.findOne({email : data.email})
        .then((medecin)=>{
            if(medecin != null && medecin.id != req.userInfos.userId) {
                res.render('registration',{error : "L'émail "+ data.email + " exist déjà !"});
                var err = new Error("L'émail "+ data.email + " exist déjà !");
                err.status = 500;
                next(err);
            }
            else{
                Medecin.findByIdAndUpdate(req.userInfos.userId, 
                    {$set: {email: data.email, 
                            telephone: data.telephone,
                            ville: data.ville,
                            pays: data.pays,
                            adresse_lieu_travail : data.adresse
                        }
                    })
                .then(medecin => {
                    res.redirect('myProfileMedecin');
                });
            }
        })
        .catch((err)=>next(err));
        
    });
    
    app.get('/myMedecins', authenticateToken, (req, res) => {
        if(req.userInfos.type === 'normal') {
            User.findById(req.userInfos.userId)
            .populate('medecins.medecin')
            .then(user => {
                var oldMedecins = [];
                var currentMedecins = [];
                user.medecins.forEach(medecin => {
                    if(medecin.finSuivi != null ) oldMedecins.push(medecin);
                    else currentMedecins.push(medecin);
                })
                res.render('myMedecins', {currentMedecins: currentMedecins , oldMedecins: oldMedecins});
            })
        }
        else if(req.userInfos.type === 'medecin'){
            res.redirect('medecinHome');
            /*res.redirect(url.format({
                pathname:"/home",
                query: {
                    "user": req.userInfos.type
                }
            }));*/
        }
        else {
            res.redirect('/');
        }
    })


    app.get('/logout',async (req,res)=>{
        
        try{
            res.clearCookie('token');
            res.redirect('/');
        }
        catch (err){
            console.log(err)
            res.status(500).send();
        }
    });
   
}