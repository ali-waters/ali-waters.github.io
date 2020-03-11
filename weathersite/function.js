"use strict";
var pageNav = document.querySelector('#page-nav');
var statusContainer = document.querySelector('#status');
var contentContainer = document.querySelector('#main-content');

var locStore = window.localStorage;
var sessStore = window.sessionStorage;

document.addEventListener("DOMContentLoaded", function(){
    let condition ="/clear";
    // buildModDate();
    // const menuButton = document.querySelector("#menuBtn");
    // menuButton.addEventListener('click', mobileMenu);
    // Variables for Wind Chill function
    //let temp = 31;
   // let speed = 5;
    buildWC(speed,temp);

    let d = new Date();
    let hour = d.getHours() % 12;
    console.log(hour);
    timeBall(hour);
})

//This is for the calculation of wind chill temp//
function buildWC(speed, temp) {


let feelTemp = document.getElementById('feelTemp');

let wc = 35.74 + 0.6215 * temp - 35.75 * Math.pow(speed, 0.16) + 0.4275 * temp * Math.pow(speed, 0.16);
 console.log(wc);

 wc = Math.floor(wc);

 //if chill is greater than temp, return to temp//
 wc = (wc > temp) ? temp :wc;

 console.log(wc);
feelTemp.innerHTML = wc;
}

//this new function will make a time//
function timeBall(hour){

    let x = document.querySelectorAll(".ball");
    for (let item of x) {
        console.log(item);
        item.classList.remove("ball");
    }
    
    // Find all hours that match the parameter and add the "ball" class//
    let hr = document.querySelectorAll(".i"+hour);
    console.log(".i"+hour);
    for (let item of hr){
        item.classList.add("ball");
    }
}


// display background image//
function changeSummaryImage(condition){
    let container = document.querySelector(".flex-container")
 
    console.log(condition);
    container.classList.add(condition)
}

//get location for local JSON execution//
var cityLoc = document.getElementsByTagName("body") [0].getAttribute("data-city");


//get weather data for cities//
if (cityLoc !=null) {
    let weatherURL = "";
    fetchWeatherData(weatherURL);
}


