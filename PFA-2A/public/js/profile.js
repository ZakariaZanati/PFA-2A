var editBtn = document.getElementById("editDiv");
var saveBtn = document.getElementById("saveDiv");
var noEditable = document.getElementsByClassName("noEditable");
var editable = document.getElementsByClassName("editable");


var url_string = window.location.href;
var url = new URL(url_string);
var param = url.searchParams.get("action");
var inputs = document.getElementsByClassName("login-input");

var url_tab = window.location.pathname;
var urlTab = url_tab.split('/');


if (document.getElementById("sang") != null) {
    var sang = document.getElementById("sang").value;
    var optionSang = document.getElementById('gs');
    for (var i = 0; i < optionSang.length; i++) {
        if (optionSang[i].value == sang) {
            optionSang[i].selected = true;
        }
    }
}

if (param != null) {
    editBtn.style.display = "none";
    saveBtn.style.display = "block";

    for (var i = 0; i < inputs.length; i++) {
        inputs[i].readOnly = false;
    }

    for (var i = 0; i < editable.length; i++) {
        editable[i].style.display = "block";
    }
    for (var i = 0; i < noEditable.length; i++) {
        noEditable[i].style.display = "none";
    }
    if (urlTab[1] == 'myProfileUser') {
        document.getElementById("add").style.display = "block";
        document.getElementById("hide").style.display = "none";
        document.getElementById("show").style.display = "none";
        var maladies = document.getElementsByClassName("maladie");
        for (var i = 0; i < maladies.length; i++) {
            maladies[i].style.display = "block";
            maladies[i].readOnly = false;
        }
    }
}
else {

    editBtn.style.display = "block";
    saveBtn.style.display = "none";

    for (var i = 0; i < editable.length; i++) {
        editable[i].style.display = "none";
    }
    for (var i = 0; i < noEditable.length; i++) {
        noEditable[i].style.display = "block";
    }

    if (urlTab[1] == 'myProfileUser') {
        var maladies = document.getElementsByName("maladie");
        document.getElementById("add").style.display = "none";
        document.getElementById("show").style.display = "block";
        for (var i = 0; i < maladies.length; i++) {
            document.getElementById(i).style.display = "none";
            maladies[i].readOnly = true;
        }
    }

}

function showMaladies(statut) {
    var show = document.getElementById("show");
    var hide = document.getElementById("hide");
    var maladies = document.getElementsByName("maladie");
    if (statut) {
        show.style.display = "none";
        hide.style.display = "block";
        for (var i = 0; i < maladies.length; i++) {
            maladies[i].style.display = "block"
        }
    }
    else {
        show.style.display = "block";
        hide.style.display = "none";
        for (var i = 0; i < maladies.length; i++) {
            maladies[i].style.display = "none"
        }
    }

}
