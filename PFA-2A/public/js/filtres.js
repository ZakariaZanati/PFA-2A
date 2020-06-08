function search() {
    var table, tr, td, txtValue, index;
    var filters = [];
    var url_string = window.location.pathname;
    var urlTab = url_string.split('/');
    var inputs = [document.getElementById('searchNom'), document.getElementById('searchPrenom'),
    document.getElementById('pays'), document.getElementById('villes'), document.getElementById('specialites')]
    for (var i = 0; i < inputs.length; i++) {
        var value = inputs[i].value.toUpperCase();
        (value == '' && 0 <= i <= 1) ? value = "-1" : value;
        filters.push(value);
    }
    if (urlTab[1] == 'medecins') {
        tables = [document.getElementById("allMedecins"), document.getElementById("currentMedecins"),
        document.getElementById("oldMedecins")];
    }
    else if (urlTab[1] == 'patientDemandes') {
        tables = [document.getElementById("patientDemandes")];
    }



    for (var t = 0; t < tables.length; t++) {
        tr = tables[t].getElementsByTagName("tr");
        if (filters.every(f => f == '-1')) {
            for (var i = 1; i < tr.length; i++) {
                tr[i].style.display = "";
            }
        }

        else {
            for (var i = 1; i < tr.length; i++) {
                td = tr[i].getElementsByTagName("td");

                var conditions = [];
                for (var j = 0; j < td.length - (t + 1); j++) {
                    txtValue = td[j].textContent || td[j].innerText;
                    (txtValue.toUpperCase().indexOf(filters[j]) > -1 || filters[j] == '-1') ? conditions.push(true)
                        : conditions.push(false);
                }
                if (conditions.every(c => c)) {
                    tr[i].style.display = "";
                }
                else {
                    tr[i].style.display = "none";
                }
            }
        }
    }
}

function searchSeuil() {
    var table = document.getElementById("seuils");
    var input = document.getElementById("names");
    var value = input.value.toUpperCase();
    var tr = table.getElementsByTagName("tr");
    if (value == "-1") {
        for (var i = 1; i < tr.length; i++) {
            tr[i].style.display = "";
        }
    }
    else {
        for (var i = 1; i < tr.length; i++) {
            var td = tr[i].getElementsByTagName("td")[0];
            txtValue = td.textContent || td[j].innerText;
            if (txtValue.toUpperCase() == value) {
                tr[i].style.display = "";
            }
            else {
                tr[i].style.display = "none";
            }
        }
    }
}

function searchValeur() {
    var inputMin = document.getElementById("dateValueMin");
    var dateBtn = document.getElementById("dateBtn");

    var elements = document.getElementsByClassName("content");
    if (dateBtn.className == "btn-icon btn-success") {
        if (inputMin.value == '') {
            for (var i = 0; i < elements.length; i++) {
                elements[i].style.display = "";
            }
        }
        else {
            var dateMin = new Date(inputMin.value);
            for (var i = 0; i < elements.length; i++) {
                var date = new Date(elements[i].getAttribute("name"));
                if (dateMin.getTime() == date.getTime()) {
                    elements[i].style.display = "";
                }
                else {
                    elements[i].style.display = "none";
                }
            }
        }
    }
    else {
        var inputMax = document.getElementById("dateValueMax");
        if (inputMin.value == '' && inputMax.value == '') {
            for (var i = 0; i < elements.length; i++) {
                elements[i].style.display = "";
            }
        }
        else if (inputMin.value != '' && inputMax.value == '') {
            var dateMin = new Date(inputMin.value);
            for (var i = 0; i < elements.length; i++) {
                var date = new Date(elements[i].getAttribute("name"));
                if (dateMin.getTime() <= date.getTime()) {
                    elements[i].style.display = "";
                }
                else {
                    elements[i].style.display = "none";
                }
            }
        }
        else if (inputMin.value == '' && inputMax.value != '') {
            var dateMax = new Date(inputMax.value);
            for (var i = 0; i < elements.length; i++) {
                var date = new Date(elements[i].getAttribute("name"));
                if (date.getTime() <= dateMax.getTime()) {
                    elements[i].style.display = "";
                }
                else {
                    elements[i].style.display = "none";
                }
            }

        }
        else {
            var dateMax = new Date(inputMax.value);
            var dateMin = new Date(inputMin.value);
            for (var i = 0; i < elements.length; i++) {
                var date = new Date(elements[i].getAttribute("name"));
                if (dateMin.getTime() <= date.getTime() && date.getTime() <= dateMax.getTime()) {
                    elements[i].style.display = "";
                }
                else {
                    elements[i].style.display = "none";
                }
            }
        }
    }
}


