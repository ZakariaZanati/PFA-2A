document.getElementById('patient').addEventListener('click',
    function () {
        document.getElementById("form-doc").style.display = "none";
        document.getElementById("form-user").style.display = "block";
        document.getElementById("imginscription").src = "public/images/health.jpg"; 
    });

document.getElementById('med').addEventListener('click',
    function () {
        document.getElementById("form-user").style.display = "none";
        document.getElementById("form-doc").style.display = "block";
        document.getElementById("imginscription").src = "public/images/doctor.jpg";
    });

/*var url_string = window.location.href;
var url = new URL(url_string);
var param = url.searchParams.get("user");
var medecin = document.getElementById('form-doc');
var user = document.getElementById('form-user');

if(param === "patient" || param === null){
    medecin.style.display = "none";
    user.style.display= "block";
    document.getElementById("imginscription").src = "public/images/health.jpg";
}

if(param === "medecin"){
    user.style.display = "none";
    medecin.style.display= "block";
    document.getElementById("imginscription").src = "public/images/doctor.jpg";
}*/