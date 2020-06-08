var alerts = document.getElementById("alerts");
var notifs = document.getElementById("notifs")
var liAlerts = alerts.getElementsByTagName("li");
var liNotifs = notifs.getElementsByTagName("li");
var numberAlerts = document.getElementById("numberOfAlerts");
var numberNotif = document.getElementById("numberOfNotif");

alerts.style.display = "none";
notifs.style.display = "none"
/*if(li.length != 0) {
    
}*/

if(liAlerts.length) {
    numberAlerts.style.display = "block"
    numberAlerts.innerHTML = liAlerts.length;
    var noAlerted = document.getElementsByName("noAlerted");
    var url_string = window.location.pathname;
    var urlTab = url_string.split('/');
    var medPages = ["dayValues", "userProfile", "myProfileMedecin", "demandes", "medecinHome", "patients"]
    if(noAlerted.length) {
        alert("Vous avez " + noAlerted.length + " nouvelles alerts");
        if(urlTab[1] in medPages) {
            window.location.href = "medecinHome";
        }
        else {
            if(urlTab[1] != "userAlerts" && urlTab[1] != "patientValues") {
                window.location.href = "userAlerts";
            }
            else {
                var urlString = window.location.href;
                var url = new URL(urlString);
                var param = url.searchParams.get("id");
                if (param === null) {
                    window.location.href = "userAlerts";
                }
                else {
                    window.location.href = "medecinHome";
                }    

            }
        }
        
    }
}
else {
    numberAlerts.style.display = "none"
}

if(liNotifs.length) {
    numberNotif.style.display = "block"
    numberNotif.innerHTML = liNotifs.length;
}
else {
    numberNotif.style.display = "none"
}

var i = 0;
var j = 0;

function showAlerts() {
    i%2 == 0 ? alerts.style.display = "block" : alerts.style.display = "none";
    i++;
    notifs.style.display = "none";
    j%2 != 0 ? j++ : j;
}

function showNotifications() {
    j%2 == 0 ? notifs.style.display = "block" : notifs.style.display = "none";
    j++;
    alerts.style.display = "none";
    i%2 != 0 ? i++ : i;
}

function checkLength(length) {
    if(length == 4) {
        alert("Vous avez entrez le maximum pour ce jour");
    }
}