// var t = document.getElementById('T').getContext('2d');
// var o2 = document.getElementById('O2').getContext('2d');
// var td = document.getElementById('TD').getContext('2d');
// var ts = document.getElementById('TS').getContext('2d');
// var tg = document.getElementById('TG').getContext('2d');
var arrT = [], arrL = [], arrD = [], arrO = [], arrTS = [], arrTD = [], arrTG = [], arrDayM = [];

var tabrow = document.getElementsByClassName("tabrow");
function createChart(title, type, id) {
    var t = document.getElementById(id).getContext('2d');
    var myChart = new Chart(t, {
        type: type,
        data: {
            labels: arrD,
            datasets: []
        },
        options: {
            // title: {
            //     display: true,
            //     text: title
            // },
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: title
                    },
                    ticks: {
                        beginAtZero: false
                    }
                }],
                xAxes: [{
                    gridLines: {
                        display: false
                    },
                    barPercentage: 1,
                    categoryPercentage: 0.8
                }]
            }
        }
    });
    return myChart;
}
function getData() {
    arrT = [], arrL = [], arrD = [], arrO = [], arrTS = [], arrTD = [], arrTG = [];
    for (var i = 0; i < 4; i++) {
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
                while (arrT[0].length != arrT[2].length) {
                    arrT[2].push(0);
                    arrO[2].push(0);
                    arrTS[2].push(0);
                    arrTD[2].push(0);
                    arrTG[2].push(0);
                }
                while (arrT[0].length != arrT[3].length) {
                    arrT[3].push(0);
                    arrO[3].push(0);
                    arrTS[3].push(0);
                    arrTD[3].push(0);
                    arrTG[3].push(0);
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
}
function setData(arr) {
    for (var i = 0; i < arr.length; i++) {
        var data = {
            data: arr[i],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1
        }
        T.data.datasets.push(data);
    }
}

var cs;
var T;
if (cs = document.getElementById("chartSelect")) {
    cs.addEventListener('change', function () {
        getData();
        document.getElementById("canvas").style.display = "block";
        document.getElementById("canvas").parentElement.style.justifyContent = "space-around";
        console.log("change");
        if (typeof T == "object")
            T.destroy();
        if (cs.value == "Température") {
            T = createChart(cs.value + " (C) ", "bar", "T");
            setData(arrT);
            changeCol(T, 36.5, 37.5);
            T.update();
        }
        else if (cs.value == "Tension Systolique") {
            T = createChart(cs.value, "bar", "T");
            setData(arrTS);
            changeCol(T, 110, 140);
            T.update();
        }
        else if (cs.value == "Tension Diastolique") {
            T = createChart(cs.value, "bar", "T");
            setData(arrTD);
            changeCol(T, 70, 90);
            T.update();
        } else if (cs.value == "Saturation O2") {
            T = createChart("Saturation O2", "bar", "T");
            setData(arrO);
            changeCol(T, 95, 100);
            T.update();
        }
        else if (cs.value == "Glycémie") {
            T = createChart("Glycémie", "bar", "T");
            setData(arrTG);
            changeCol(T, 0.7, 1.8);
            T.update();
        }
        else {
            document.getElementById("canvas").style.display = "none";
            document.getElementById("canvas").parentElement.style.justifyContent = "flex-end";
        }

    })
}

function changeCol(chart, min, max) {
    for (var j = 0; j < chart.data.datasets.length; j++) {
        var dataset = chart.data.datasets[j];
        for (var i = 0; i < dataset.data.length; i++) {
            if (dataset.data[i] < min || dataset.data[i] > max) {
                dataset.backgroundColor.push("#d87474");
            } else {
                dataset.backgroundColor.push("#34b3a0");
            }
            dataset.borderColor.push("white");
        }
    }
}