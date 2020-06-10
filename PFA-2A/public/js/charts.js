var t = document.getElementById('T').getContext('2d');
var o2 = document.getElementById('O2').getContext('2d');
var td = document.getElementById('TD').getContext('2d');
var ts = document.getElementById('TS').getContext('2d');
var tg = document.getElementById('TG').getContext('2d');
var tabrow = document.getElementsByClassName("tabrow");
var arrT = [], arrL = [], arrD = [], arrO = [], arrTS = [], arrTD = [], arrTG = [];
for (var i = 0; i < 10; i++) {
    arrT[i] = [];
    arrTS[i] = [];
    arrTD[i] = [];
    arrTG[i] = [];
    arrO[i] = [];
}
var i = 0;
for (var j = 0; j < tabrow.length; j++) {
    if (j == 0) {
        arrD.push(tabrow[0].cells[0].innerText);
    }
    else {
        if (tabrow[j].cells[0].innerText == tabrow[j - 1].cells[0].innerText) {
            i++;
        } else {
            i = 0;
            while (arrT[0].length != arrT[1].length) {
                arrT[1].push(0);
                arrO[1].push(0);
                arrTS[1].push(0);
                arrTD[1].push(0);
                arrTG[1].push(0);
            }
            arrD.push(tabrow[j].cells[0].innerText);
        }
    }
    if (tabrow[j].cells[2].innerText != "") {
        arrT[i].push(tabrow[j].cells[2].innerText);
        arrO[i].push(tabrow[j].cells[5].innerText);
        arrTS[i].push(tabrow[j].cells[3].innerText);
        arrTD[i].push(tabrow[j].cells[4].innerText);
        arrTG[i].push(tabrow[j].cells[6].innerText);
    }
    else {
        arrT[i].push(tabrow[j].cells[2].childNodes[1].value);
        arrTS[i].push(tabrow[j].cells[3].childNodes[1].value);
        arrTD[i].push(tabrow[j].cells[4].childNodes[1].value);
        arrTG[i].push(tabrow[j].cells[6].childNodes[1].value);
        arrO[i].push(tabrow[j].cells[5].childNodes[1].value);
    }
}

var myChart = new Chart(t, {
    type: 'bar',
    data: {
        labels: arrD,
        datasets: [{
            data: arrT[0],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 1
        }, {
            backgroundColor: 'rgba(99, 255, 132, 0.2)',
            borderColor: 'rgba(99, 255, 132, 1)',
            borderWidth: 1,
            data: arrT[1]
        }, {
            backgroundColor: 'blue',
            borderColor: 'rgba(99, 255, 132, 1)',
            borderWidth: 1,
            data: arrT[2]
        }]
    },
    options: {
        legend: {
            display: false
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }],
            xAxes: [{
                barPercentage: 1,
                categoryPercentage: 0.4
            }]
        }
    }
});

var myChart = new Chart(o2, {
    type: 'bar',
    data: {
        labels: arrD,
        datasets: [{
            data: arrO[0],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 1
        }, {
            backgroundColor: 'rgba(99, 255, 132, 0.2)',
            borderColor: 'rgba(99, 255, 132, 1)',
            borderWidth: 1,
            data: arrO[1]
        }, {
            backgroundColor: 'blue',
            borderColor: 'rgba(99, 255, 132, 1)',
            borderWidth: 1,
            data: arrO[2]
        }]
    },
    options: {
        legend: {
            display: false
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }],
            xAxes: [{
                barPercentage: 1,
                categoryPercentage: 0.4
            }]
        }
    }
});
var myChart = new Chart(td, {
    type: 'bar',
    data: {
        labels: arrD,
        datasets: [{
            data: arrTD[0],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 1
        }, {
            backgroundColor: 'rgba(99, 255, 132, 0.2)',
            borderColor: 'rgba(99, 255, 132, 1)',
            borderWidth: 1,
            data: arrTD[1]
        }, {
            backgroundColor: 'blue',
            borderColor: 'rgba(99, 255, 132, 1)',
            borderWidth: 1,
            data: arrTD[2]
        }]
    },
    options: {
        legend: {
            display: false
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }],
            xAxes: [{
                barPercentage: 1,
                categoryPercentage: 0.4
            }]
        }
    }
});
var myChart = new Chart(ts, {
    type: 'bar',
    data: {
        labels: arrD,
        datasets: [{
            data: arrTS[0],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 1
        }, {
            backgroundColor: 'rgba(99, 255, 132, 0.2)',
            borderColor: 'rgba(99, 255, 132, 1)',
            borderWidth: 1,
            data: arrTS[1]
        }, {
            backgroundColor: 'blue',
            borderColor: 'rgba(99, 255, 132, 1)',
            borderWidth: 1,
            data: arrTS[2]
        }]
    },
    options: {
        legend: {
            display: false
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }],
            xAxes: [{
                barPercentage: 1,
                categoryPercentage: 0.4
            }]
        }
    }
});
var myChart = new Chart(tg, {
    type: 'bar',
    data: {
        labels: arrD,
        datasets: [{
            data: arrTG[0],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 1
        }, {
            backgroundColor: 'rgba(99, 255, 132, 0.2)',
            borderColor: 'rgba(99, 255, 132, 1)',
            borderWidth: 1,
            data: arrTG[1]
        }, {
            backgroundColor: 'blue',
            borderColor: 'rgba(99, 255, 132, 1)',
            borderWidth: 1,
            data: arrTG[2]
        }]
    },
    options: {
        legend: {
            display: false
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }],
            xAxes: [{
                barPercentage: 1,
                categoryPercentage: 0.4
            }]
        }
    }
});

