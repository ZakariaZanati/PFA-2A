module.exports = function (app , mongoose) {

    var User = require('../models/userModel');
    var Medecin = require('../models/medecinModel');
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
        res.render('login');
    });

    app.get('/login',function(req,res){
        res.render('login');
    });
    
    
    app.post('/login',urlencodedParser,function(req,res){
        console.log(req.body);

        User.findOne({email : req.body.email , password : req.body.password},(err,user)=>{
            if(user){
                console.log('user connecté');
                res.redirect('/home');
            }
            else{
                Medecin.findOne({email : req.body.email , password : req.body.password},(err,medecin)=>{
                    if (medecin) {
                        console.log('medecin connecté');
                        res.redirect('/home');
                    } else {
                        console.log('echec de connexion');
                        res.render('login',{err : 'Email ou mot de passe incorrecte'});
                    }
                })
            }
        })
    });
    
    app.get('/registration',function(req,res){
        console.log(req.query);
        res.render('registration');
    })
    
    app.post('/registration',urlencodedParser, function(req,res){
        console.log(req.body);
        
     
        var type = req.body.type;
        var data = req.body;

        if (type === 'normal') {
            var user = new User({
                nom_complet : data.nomComplet,
                sexe : data.gender,
                telephone : data.telephone,
                dateNaissance : data.dateNaissance,
                email : data.email,
                age : get_age(data.dateNaissance),
                ville : data.ville,
                pays : data.pays,
                password : data.password,
                groupeSanguin : data.grpsang
            });
            User.create(user);
            console.log('user created');
            
        }
        else if(type === 'medecin'){
            var medecin = new Medecin({
                nom_complet : data.nomComplet,
                sexe: data.gender,
                telephone: data.telephone,
                email: data.email,
                ville: data.ville,
                pays: data.pays,
                password: data.password,
                adresse_lieu_travail : data.grpsang
            })

            Medecin.create(medecin);
            console.log('medecin created');
        }

        res.redirect('/login');

        
    });

    app.get('/home',(req,res)=>{
        res.render('home');
    })

   
}