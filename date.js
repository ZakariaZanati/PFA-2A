var date = new Date();
var year = date.getFullYear();
var month = date.getMonth();
var day = date.getDate();
console.log(day);
function getFormatDate(date){
    var dateArray = Date(date).split(' ');
    var _month = date.getMonth() + 1;
    var month = _month < 10 ? '0' + _month : _month;
    var date = dateArray[3] + '-' + month + '-' + dateArray[2];  
    return date;
}

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString().split('T')[0];
}

function retrieveDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() - days);
    return result.toISOString().split('T')[0];
}

console.log(addDays(date,30));
console.log(retrieveDays(date,4));
console.log(date.getDay());


