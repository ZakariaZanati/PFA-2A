function search() {
    var table, tr, td, txtValue, index;
    var filters = [];
    var inputs = [document.getElementById('searchNom'), document.getElementById('searchPrenom'),
     document.getElementById('pays'), document.getElementById('villes'), document.getElementById('specialites')]
    for(var i = 0; i < inputs.length; i++) {
        var value = inputs[i].value.toUpperCase();
        (value == '' && 0<= i <=1) ? value = "-1" : value;
        filters.push(value);
    }
    tables = [document.getElementById("allMedecins"), document.getElementById("currentMedecins"), 
        document.getElementById("oldMedecins")];
    
    
    for(var t = 0; t < tables.length; t++) {
        tr = tables[t].getElementsByTagName("tr");
        if(filters.every(f => f == '-1')) {
            for(var i = 1; i < tr.length; i++) {
                tr[i].style.display = "";
            }
        }
        
        else {
            for(var i = 1; i < tr.length; i++) {
                td = tr[i].getElementsByTagName("td");
                
                var conditions = [];
                for(var j = 0; j < td.length - (t+1); j++) {
                    txtValue = td[j].textContent || td[j].innerText;
                    (txtValue.toUpperCase().indexOf(filters[j]) > -1 || filters[j] == '-1') ? conditions.push(true)
                                                                                            :conditions.push(false);
                }
                if(conditions.every(c => c)) {
                    tr[i].style.display = "";
                }
                else {
                    tr[i].style.display = "none";
                }
            }
        }
    }
    
    
}