//fetch local weather data//
function fetchWeatherData(weatherURL) {
//let cityName= 'Preston';
fetch(weatherURL)
 .then(function (response) {
   if (response.ok) {
     return response.json();
   }
   throw new ERROR('Network response was not OK.');
 })
 .then(function (data) {
     //check the object that was retrieved//
     console.log(data);
    
     let p = data[cityLoc];

//get content and location info//
let locName = p.properties.relativeLocation.properties.city;
let locState = p.properties.relativeLocation.properties.state;
//put them together//
let fullName = locName + ',' + locState;
console.log(`fullName is: ${fullName}`);

//get latitude and longitude//
const latLong = p.properties.relativeLocation.geometry.coordinates[1] + "," + p.properties.relativeLocation.geometry.coordinates[0];
console.log(latLong);

let cityData = JSON.stringify({
    fullName,
    latLong
    });
    let dataLabel = cityLoc + "," + locState;
    localStorage.setItem(dataLabel, cityData);

    sessStore.setItem("fullName", fullName);
    sessStore.setItem("latLong", latLong);

    //get current conditions info//
    sessStore.setItem("temperature", p.properties.relativeLocation.properties.temperature);
    sessStore.setItem("highTemp",  p.properties.relativeLocation.properties.highTemp);
    sessStore.setItem("lowTemp",  p.properties.relativeLocation.properties.lowTemp);

    //wind data//
    sessStore.setItem("windSpeed", p.properties.relativeLocation.properties.windSpeed);
    sessStore.setItem("windGust", p.properties.relativeLocation.properties.windGust);


//get hourly data//
getHourly(p.properties.forecastHourly);
function getHourly(URL) {
    fetch(URL)
    .then(function (response) {
        if (response.ok) {
            return response.json();
        }
        throw new ERROR('Response not OK.');
    })
    .then(function (data) {
        console.log('Data from getHourly function:');
        console.log(data);
    
        //store 12 hours of data session storage//
        var hourData = [];
let todayDate = new Date();
var nowHour = todayDate.getHours();
console.log('nowHour is ${nowHour}');
for (let i = 0, x = 11; i <= x; i++) {
    if (nowHour < 24) {
        hourData[nowHour] = data.properties.periods[i].temperature + "," + data.properties.periods[i].windspeed + "," + data.properties.periods[i].icon;
        sessStore.setItem('hour${nowHour}', hourData[nowHour]);
        nowHour++;
    } else {
        nowHour = nowHour - 12;
        hourData[nowHour] = data.properties.periods[i].temperature + "," + data.properties.periods[i].windspeed + "," + data.properties.periods[i].icon;
        sessStore.setItem('hour${nowHour}', hourData[nowHour]);
        nowHour = 1;
    }
}
 
//get the shortforecast value//
//this will be the condtion for background img//
sessStore.setItem('shortForecast', data.properties.periods[0].shortForecast);

//call the buildPage function//
buildPage();
    })
.catch(error => console.log('There was a getHourly error:', error))
}

//build the weather page//
function buildPage() {
    let pageTitle = document.querySelector('#page-title');
    let fullNameNode = document.createTextNode(sessStore/getItem('fullName'));
    pageTitle.insertBefore(fullNameNode, pageTitle.childNodes[0]);
//get the h1 to display city location//
let contentHeading = document.querySelector('#contentHeading');
contentHeading.innerHTML = sessStore.getItem('fullName');
//get coordinates for location//
let latlong = document.querySelector('#latLong');
latLong.innerHTML = sessStore.getItem('latLong');

//get condition keyword and set background pic//
changeSummaryImage(sessStore.getItem('shortForecast'));

//set the temp information//
let highTemp = $('.high');
let loTemp = $('.loTemp');
let currentTemp = $('.current');
let feelTemp = $('.feelTemp');
highTemp.innerHTML = sessStore.getItem('highTemp') + "°F";
loTemp.innerHTML = sessStore.getItem('lowTemp') + "°F";
currentTemp.innerHTML = sessStore.getItem('temperature') + "°F";

//set the wind information//
let speed = $('#speed');
let gust = $('#gusting');
speed.innerHTML = sessStore.getItem('windSpeed');
gust.innerHTML = sessStore.getItem('windGust');

//calculate the feel like temp//
feelTemp.innerHTML = buildWC(sessStore.getItem('windspeed'), sessStore.getItem('temperature')) + "°F";
//set time indicators//
let thisDate = new Date();
var currentHour = thisDate.getHours();
let indicatorHour;
if (currentHour > 12) {
    indicatorHour = currentHour - 12;
} else {
    indicatorHour = currentHour;
};
console.log(`Current hour in the time indicator is: ${currentHour}`);
//set indicator//
timeIndicator(indicatorHour);

//hourly temp component//
let currentData = [];
let tempHour = currentHour;
//adjust based on current time//
for (let i = 0, x = 12; i < x; i++) {
    if (tempHour <= 23) {
        currentData[i] = sessStore.getItem('hour' + tempHour).split(",");
        tempHour++;
    } else {
        tempHour = tempHour - 12;
        currentData[i] = sessStore.getItem('hour' + tempHour).split(",");
        console.log(`CurrentData[i][0] is: ${currentData[i][0]}`);
        tempHour = 1;
    }
}
console.log(currentData);
//loop through array inserting data//
tempHour = currentHour;
for (let i = 0, x = 12; i <x; i++) {
    if (tempHour >= 13) {
        tempHour = tempHour - 12;
    }
    console.log(`Start container is: #temps o.${tempHour}`);
    $('#temps .o' + tempHour).innerHTML = currentData[i][0];
    tempHour++;
}

//hourly wind component//
let windArray = [];
let windHour = currentHour;
for (let i = 0, x = 12; i < x; i++) {
    if (windHour <= 23) {
        window.Array[i] = currentData[i][1].split(" ");
        console.log(`windArray[i] is: ${windArray[i]}`);
        windHour++;
    } else {
        windHour = windHour - 12;
        windArray[i] = currentData[i][1].split(" ");
        windHour = 1;
       }
      }
      console.log(windArray);
      
      // Insert Wind data
      // Start with the outer container that matchs the time indicator
      windHour = currentHour;
      for (let i = 0, x = 12; i < x; i++) {
       if (windHour >= 13) {
        windHour = windHour - 12;
       }
       $('#winds .o' + windHour).innerHTML = windArray[i][0];
       windHour++;
      }
      
      //condition component//
      let conditionHour = currentHour;
// Adjust counter based on current time
for (let i = 0, x = 12; i < x; i++) {
 if (conditionHour >= 13) {
  conditionHour = conditionHour - 12;
 }
 $('#condition .o' + conditionHour).innerHTML = '<img src="' + currentData[i][2] + '" alt="hourly weather condition image">';
 conditionHour++;
}
    


    .catch(function(error){
    console.log('There was a fetch problem: ', error.message);
 });

 //change status of containers//
 contentContainer.setAttribute('class', '');
 statusContainer.setAttribute('class', 'hide');
}
