var editBtn = document.getElementById("editDiv");
var saveBtn = document.getElementById("saveDiv");
var noEditable = document.getElementsByClassName("noEditable");
var editable = document.getElementsByClassName("editable");


var url_string = window.location.href;
var url = new URL(url_string);
var param = url.searchParams.get("action");
var inputs = document.getElementsByClassName("login-input");



if(document.getElementById("sang") != null) {
    var sang = document.getElementById("sang").value;
    var optionSang = document.getElementById('gs');
    for(var i = 0; i < optionSang.length; i++) {
        if(optionSang[i].value == sang) {
            optionSang[i].selected = true;
        }
    }
}

if(param != null){
    editBtn.style.display = "none";
    saveBtn.style.display = "block";

    for(var i = 0; i < inputs.length; i++) {
        inputs[i].readOnly = false;
    }

    for(var i = 0; i < editable.length; i++) {
        editable[i].style.display = "block";
    }
    for(var i = 0; i < noEditable.length; i++) {
        noEditable[i].style.display = "none";
    }
}
else {

    editBtn.style.display = "block";
    saveBtn.style.display = "none";

    for(var i = 0; i < editable.length; i++) {
        editable[i].style.display = "none";
    }
    for(var i = 0; i < noEditable.length; i++) {
        noEditable[i].style.display = "block";
    }
}