function active(id) {
    var c = document.getElementById(id);
    if (c.className == "active") {
        c.className = "non";
    } else {
        c.className = "active";
    }
}


function validateEmail() {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var x = document.getElementById("email");
    if (x.value.match(mailformat)) {
        console.log("match");
        return true;
    }
    else {
        console.log("don't match");
        return false;
    }
}





function validateForm() {
    var valid = true;
    //call first name function
    valid = valid && validateFirstName();
    return valid;
}
