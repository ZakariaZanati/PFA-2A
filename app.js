var mongoose = require('mongoose');
var express = require('express');
var session = require('express-session');
var http = require('http');

var userController = require('./controllers/userController');


var app = express();

const hostname = 'localhost';
const port = 3000;

const url = 'mongodb://localhost:27017/pfa';


app.set('view engine','ejs');
app.use('/public',express.static('public'));


app.use(session({secret: '0123456789'}));

mongoose.connect(url).then((db)=>{
    console.log('Connected correctly to server');
},(err)=>{
    console.log(err);
});

userController(app,mongoose);

app.use((req,res,next)=>{
    req.statusCode = 200;
    res.setHeader('Content-type','text/html');
 });
 
 const server = http.createServer(app);
 
 server.listen(port,hostname,()=>{
     console.log(`Server runnin at http://${hostname}:${port}`);
 });


