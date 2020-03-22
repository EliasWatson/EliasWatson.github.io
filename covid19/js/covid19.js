"use strict";

const storeWhitelist = "COVID19-Whitelist";
const storeCountries = "COVID19-Countries";
const storeRawLinear = "COVID19-Raw-Linear";

let dataCache = undefined;
let ignoreUpdate = false;
let rawChart = undefined;

$(document).ready(_ => {
    if (!localStorage.getItem(storeWhitelist)) localStorage.setItem(storeWhitelist, "Blacklist");
    if (!localStorage.getItem(storeCountries)) localStorage.setItem(storeCountries, "[]");
    if (!localStorage.getItem(storeRawLinear)) localStorage.setItem(storeRawLinear, "Linear");

    $("#whitelistPicker").selectpicker("val", localStorage.getItem(storeWhitelist));
    $("#rawLogPicker").selectpicker("val", localStorage.getItem(storeRawLinear));

    updateCanvasSize();
    $(window).on("resize", updateCanvasSize);

    let rawContext = $("#rawChart")[0].getContext("2d");
    rawChart = new Chart(rawContext, {
        type: "line",
        data: {
            labels: [], datasets: [
                {label: "Deaths", data: [], borderColor: ["#de0b00"], backgroundColor: ["#de746f"]},
                {label: "Recovered", data: [], borderColor: ["#1ede00"], backgroundColor: ["#7ede6f"]},
                {label: "Infected", data: [], borderColor: ["#0076df"], backgroundColor: ["#6faade"]}
            ]
        },
        options: {responsive: false, scales: {yAxes: [{type: localStorage.getItem(storeRawLinear).toLowerCase()}]}}
    });
    $("#rawLogPicker").on("changed.bs.select", (_, i) => {
        const type = (i === 0) ? "Linear" : "Logarithmic";
        localStorage.setItem(storeRawLinear, type);
        rawChart.options.scales.yAxes[0].type = type.toLowerCase();
        rawChart.update();
    });

    downloadStats();

    $("#whitelistPicker").on("changed.bs.select", (_, i) => {
        localStorage.setItem(storeWhitelist, (i === 1) ? "Whitelist" : "Blacklist");
        updateDashboard();
    });

    $("#countryPicker").on("changed.bs.select", _ => {
        if (ignoreUpdate) {
            ignoreUpdate = false;
            return;
        }
        const val = $("#countryPicker").selectpicker("val");
        localStorage.setItem(storeCountries, JSON.stringify(val));
        updateDashboard();
    });

    $("#datePicker").datepicker().on("changeDate", updateDashboard);
});

function downloadStats() {
    $.get("https://coronavirus-tracker-api.herokuapp.com/v2/locations?timelines=1", "", data => {
        dataCache = data;
        $("#datePicker").datepicker("update", new Date());
        updateDashboard();
        $("#lastUpdated").text(`Last updated ${new Date().toLocaleString("en-US")}`);
    });
    setTimeout(downloadStats, 60 * 60 * 1000);
}

function updateDashboard() {
    if (dataCache === undefined) return;

    let currentDateObj = $("#datePicker").datepicker("getDate");
    currentDateObj.setDate(currentDateObj.getDate() - 1);
    const currentDate = isoToDate(currentDateObj.toISOString());

    let whitelist = localStorage.getItem(storeWhitelist) === "Whitelist";
    let selectedCountries = JSON.parse(localStorage.getItem(storeCountries));
    let countries = new Set();
    let timeline = new Map();

    const addToTimeline = (statTimeline, statKey) => {
        Object.keys(statTimeline).forEach(day => {
            const dayKey = isoToDate(day);
            if (Date.parse(dayKey) > Date.parse(currentDate)) return;
            if (!timeline.has(dayKey)) timeline.set(dayKey, {infected: 0, deaths: 0, recovered: 0});
            let dayStats = timeline.get(dayKey);
            dayStats[statKey] += statTimeline[day];
            timeline.set(dayKey, dayStats);
        });
    };

    dataCache.locations.forEach(loc => {
        countries.add(loc.country);
        if ((whitelist && selectedCountries.includes(loc.country)) || (!whitelist && !selectedCountries.includes(loc.country))) {
            addToTimeline(loc.timelines.confirmed.timeline, "infected");
            addToTimeline(loc.timelines.deaths.timeline, "deaths");
            addToTimeline(loc.timelines.recovered.timeline, "recovered");
        }
    });

    const countryPicker = $("#countryPicker");
    countryPicker.html("");
    Array.from(countries).sort().forEach(country => countryPicker.append(`<option>${country}</option>`));
    ignoreUpdate = true;
    countryPicker.selectpicker("val", selectedCountries);
    countryPicker.selectpicker("refresh");

    const currentStats = timeline.get(currentDate);
    $(".stat-infected").text(`${currentStats.infected.toLocaleString()}`);
    $(".stat-deaths").text(`${currentStats.deaths.toLocaleString()}`);
    $(".stat-recovered").text(`${currentStats.recovered.toLocaleString()}`);

    // const mortalityRate = (totalDeaths / (totalDeaths + totalRecovered)) * 100;
    const mortalityRate = (currentStats.deaths / currentStats.infected) * 100;
    $(".stat-mortality").text(`${mortalityRate.toLocaleString()}%`);

    updateRawChart(timeline);
}

function updateRawChart(timeline) {
    rawChart.data.labels = [];

    const rawChartInfected = rawChart.data.datasets.find(dataset => dataset.label === "Infected");
    rawChartInfected.data = [];
    const rawChartDeaths = rawChart.data.datasets.find(dataset => dataset.label === "Deaths");
    rawChartDeaths.data = [];
    const rawChartRecovered = rawChart.data.datasets.find(dataset => dataset.label === "Recovered");
    rawChartRecovered.data = [];

    const days = Array.from(timeline.keys()).sort();
    days.forEach(day => {
        rawChart.data.labels.push(day);
        const stats = timeline.get(day);
        rawChartInfected.data.push(stats.infected);
        rawChartDeaths.data.push(stats.deaths);
        rawChartRecovered.data.push(stats.recovered);
    });

    rawChart.update();
}

function updateCanvasSize() {
    $("canvas").each((_, canvas) => {
        canvas.style.width = "100%";
        canvas.style.height = `${(canvas.offsetWidth / 16) * 9}px`;
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    });

    if (rawChart !== undefined) rawChart.update();
}

function isoToDate(iso) {
    return iso.match(/(\d+-\d+-\d+).+/)[1];
}