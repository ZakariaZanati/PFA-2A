var alerts = document.getElementById("alerts");
var notifs = document.getElementById("notifs")
var liAlerts = alerts.getElementsByTagName("li");
var liNotifs = notifs.getElementsByTagName("li");
var numberAlerts = document.getElementById("numberOfAlerts");
var numberNotif = document.getElementById("numberOfNotif");

alerts.style.display = "none";
notifs.style.display = "none"
/*if(li.length != 0) {
    alert("Vous avez " + li.length + " nouvelles alerts");
    window.location.href = "seuils";
}*/
numberNotif.innerHTML = liNotifs.length;
numberAlerts.innerHTML = liAlerts.length;
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