function addDate() {
    var url_string = window.location.pathname;
    var urlTab = url_string.split('/');
    var dateBtn = document.getElementById("dateBtn");
    var divDates = document.getElementById('dates');
    var arrow = document.createElement("i");
    arrow.id = "arrow";
    arrow.className = "fas fa-arrows-alt-h search-icon"
    var icon = dateBtn.firstElementChild;
    if (dateBtn.className == "btn-icon btn-success") {
        var input = document.createElement("input");
        icon.className = "fas fa-minus"
        input.type = "date";
        input.className = "filter-input";
        input.name = "dateMax"
        input.id = "dateValueMax";
        urlTab[1] == "userAlerts" ? input.setAttribute("onchange", "searchValeurAlert()") : input.setAttribute("onchange", "searchValeur()");;
        divDates.removeChild(dateBtn);
        divDates.appendChild(arrow);
        divDates.appendChild(input);
        divDates.appendChild(dateBtn);
        dateBtn.className = "btn-icon btn-echec";

    }
    else {
        var input = document.getElementById("dateValueMax");
        divDates.removeChild(input);
        dateBtn.className = "btn-icon btn-success";
        icon.className = "fas fa-plus"
        divDates.removeChild(document.getElementById("arrow"));


    }
    searchValeur();
}

function selectChoice() {
    var idNames = ["temperature", "tensionSys", "tensionDia", "glucose", "oxygen"];
    var inputs = [];
    var url_string = window.location.pathname;
    var urlTab = url_string.split('/');
    for (var i = 0; i < idNames.length; i++) {
        inputs[i] = document.getElementById(idNames[i]);
    }

    for (var i = 0; i < inputs.length; i++) {
        var tdBody = document.getElementsByClassName(idNames[i] + "Body");
        var tdHead = document.getElementsByClassName(idNames[i] + "Head");
        if (inputs[i].checked) {
            inputs[i].parentElement.parentElement.style.backgroundColor = "#34b3a0"
            for (var j = 0; j < tdHead.length; j++) {
                tdHead[j].style.display = "";
            }
            for (var j = 0; j < tdBody.length; j++) {
                tdBody[j].style.display = "";
            }
        }
        else {
            inputs[i].parentElement.parentElement.style.backgroundColor = "#d87474"
            for (var j = 0; j < tdHead.length; j++) {
                tdHead[j].style.display = "none";
            }
            for (var j = 0; j < tdBody.length; j++) {
                tdBody[j].style.display = "none";
            }
        }
    }
}

function showMaladies(statut, type, id) {
    var maladies = document.getElementById("divMaladies" + id);
    var show = document.getElementById("show" + type + id);
    var hide = document.getElementById("hide" + type + id);
    if (statut) {
        maladies.style.display = "";
        show.style.display = "none";
        hide.style.display = "block";
    }
    else {
        maladies.style.display = "none";
        show.style.display = "";
        hide.style.display = "none";
    }
}

function searchPatients() {
    var filters = [];
    var inputs = [document.getElementById('searchNom'), document.getElementById('searchPrenom'),
    document.getElementById('pays'), document.getElementById('villes'), document.getElementById('maladies')]
    for (var i = 0; i < inputs.length; i++) {
        var value = inputs[i].value.toUpperCase();
        (value == '' && 0 <= i <= 1) ? value = "-1" : value;
        filters.push(value);
    }
    var url_string = window.location.pathname;
    var urlTab = url_string.split('/');
    if (urlTab[1] == 'patients') {
        tables = [document.getElementById("allPatients"), document.getElementById("currentPatients"),
        document.getElementById("oldPatients")];
    }
    else if (urlTab[1] == 'demandes') {
        tables = [document.getElementById("demandes")];
    }
    for (var t = 0; t < tables.length; t++) {
        tr = tables[t].getElementsByTagName("tr");
        if (filters.every(f => f == '-1')) {
            for (var i = 1; i < tr.length; i++) {
                tr[i].style.display = "";
            }
        }
        else {
            for (var i = 1; i < tr.length; i++) {
                td = tr[i].getElementsByTagName("td");
                var conditions = [];
                for (var j = 0; j < 5; j++) {
                    txtValue = td[j].textContent || td[j].innerText;
                    (txtValue.toUpperCase().indexOf(filters[j]) > -1 || filters[j] == '-1') ? conditions.push(true)
                        : conditions.push(false);
                }
                if (conditions.every(c => c)) {
                    tr[i].style.display = "";
                }
                else {
                    tr[i].style.display = "none";
                }
            }
        }
    }
}

