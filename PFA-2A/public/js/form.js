function showForm(heure) {
    var elements = document.getElementsByClassName(heure);
    document.getElementById("edit" + heure).style.display = "none";
    document.getElementById("valid" + heure).style.display = "block";
    document.getElementById("radio").style.display = "block"
    for(var i = 0; i < elements.length; i++) {
        if(i != elements.length - 1) {
            elements[i].readOnly = false;
            elements[i].type = "number";
        }
    }
}