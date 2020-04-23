module.exports = function (app , mongoose) {

    var User = require('../models/userModel');
    var Medecin = require('../models/medecinModel');
    var bodyParser = require('body-parser');
    var urlencodedParser = bodyParser.urlencoded({
        extended: false
    })

    app.get('/',(req,res)=>{
        res.render('login');
    });

    app.get('/login',function(req,res){
        res.render('login');
    });
    
    
    app.post('/login',urlencodedParser,function(req,res){
        console.log(req.body);
        res.render('profile');
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
                age : 30,
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

        res.render('login');

        
    });

   
}