function searchPatient() {
    var input = document.getElementById('searchNom');
    var value = input.value.toUpperCase();
    value == '' ? value = "-1" : value;
    var table = document.getElementById("dayValues");
    tr = table.getElementsByTagName("tr");
    for (var i = 1; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(value) > -1 || value == '-1') {
            tr[i].style.display = "";
        }
        else {
            tr[i].style.display = "none";
        }
    }
}

function addDesc(id) {
    var temp = document.getElementById(id);
    var desc = document.getElementById("desc-" + id);
    desc.style.display = "block";
}
function removeDesc(id) {
    var temp = document.getElementById(id);
    var desc = document.getElementById("desc-" + id);
    desc.style.display = "none";
}


function searchValeurAlert() {
    var table = document.getElementById("alerts");
    var inputMin = document.getElementById("dateValueMin");
    var dateBtn = document.getElementById("dateBtn");

    var tr = table.getElementsByTagName("tr");

    if (dateBtn.className == "btn-icon btn-success") {
        if (inputMin.value == '') {
            for (var i = 0; i < tr.length; i++) {
                tr[i].style.display = "";
            }
        }
        else {
            var dateMin = new Date(inputMin.value);
            for (var i = 1; i < tr.length; i++) {
                var td = tr[i].getElementsByTagName("td")[0];
                var txtValue = td.textContent || td.innerText;
                var date = new Date(txtValue);
                (date.getTime() == dateMin.getTime()) ? tr[i].style.display = "" : tr[i].style.display = "none";
            }
        }
    }
    else {
        var inputMax = document.getElementById("dateValueMax");
        if (inputMin.value == '' && inputMax.value == '') {
            for (var i = 0; i < tr.length; i++) {
                tr[i].style.display = "";
            }
        }
        else if (inputMin.value != '' && inputMax.value == '') {
            var dateMin = new Date(inputMin.value);
            for (var i = 1; i < tr.length; i++) {
                var td = tr[i].getElementsByTagName("td")[0];
                var txtValue = td.textContent || td.innerText;
                var date = new Date(txtValue);
                (date.getTime() >= dateMin.getTime()) ? tr[i].style.display = "" : tr[i].style.display = "none";
            }

        }
        else if (inputMin.value == '' && inputMax.value != '') {
            var dateMax = new Date(inputMax.value);
            for (var i = 1; i < tr.length; i++) {
                var td = tr[i].getElementsByTagName("td")[0];
                var txtValue = td.textContent || td.innerText;
                var date = new Date(txtValue);
                (date.getTime() <= dateMax.getTime()) ? tr[i].style.display = "" : tr[i].style.display = "none";
            }
        }
        else {
            var dateMax = new Date(inputMax.value);
            var dateMin = new Date(inputMin.value);
            for (var i = 1; i < tr.length; i++) {
                var td = tr[i].getElementsByTagName("td")[0];
                var txtValue = td.textContent || td.innerText;
                var date = new Date(txtValue);
                (dateMin.getTime() <= date.getTime() && date.getTime() <= dateMax.getTime()) ? tr[i].style.display = "" : tr[i].style.display = "none";
            }
        }
    }
}

function selectChoiceAlerts() {
    var table = document.getElementById("alerts");
    var idNames = ["temperature", "tensionSys", "tensionDia", "glucose", "oxygen"];
    var mesures = ["Temperature", "Tension systolique", "Tension diastolique", "Taux de glucose", "Taux d'oxygène"];
    var filters = [];
    var inputs = [];
    for (var i = 0; i < idNames.length; i++) {
        inputs[i] = document.getElementById(idNames[i]);
    }

    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].checked) {
            filters.push(mesures[i]);
            inputs[i].parentElement.parentElement.style.backgroundColor = "#34b3a0"
        }
        else {
            inputs[i].parentElement.parentElement.style.backgroundColor = "#d87474"
        }
    }
    var tr = table.getElementsByTagName("tr");
    for (var i = 1; i < tr.length; i++) {
        var td = tr[i].getElementsByTagName("td")[2];
        txtValue = td.textContent || td.innerText;
        if (filters.some(filter => txtValue.indexOf(filter) > -1)) {
            tr[i].style.display = "";
        }
        else {
            tr[i].style.display = "none";
        }
    }
}