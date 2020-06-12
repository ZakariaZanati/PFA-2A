var patientNav = document.getElementById("navPatient");
var medecinNav = document.getElementById("navMedecin");
var h1 = false;
if (document.getElementById("h1Patient")) {
    var patientH1 = document.getElementById("h1Patient");
    var medecinH1 = document.getElementById("h1Medecin");
    h1 = true;
}

var profile = document.getElementById("aProfile");


var url_string = window.location.href;
var url = new URL(url_string);
var param = url.searchParams.get("id");

if (param === null) {
    medecinNav.style.display = "none";
    patientNav.style.display = "block";
    if (h1) {
        medecinH1.style.display = "none";
        patientH1.style.display = "block";
    }
    profile.href = "myProfileUser";
}
else {
    medecinNav.style.display = "block";
    patientNav.style.display = "none";
    if (h1) {
        medecinH1.style.display = "block";
        patientH1.style.display = "none";
    }
    profile.href = "myProfileMedecin";
    home.href = "medecinHome";
}