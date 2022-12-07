let searchBtn = document.getElementById("search-btn");
let searchBox = document.getElementById("city-search");
let cityName = document.getElementById("city-name");
let curWeatherDate = document.getElementById("curr-date");
let currentConditions = document.getElementById("current-conditions");
let currentHumidity = document.getElementById("current-humid");
let currentTemperature = document.getElementById("current-temp");
let currentWindSpeed = document.getElementById("current-wind");
let currentIcon = document.getElementById("current-icon");
let currentMain = document.getElementById("current-main");
let currentDesc = document.getElementById("current-desc");
let cityList = [];


// Function for searching the weather and api
function weatherSearch(city) {
  let apiKey = "864118318ed70a271edc09feffa72f3d";

  let forecast =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&units=imperial&appid=864118318ed70a271edc09feffa72f3d";


  // Fetching current weather
  fetch(forecast)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      // Loading weather data to the browser for current weather
      cityName.innerHTML = data.city.name;
      curWeatherDate.innerHTML = new Date();
      currentIcon.src =
        "http://openweathermap.org/img/w/" +
        data.list[0].weather[0].icon +
        ".png"; // add weather image to the container
      currentIcon.style.display = "block"; // display icon once search is clicked
      currentMain.innerHTML = data.list[0].weather[0].main;
      currentDesc.innerHTML =
        "<strong>Current Weather:</strong> " +
        data.list[0].weather[0].description;
      currentHumidity.innerHTML =
        "<strong>Current Humidity:</strong> " + data.list[0].main.humidity + "%";
      currentTemperature.innerHTML =
        "<strong>Current Temperature:</strong> " + data.list[0].main.temp.toFixed(0) + "°";
        currentWindSpeed.innerHTML =
        "<strong>Current Windspeed:</strong> " + data.list[0].wind.speed.toFixed(0) + "mph";

      console.log(data);
      // Loop for the forecast dates
      for (i = 1; i <= 5; i++) {
        // forecast api does forecasts every 3 hours.  This variable will select 1 forecast from the array for once a day.
        let listEl = i * 8 - 1;
        //convert the unix date to the day of the week variable to be input to innerHTML to load forecasted days
        let monthDate = getMonthDate(data.list[listEl].dt);
        console.log("monthdate="+monthDate);
        document.getElementById("forecast-icon" + i.toString()).src =
          "http://openweathermap.org/img/w/" +
          data.list[listEl].weather[0].icon +
          ".png"; // add weather image to the container
        document.getElementById("forecast-icon" + i.toString()).style.display =
          "block"; // display icon once search is clicked
        document.getElementById("forecast-m-d" + i.toString()).innerHTML = 
          monthDate;
        document.getElementById("forecast-main" + i.toString()).innerHTML =
          data.list[listEl].weather[0].main;
        document.getElementById("forecast-desc" + i.toString()).innerHTML =
          data.list[listEl].weather[0].description;
        document.getElementById("forecast-wind" + i.toString()).innerHTML =
          "Wind: " + data.list[listEl].wind.speed.toFixed(0) + "mph";
        document.getElementById("forecast-humid" + i.toString()).innerHTML =
        "Humidity: " + data.list[listEl].main.humidity + "%";
        document.getElementById("forecast-temp" + i.toString()).innerHTML =
          "Temp: " + data.list[listEl].main.temp.toFixed(0) + "°";
      }
      // Coding to store the last searched to the recently viewed list

      // if city is not equal to the city in the first list it will add it to the recently viewed list
      if(cityList.length == 0 || cityList[0] !== data.city.name) {
        cityList.unshift(data.city.name); // Will take the latest searched city and move it to beginning of the array
      }
   

      // storing list of recently viewed cities in localStorage
      localStorage.setItem("weatherCities", JSON.stringify(cityList));

      // calling function to load cities into list container
      loadCities();
    })

    // logging any errors to the console
    .catch(console.error);
}

// Function to call the weatherSeach function to get a value for the search box
function buttonClick() {
  weatherSearch(searchBox.value);
}

// Event listener to call the function buttonClick to get the required data
searchBtn.addEventListener("click", buttonClick);

// convert time to day and date for future forecast
function getMonthDate(unixDate) {
  let getDate = new Date(unixDate * 1000);
console.log(getDate);
  let displayMD = getDate.toDateString();

  console.log(displayMD);
 
  return displayMD;
}

// Function that will take items and load them into the list for recently viewed cities
function loadCities() {
  // for loop that will go through and display the recently viewed cities as a button
  for (i = 0; i <= 5; i++) {
    if (cityList[i]) {
      // add city name to button
      document.getElementById("btn" + i.toString()).textContent = cityList[i];
      // Display button with city if city is stored in local storage
      document.getElementById("btn" + i.toString()).style.display = "block";
    }
    // if there is no recently viewed cities then the list will not display a button
    else {
      document.getElementById("btn" + i.toString()).style.display = "none";
    }
  }
}

// Function for buttons on the recently viewed city list card that when clicked will redirect the user to the weather for that city.
function buttonClickHistory(e) {
  let cityName = e.innerHTML;
  weatherSearch(cityName);
}

// function that takes cities from the local storage and loads the most recent ones to the webpage
function reloadToCityList() {

  let cityTextList = localStorage.getItem("weatherCities");

  if(cityTextList == null || cityTextList == undefined || cityTextList == ""){
    cityList = [];
  } else{
  cityList = JSON.parse(cityTextList);
  }
  loadCities();
}

// Calls the reloadCityList function to load the recently viewed cities on page load from localStorage.
window.onload = reloadToCityList();
