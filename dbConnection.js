
module.exports = function () {

    var mongoose = require('mongoose');

    const url = 'mongodb://localhost:27017/';
    const connect = mongoose.connect(url);

    connect.then((db)=>{
        console.log('Connected correctly to server');
    },(err)=>{
        console.log(err);
    });
}


