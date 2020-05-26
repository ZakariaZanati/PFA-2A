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

var moyenneMoi = (userId , moyenneJour) => {
    var moi = new Date().getMonth()+1;
    var annee = new Date().getFullYear();
    var jour = new Date().getDate();
    

    Statistics.findOne({utilisateur : userId})
    .then(value=>{
        if (value.MoyennesAnnees[0] ) {
            if (day == 1 && moi == 1 ) {
                var moyenne = {
                    annee : annee,
                    moyennesMois : [{
                        moi : moi,
                        moyenneTemperature : moyenneJour[0],
                        moyenneTensionSystolique : moyenneJour[1],
                        moyenneTensionDiastolique : moyenneJour[2],
                        moyenneTauxOxygen : moyenneJour[3],
                        moyenneTauxGlucose : moyenneJour[4]
    
                    }],
                    moyenneAnnee : {
                        moyenneTemperature : moyenneJour[0],
                        moyenneTensionSystolique : moyenneJour[1],
                        moyenneTensionDiastolique : moyenneJour[2],
                        moyenneTauxOxygen : moyenneJour[3],
                        moyenneTauxGlucose : moyenneJour[4]
                    }
                
                };  
                Statistics.findOne({utilisateur : userId})
                .then(value=>{
                    value.MoyennesAnnees.push(moyenne);
                    value.save();
                })
            }
            else{
                Statistics.findOne({utilisateur:userId}, {'MoyennesAnnees':{$elemMatch :{annee : annee}}})
                .then(result =>{
                    Statistics.findOne({utilisateur : userId})
                    .select('MoyennesJours -_id')
                    .then(val =>{
                            nbJrsMoi = 0;
                            nbJrsAnnee = 0;
                            val.MoyennesJours.forEach(element => {
                                if (element.jour.getMonth()+1 === moi && element.jour.getFullYear() === annee) {
                                    console.log(element);
                                    nbJrsMoi++;
                                }
                                if (element.jour.getFullYear() === annee) {
                                    console.log(element);
                                    nbJrsAnnee++;
                                }
                            });

                            console.log(nbJrsMoi);
                            console.log(nbJrsAnnee);
                            
                            result.MoyennesAnnees[0]['moyennesMois'].forEach(element=>{
                                if (element.moi == moi) {
                                    Statistics.updateOne(
                                        {
                                            utilisateur:userId,'MoyennesAnnees.annee': annee, 'MoyennesAnnees.moyennesMois.moi' : moi
                                        },
                                        {
                                            $set:{
                                                'MoyennesAnnees.0.moyennesMois.$.moyenneTemperature' : (element.moyenneTemperature*(nbJrsMoi-1)+moyenneJour[0])/nbJrsMoi,
                                                'MoyennesAnnees.0.moyennesMois.$.moyenneTensionSystolique' : (element.moyenneTensionSystolique*(nbJrsMoi-1)+moyenneJour[1])/nbJrsMoi,
                                                'MoyennesAnnees.0.moyennesMois.$.moyenneTensionDiastolique' : (element.moyenneTensionDiastolique*(nbJrsMoi-1)+moyenneJour[2])/nbJrsMoi,
                                                'MoyennesAnnees.0.moyennesMois.$.moyenneTauxOxygen' : (element.moyenneTauxOxygen*(nbJrsMoi-1)+moyenneJour[3])/nbJrsMoi,
                                                'MoyennesAnnees.0.moyennesMois.$.moyenneTauxGlucose' : (element.moyenneTauxGlucose*(nbJrsMoi-1)+moyenneJour[4])/nbJrsMoi
                                            }
                                        }
                                    )
                                    .then(res=>console.log(res));
                                    
                                }
                                Statistics.updateOne(
                                    {
                                        utilisateur:userId,'MoyennesAnnees.annee': annee, 
                                    },
                                    {
                                        $set:{
                                            'MoyennesAnnees.0.moyenneAnnee.moyenneTemperature' : (element.moyenneTemperature*(nbJrsAnnee-1)+moyenneJour[0])/nbJrsAnnee,
                                            'MoyennesAnnees.0.moyenneAnnee.moyenneTensionSystolique' : (element.moyenneTensionSystolique*(nbJrsAnnee-1)+moyenneJour[1])/nbJrsAnnee,
                                            'MoyennesAnnees.0.moyenneAnnee.moyenneTensionDiastolique' : (element.moyenneTensionDiastolique*(nbJrsAnnee-1)+moyenneJour[2])/nbJrsAnnee,
                                            'MoyennesAnnees.0.moyenneAnnee.moyenneTauxOxygen' : (element.moyenneTauxOxygen*(nbJrsAnnee-1)+moyenneJour[3])/nbJrsAnnee,
                                            'MoyennesAnnees.0.moyenneAnnee.moyenneTauxGlucose' : (element.moyenneTauxGlucose*(nbJrsAnnee-1)+moyenneJour[4])/nbJrsAnnee
                                        }
                                    }
                                )
                                .then(res=>console.log(res));
                            });
                            
                    }); 
                })
            }
        }
        else {
            var moyenne = {
                annee : annee,
                moyennesMois : [{
                    moi : moi,
                    moyenneTemperature : moyenneJour[0],
                    moyenneTensionSystolique : moyenneJour[1],
                    moyenneTensionDiastolique : moyenneJour[2],
                    moyenneTauxOxygen : moyenneJour[3],
                    moyenneTauxGlucose : moyenneJour[4]

                }],
                moyenneAnnee : {
                    moyenneTemperature : moyenneJour[0],
                    moyenneTensionSystolique : moyenneJour[1],
                    moyenneTensionDiastolique : moyenneJour[2],
                    moyenneTauxOxygen : moyenneJour[3],
                    moyenneTauxGlucose : moyenneJour[4]
                }
            
            };  
            Statistics.findOne({utilisateur : userId})
            .then(value=>{
                value.MoyennesAnnees.push(moyenne);
                value.save();
            })
        }
    })
}

module.exports = {moyenneSemaine,moyenneMoi};
