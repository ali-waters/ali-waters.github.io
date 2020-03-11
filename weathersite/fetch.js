var url = "json";
var sessStore = window.sessionStorage;

function getWeatherData(url) {
    fetch(url)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            throw new ERROR('Network response was not OK.');
        })
        .then(function (data) {
            let cityName = data.Preston.properties.relativeLocation.properties.city;
            console.log(cityName);
            sessStore.setItem("cityName", cityName);
            document.getElementsByTagName("h1")[0].innerHTML = sessStore.getItem("cityName");

            let hourURL = data.Preston.properties.forecastHourly;
            getHourly(hourURL);
    })
        .catch(function (error) {
        console.log('There was a fetch problem: ', error.message);
    })
    }

getWeatherData(url);


//get hourly data from NWs//
function.getHourly(URL) {
    fetch(URL)
     .then(function (response) {
         if (response.ok)
     })
}


//store 12 hrs//
var hourData = [];
let todayDate = new Date();
var nowHour = todayDate.getHours();



//get the shortforecast from first hour//
//this will be condition keyword for seting the background image//
sessStore.setItem('shortForecast', data.properties.periods[0].shortForecast);


//build the page//
buildPage();
