var patientNav = document.getElementById("navPatient");
var medecinNav = document.getElementById("navMedecin");
var patientH1 = document.getElementById("h1Patient");
var medecinH1 = document.getElementById("h1Medecin");

var profile = document.getElementById("aProfile");
var home = document.getElementById("logo");

var url_string = window.location.href;
var url = new URL(url_string);
var param = url.searchParams.get("id");

if (param === null) {
    medecinNav.style.display = "none";
    patientNav.style.display = "block";
    medecinH1.style.display = "none";
    patientH1.style.display = "block";
    profile.href = "myProfileUser";
    home.href = "patientHome";
}
else {
    medecinNav.style.display = "block";
    patientNav.style.display = "none";
    medecinH1.style.display = "block";
    patientH1.style.display = "none";
    profile.href = "myProfileMedecin";
    home.href = "medecinHome";
}