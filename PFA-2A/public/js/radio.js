var url_string = window.location.pathname;
var urlTab = url_string.split('/');
var url = new URL(window.location.href);
var param = url.searchParams.get("filtre");
if(urlTab[1] == 'medecins' && param == null) {
    document.getElementById("allMedecins").style.display = "block";
    document.getElementById("oldMedecins").style.display = "none";
    document.getElementById("currentMedecins").style.display = "none";
}
if(urlTab[1] == 'medecins' && param == 'current') {
    document.getElementById("current").checked = true;
    document.getElementById("allMedecins").style.display = "none";
    document.getElementById("oldMedecins").style.display = "none";
    document.getElementById("currentMedecins").style.display = "block";
}

if(urlTab[1] == 'medecins' && param == 'old') {
    document.getElementById("old").checked = true;
    document.getElementById("allMedecins").style.display = "none";
    document.getElementById("oldMedecins").style.display = "block";
    document.getElementById("currentMedecins").style.display = "none";
}


if(urlTab[1] == 'patients' && param == null) {
    document.getElementById("allPatients").style.display = "block";
    document.getElementById("oldPatients").style.display = "none";
    document.getElementById("currentPatients").style.display = "none";
}

if(urlTab[1] == 'patients' && param == 'current') {
    document.getElementById("current").checked = true;
    document.getElementById("allPatients").style.display = "none";
    document.getElementById("oldPatients").style.display = "none";
    document.getElementById("currentPatients").style.display = "block";
}

if(urlTab[1] == 'patients' && param == 'old') {
    document.getElementById("old").checked = true;
    document.getElementById("allPatients").style.display = "none";
    document.getElementById("oldPatients").style.display = "block";
    document.getElementById("currentPatients").style.display = "none";
}

if(document.getElementById('patient')) {
    document.getElementById('patient').addEventListener('click',
    function () {
        document.getElementById("form-doc").style.display = "none";
        document.getElementById("form-user").style.display = "block";
        document.getElementById("imginscription").src = "public/images/happy.jpg";
    });

    document.getElementById('med').addEventListener('click',
        function () {
            document.getElementById("form-user").style.display = "none";
            document.getElementById("form-doc").style.display = "block";
            document.getElementById("imginscription").src = "public/images/doctor.jpg";
        });
}



function getPatients() {
    if (document.getElementById("all").checked) {
        document.getElementById("allPatients").style.display = "block";
        document.getElementById("oldPatients").style.display = "none";
        document.getElementById("currentPatients").style.display = "none";
    }
    else if (document.getElementById("current").checked) {
        document.getElementById("currentPatients").style.display = "block";
        document.getElementById("oldPatients").style.display = "none";
        document.getElementById("allPatients").style.display = "none";
    }
    else {
        document.getElementById("currentPatients").style.display = "none";
        document.getElementById("oldPatients").style.display = "block";
        document.getElementById("allPatients").style.display = "none";
    }
}

function getMedecins() {
    if (document.getElementById("all").checked) {
        document.getElementById("allMedecins").style.display = "block";
        document.getElementById("oldMedecins").style.display = "none";
        document.getElementById("currentMedecins").style.display = "none";
    }
    else if (document.getElementById("old").checked) {
        document.getElementById("oldMedecins").style.display = "block";
        document.getElementById("currentMedecins").style.display = "none";
        document.getElementById("allMedecins").style.display = "none";
    }
    else if (document.getElementById("current").checked) {
        document.getElementById("currentMedecins").style.display = "block";
        document.getElementById("oldMedecins").style.display = "none";
        document.getElementById("allMedecins").style.display = "none";
    }
    
}

var numberOfFields = -1;

function addField() {
    var divMaladie = document.getElementById('maladies');
    if(urlTab[1] == 'myProfileUser') {
        numberOfFields = document.getElementsByName("maladie").length;
    }
    numberOfFields++;
    var input = document.createElement("input");
    input.type = "text";
    input.name = "maladie"
    input.id = "maladie" + numberOfFields;
    divMaladie.appendChild(input);
    var remove = document.createElement("input");
    remove.type = "button";
    remove.value = "supprimer";
    remove.id = numberOfFields;
    remove.setAttribute("onclick" , "removeField(this.id)");
    divMaladie.appendChild(remove);
    var br = document.createElement("br");
    br.id = "br" + numberOfFields;
    divMaladie.appendChild(br);
}

function removeField(id) {
    var input = document.getElementById("maladie" + id);
    var divMaladie = document.getElementById('maladies');
    var remove = document.getElementById(id);
    divMaladie.removeChild(input);
    divMaladie.removeChild(remove);
    divMaladie.removeChild(document.getElementById("br" + id));
}