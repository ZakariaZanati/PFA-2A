var mongoose = require('mongoose')
var Statistics = require('./models/statisticsModel');


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
//Sunday is 0, Monday is 1, and so on
var moyenneSemaine = (userId, day , date , moyenneJour) => {

    var daysToRetrieve = (day == 0)? 6 : day-1;
    
    Statistics.findOne({utilisateur:userId})
    .then(value =>{
        
        if (value) {
            if (day === 1) {
                var moyenne = {
                    debutSemaine : date,
                    finSemaine : addDays(date,6),
                    moyenneTemperature : moyenneJour[0],
                    moyenneTensionSystolique : moyenneJour[1],
                    moyenneTensionDiastolique : moyenneJour[2],
                    moyenneTauxOxygen : moyenneJour[3],
                    moyenneTauxGlucose : moyenneJour[4]
                };
                Statistics.update({utilisateur : userId}, {$push : {MoyennesSemaines : moyenne}});
            }
            else {
                
                Statistics.findOne({utilisateur : userId, 'MoyennesSemaines.debutSemaine' : retrieveDays(date,daysToRetrieve)})
                .then(result =>{
                    //var test = result.MoyennesSemaines[0].moyenneTemperature;
                    //console.log('resuuuuuuuuuuuuult '+test);
                   
                    Statistics.update({utilisateur : userId, 'MoyennesSemaines.debutSemaine' : retrieveDays(date,daysToRetrieve)},
                    {$set : {
                        'MoyennesSemaines.$.moyenneTemperature' : (result.MoyennesSemaines[0].moyenneTemperature*daysToRetrieve + moyenneJour[0])/(daysToRetrieve+1) ,
                        'MoyennesSemaines.$.moyenneTensionSystolique' : (result.MoyennesSemaines[0].moyenneTensionSystolique*daysToRetrieve + moyenneJour[1])/(daysToRetrieve+1),
                        'MoyennesSemaines.$.moyenneTensionDiastolique' : (result.MoyennesSemaines[0].moyenneTensionDiastolique*daysToRetrieve + moyenneJour[2])/(daysToRetrieve+1),
                        'MoyennesSemaines.$.moyenneTauxOxygen' : (result.MoyennesSemaines[0].moyenneTauxOxygen*daysToRetrieve + moyenneJour[3])/(daysToRetrieve+1),
                        'MoyennesSemaines.$.moyenneTauxGlucose' : (result.MoyennesSemaines[0].moyenneTauxGlucose*daysToRetrieve + moyenneJour[4])/(daysToRetrieve+1)
                        }
                    },res =>{console.log(res+'\n')});
                    
                    

                });
            }
        } else {
            var moyenne = {
                debutSemaine : retrieveDays(date,daysToRetrieve),
                finSemaine : addDays(date,7-day),
                moyenneTemperature : moyenneJour[0],
                moyenneTensionSystolique : moyenneJour[1],
                moyenneTensionDiastolique : moyenneJour[2],
                moyenneTauxOxygen : moyenneJour[3],
                moyenneTauxGlucose : moyenneJour[4] 
            
            };  
            Statistics.create(new Statistics({utilisateur : userId,MoyennesSemaines : moyenne}));
        }
    })
}

module.exports = moyenneSemaine;