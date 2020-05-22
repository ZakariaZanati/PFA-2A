var patientNav = document.getElementById("navPatient");
var medecinNav = document.getElementById("navMedecin");
var url_string = window.location.href;
var url = new URL(url_string);
var param = url.searchParams.get("id");

if(param === null){
    medecinNav.style.display = "none";
    patientNav.style.display = "block";
}
else {
    medecinNav.style.display = "block";
    patientNav.style.display = "none";
}