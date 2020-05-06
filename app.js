var mongoose = require('mongoose');
var express = require('express');
var session = require('express-session');
var http = require('http');

var app = express();


const hostname = 'localhost';
const port = 3000;

const url = 'mongodb://localhost:27017/pfa';

var userController = require('./controllers/userController');
var newValuesController = require("./controllers/newValuesController");
var prelevementsController = require("./controllers/prelevementsController");
var relationsController = require('./controllers/relationsController');
var seuisController = require('./controllers/seuilsController');

app.set('view engine','ejs');
app.use('/public',express.static('public'));

app.use(session({
    secret: '0123456789',
    saveUninitialized : false,
    resave : false
}));

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then((db)=>{
    console.log('Connected correctly to server');
},(err)=>{
    console.log(err);
});

userController(app, mongoose);
newValuesController(app, mongoose);
prelevementsController(app, mongoose);
relationsController(app,mongoose);
seuisController(app, mongoose);

 const server = http.createServer(app);
 
 server.listen(port,hostname,()=>{
     console.log(`Server runnin at http://${hostname}:${port}`);
 });

