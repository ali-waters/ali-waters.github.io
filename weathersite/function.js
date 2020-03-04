document.addEventListener("DOMContentLoaded", function(){
    let condition ="/clear";
    // buildModDate();
    // const menuButton = document.querySelector("#menuBtn");
    // menuButton.addEventListener('click', mobileMenu);
    // Variables for Wind Chill function
    let temp = 31;
    let speed = 5;
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
    
    // Find all hours that match the parameter and add the "ball" class
    let hr = document.querySelectorAll(".i"+hour);
    console.log(".i"+hour);
    for (let item of hr){
        item.classList.add("ball");
    }
}


// display background image
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

//