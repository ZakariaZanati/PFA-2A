// var t = document.getElementById('T').getContext('2d');
// var o2 = document.getElementById('O2').getContext('2d');
// var td = document.getElementById('TD').getContext('2d');
// var ts = document.getElementById('TS').getContext('2d');
// var tg = document.getElementById('TG').getContext('2d');
var arrT = [], arrL = [], arrD = [], arrO = [], arrTS = [], arrTD = [], arrTG = [];
var arrDayT = [], arrDayTD = [], arrDayTS = [], arrDayO = [], arrDayTG = [];
var arrMonT = [], arrMonTD = [], arrMonTS = [], arrMonO = [], arrMonTG = [], arrDMon = [];
var tabrow = document.getElementsByClassName("tabrow");


function getMoyDay() {
    arrDayT = [], arrDayTD = [], arrDayTS = [], arrDayO = [], arrDayTG = [];
    getData();
    var cpt;
    for (var i = 0; i < arrD.length; i++) {
        cpt = 0;
        for (var j = 0; j < arrT.length; j++) {
            if (arrT[j][i] != 0) {
                cpt++;
            }
        }
        arrDayT.push((parseFloat(arrT[0][i]) + parseFloat(arrT[1][i]) + parseFloat(arrT[2][i]) + parseFloat(arrT[3][i])) / cpt);
        arrDayTS.push((parseFloat(arrTS[0][i]) + parseFloat(arrTS[1][i]) + parseFloat(arrTS[2][i]) + parseFloat(arrTS[3][i])) / cpt);
        arrDayTD.push((parseFloat(arrTD[0][i]) + parseFloat(arrTD[1][i]) + parseFloat(arrTD[2][i]) + parseFloat(arrTD[3][i])) / cpt);
        arrDayTG.push((parseFloat(arrTG[0][i]) + parseFloat(arrTG[1][i]) + parseFloat(arrTG[2][i]) + parseFloat(arrTG[3][i])) / cpt);
        arrDayO.push((parseFloat(arrO[0][i]) + parseFloat(arrO[1][i]) + parseFloat(arrO[2][i]) + parseFloat(arrO[3][i])) / cpt);
    }
}
function getMoyMonth() {
    arrMonT = [], arrMonTD = [], arrMonTS = [], arrMonO = [], arrMonTG = [], arrDMon = [];
    getMoyDay();
    var cpt = 1, sumT = 0, sumTS = 0, sumTD = 0, sumTG = 0, sumO = 0;
    var month = [];
    sumT = arrDayT[0];
    sumTS = arrDayTS[0];
    sumTD = arrDayTD[0];
    sumTG = arrDayTG[0];
    sumO = arrDayO[0];
    arrDMon.push(arrD[0].substr(0, 5));
    for (var i = 0; i < arrD.length - 1; i++) {
        if (arrD[i].substr(0, 5) == arrD[i + 1].substr(0, 5)) {
            sumT += parseFloat(arrDayT[i + 1]);
            sumTS += parseFloat(arrDayTS[i + 1]);
            sumTD += parseFloat(arrDayTD[i + 1]);
            sumTG += parseFloat(arrDayTG[i + 1]);
            sumO += parseFloat(arrDayO[i + 1]);
            cpt++;
        } else {
            arrMonT.push(sumT / cpt);
            arrMonTS.push(sumTS / cpt);
            arrMonTD.push(sumTD / cpt);
            arrMonTG.push(sumTG / cpt);
            arrMonO.push(sumO / cpt);
            cpt = 1;
            sumT = parseFloat(arrT[i + 1]);
            arrDMon.push(arrD[i + 1].substr(0, 5));
        }

    }
    if (cpt > 1) {
        arrMonT.push(sumT / cpt);
        arrMonTS.push(sumTS / cpt);
        arrMonTD.push(sumTD / cpt);
        arrMonTG.push(sumTG / cpt);
        arrMonO.push(sumO / cpt);
    }
    else {
        arrDMon.push(arrD[arrD.length - 1].substr(0, 5));
        arrMonT.push(arrDayT[arrD.length - 1]);
        arrMonTS.push(arrDayTS[arrD.length - 1]);
        arrMonTD.push(arrDayTD[arrD.length - 1]);
        arrMonTG.push(arrDayTG[arrD.length - 1]);
        arrMonO.push(arrDayO[arrD.length - 1]);
    }
}
function createChart(title, type, id, arr) {
    var t = document.getElementById(id).getContext('2d');
    var myChart = new Chart(t, {
        type: type,
        data: {
            labels: arr,
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
                        beginAtZero: true
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
            arrD.push(tabrow[0].cells[0].innerText.trim().substr(2));
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
                arrD.push(tabrow[j].cells[0].innerText.trim().substr(2));
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
function setData(arr, chart) {


    if (!arr[0][0]) {
        console.log("not");
        var data = {
            data: arr,
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1
        }
        chart.data.datasets.push(data);
        console.log(data);
    }
    else {
        console.log('else');
        for (var i = 0; i < arr.length; i++) {
            var data = {
                data: arr[i],
                backgroundColor: [],
                borderColor: [],
                borderWidth: 1
            }
            chart.data.datasets.push(data);
        }
    }
}

var cs;
var T;
if (cs = document.getElementById("chartSelect")) {

    cs.addEventListener('change', function () {
        getData();
        document.getElementById("canvas").style.display = "block";
        document.getElementById("canvas").parentElement.style.justifyContent = "center";
        if (typeof T == "object")
            T.destroy();
        if (cs.value == "Température") {
            T = createChart(cs.value + " (C) ", "bar", "T", arrD);
            setData(arrT, T);
            changeCol(T, 36.5, 37.5);
            T.update();
        }
        else if (cs.value == "Tension Systolique") {
            T = createChart(cs.value, "bar", "T", arrD);
            setData(arrTS, T);
            changeCol(T, 110, 140);
            T.update();
        }
        else if (cs.value == "Tension Diastolique") {
            T = createChart(cs.value, "bar", "T", arrD);
            setData(arrTD, T);
            changeCol(T, 70, 90);
            T.update();
        } else if (cs.value == "Saturation O2") {
            T = createChart("Saturation O2", "bar", "T", arrD);
            setData(arrO, T);
            changeCol(T, 95, 100);
            T.update();
        }
        else if (cs.value == "Glycémie") {
            T = createChart("Glycémie", "bar", "T");
            setData(arrTG, T);
            changeCol(T, 0.7, 1.8);
            T.update();
        }
        else {
            document.getElementById("canvas").style.display = "none";
            document.getElementById("canvas").parentElement.style.justifyContent = "flex-end";
        }

    })
}
var csd;
if (csd = document.getElementById("chartSelectDay")) {

    csd.addEventListener('change', function () {

        getMoyDay();
        document.getElementById("canvas").style.display = "block";
        if (typeof T == "object")
            T.destroy();
        if (csd.value == "Température") {
            T = createChart(csd.value + " (C) ", "line", "TD", arrD);
            setData(arrDayT, T);
            changeCol(T, 36.5, 37.5);
            T.update();
        }
        else if (csd.value == "Tension Systolique") {
            T = createChart(csd.value, "line", "TD", arrD);
            setData(arrDayTS, T);
            changeCol(T, 110, 140);
            T.update();
        }
        else if (csd.value == "Tension Diastolique") {
            T = createChart(csd.value, "line", "TD", arrD);
            setData(arrDayTD, T);
            changeCol(T, 70, 90);
            T.update();
        } else if (csd.value == "Saturation O2") {
            T = createChart("Saturation O2", "line", "TD", arrD);
            setData(arrDayO, T);
            changeCol(T, 95, 100);
            T.update();
        }
        else if (csd.value == "Glycémie") {
            T = createChart("Glycémie", "line", "TD", arrD);
            setData(arrDayTG, T);
            changeCol(T, 0.7, 1.8);
            T.update();
        }
        else {
            document.getElementById("canvas").style.display = "none";
            document.getElementById("canvas").parentElement.style.justifyContent = "flex-end";
        }

    })
}
var csm;
var TM;
if (csm = document.getElementById("chartSelectMonth")) {
    csm.addEventListener('change', function () {
        console.log("change");
        getMoyMonth();
        document.getElementById("canvasMonth").style.display = "block";
        if (typeof TM == "object")
            TM.destroy();
        if (csm.value == "Température") {
            TM = createChart(csm.value + " (C) ", "line", "TM", arrDMon);
            setData(arrMonT, TM);
            changeCol(TM, 36.5, 37.5);
            TM.update();
        }
        else if (csm.value == "Tension Systolique") {
            TM = createChart(csm.value, "line", "TM", arrDMon);
            setData(arrMonTS, TM);
            changeCol(TM, 110, 140);
            TM.update();
        }
        else if (csm.value == "Tension Diastolique") {
            TM = createChart(csm.value, "line", "TM", arrDMon);
            setData(arrMonTD, TM);
            changeCol(TM, 70, 90);
            TM.update();
        } else if (csm.value == "Saturation O2") {
            TM = createChart("Saturation O2", "line", "TM", arrDMon);
            setData(arrDayO, TM);
            changeCol(TM, 95, 100);
            TM.update();
        }
        else if (csm.value == "Glycémie") {
            TM = createChart("Glycémie", "line", "TM", arrDMon);
            setData(arrMonTG, TM);
            changeCol(TM, 0.7, 1.8);
            TM.update();
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
