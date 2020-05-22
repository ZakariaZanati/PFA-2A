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
        
        if (value.MoyennesSemaines[0]) {
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
                Statistics.findOne({utilisateur : userId})
                .then(value=>{
                    value.MoyennesSemaines.push(moyenne);
                    value.save();
                });
            }
            else {
                
                Statistics.findOne({utilisateur : userId}, {"MoyennesSemaines": {$elemMatch : {"debutSemaine" : retrieveDays(date,daysToRetrieve)}}})
                .then(result =>{
                   Statistics.findOne({utilisateur : userId})
                   .select('MoyennesJours -_id')
                   .then(val =>{
                       nbJrs = 0;
                        val.MoyennesJours.forEach(element => {
                            if (element.jour >= result.MoyennesSemaines[0].debutSemaine && element.jour <= result.MoyennesSemaines[0].finSemaine) {
                                console.log(element);
                                nbJrs++;
                            }
                        });
                        console.log(nbJrs);
                        Statistics.update({utilisateur : userId, 'MoyennesSemaines.debutSemaine' : retrieveDays(date,daysToRetrieve)},
                        {$set : {
                            'MoyennesSemaines.$.moyenneTemperature' : (result.MoyennesSemaines[0].moyenneTemperature*(nbJrs-1) + moyenneJour[0])/nbJrs ,
                            'MoyennesSemaines.$.moyenneTensionSystolique' : (result.MoyennesSemaines[0].moyenneTensionSystolique*(nbJrs-1) + moyenneJour[1])/nbJrs,
                            'MoyennesSemaines.$.moyenneTensionDiastolique' : (result.MoyennesSemaines[0].moyenneTensionDiastolique*(nbJrs-1) + moyenneJour[2])/nbJrs,
                            'MoyennesSemaines.$.moyenneTauxOxygen' : (result.MoyennesSemaines[0].moyenneTauxOxygen*(nbJrs-1) + moyenneJour[3])/nbJrs,
                            'MoyennesSemaines.$.moyenneTauxGlucose' : (result.MoyennesSemaines[0].moyenneTauxGlucose*(nbJrs-1) + moyenneJour[4])/nbJrs
                            }
                        },res =>{console.log(res+'\n')});
                   }); 
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
            Statistics.findOne({utilisateur : userId})
            .then(value=>{
                value.MoyennesSemaines.push(moyenne);
                value.save();
            })
            
        }
    })
}

module.exports = moyenneSemaine;