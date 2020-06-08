function active(id) {
    var c = document.getElementById(id);
    if (c.className == "active") {
        c.className = "non";
    } else {
        c.className = "active";
    }
}
function goBack() {
    window.history.back();
}