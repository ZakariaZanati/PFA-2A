var mongoose = require('mongoose');
var express = require('express');
var session = require('express-session');
var http = require('http');
const path = require('path')

var app = express();


const hostname = 'localhost';
const port = 3000;

const url = 'mongodb://localhost:27017/capteurs';

var userController = require('./controllers/userController');
var newValuesController = require("./controllers/newValuesController");
var prelevementsController = require("./controllers/prelevementsController");
var relationsController = require('./controllers/relationsController');
var seuilsController = require('./controllers/seuilsController');

app.set('view engine','ejs');
app.use('/public',express.static('public'));
app.set('views', [path.join(__dirname, 'views'), path.join(__dirname, 'views/medecin'), path.join(__dirname, 'views/patient')]);

app.use(session({
    secret: '0123456789',
    saveUninitialized : false,
    resave : false
}));

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }).then((db)=>{
    console.log('Connected correctly to server');
},(err)=>{
    console.log(err);
});

seuilsController(app, mongoose);
userController(app, mongoose);
newValuesController(app, mongoose);
prelevementsController(app, mongoose);
relationsController(app,mongoose);

 const server = http.createServer(app);
 
 server.listen(port,hostname,()=>{
     console.log(`Server runnin at http://${hostname}:${port}`);
 });
