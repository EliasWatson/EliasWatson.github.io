const storeWhitelist = "COVID19-Whitelist";
const storeCountries = "COVID19-Countries";

let dataCache = undefined;
let ignoreUpdate = false;

$(document).ready(_ => {
    if (!localStorage.getItem(storeWhitelist)) localStorage.setItem(storeWhitelist, "Blacklist");
    if (!localStorage.getItem(storeCountries)) localStorage.setItem(storeCountries, "[]");

    $("#whitelistPicker").selectpicker("val", localStorage.getItem(storeWhitelist));

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
});

function downloadStats() {
    $.get("https://coronavirus-tracker-api.herokuapp.com/v2/locations", "", data => {
        dataCache = data;
        console.log(dataCache);
        updateDashboard();
    });
}

function updateDashboard() {
    if (dataCache === undefined) return;

    let whitelist = localStorage.getItem(storeWhitelist) === "Whitelist";
    let selectedCountries = JSON.parse(localStorage.getItem(storeCountries));
    let countries = new Set();

    let totalInfected = 0;
    let totalDeaths = 0;
    let totalRecovered = 0;
    dataCache.locations.forEach(loc => {
        countries.add(loc.country);

        if ((whitelist && selectedCountries.includes(loc.country)) || (!whitelist && !selectedCountries.includes(loc.country))) {
            totalInfected += loc.latest.confirmed;
            totalDeaths += loc.latest.deaths;
            totalRecovered += loc.latest.recovered;
        }
    });

    const countryPicker = $("#countryPicker");
    countryPicker.html("");
    Array.from(countries).sort().forEach(country => countryPicker.append(`<option>${country}</option>`));
    ignoreUpdate = true;
    countryPicker.selectpicker("val", selectedCountries);
    countryPicker.selectpicker("refresh");

    $(".stat-infected").text(`${totalInfected.toLocaleString()}`);
    $(".stat-deaths").text(`${totalDeaths.toLocaleString()}`);
    $(".stat-recovered").text(`${totalRecovered.toLocaleString()}`);

    const mortalityRate = (totalDeaths / (totalDeaths + totalRecovered)) * 100;
    $(".stat-mortality").text(`${mortalityRate.toLocaleString()}%`);
}