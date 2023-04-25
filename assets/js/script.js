var inputEl = document.querySelector("#cityInput");
var formEL = document.querySelector("#user-form");
var divEl = document.querySelector("#city-container");
var ulEL = document.querySelector(".list-group");
var weatherContainer = document.querySelector(".main-weather-container");

var APIKey = "27e7447053f48ac5737821bd72b4faeb";
var city;
var currentDay = dayjs().format("M/D/YYYY");
var forecastDIV = document.querySelector(".forecast-container");
var counter = 0;
// 1)
// We start our programm with the submitCity
// which will be triggered by cliking on the search button
// we will grab the value of the input (city name) and we will first pass that
// value to requestCity function which will be in charge of fetching the data

//Then we also pass the value (city name) to the renderListItems which will
//be in charge of rendering a list in the left side of the webpage of the cities we search.

var submitCity = function (event) {
  event.preventDefault();

  var cityValue = inputEl.value.trim();
  if (cityValue === "") {
    alert("Sorry, please introduce a valid city name.");
    return;
  }
  console.log("VALUE :", cityValue);
  city = cityValue;
  requestCity(city);
  renderListItems(city);
  inputEl.value = "";
};

//2)
//Here in the requestCity function which is getting the city name, we will use that value
// to make the propper URL request, we also need to pass our API key which we get once
//we make an account on the weather API.

//after recieving the response and pass it to json (.json()), we then will get the data
//which we will be passing to the renderWeatherConditions function, which will be
//in charge of displaying the weather details of the proper city.
var requestCity = function (city) {
  var requestURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    APIKey;
  fetch(requestURL)
    .then((Response) => Response.json())
    .then((data) => {
      console.log(data);
      renderWeatherConditions(data);
    });
};

// 3)
//Here we are recieving the data, which will be broken down in the different "attributes"
//that the API provide us (city name, city temperature, city latitude, city longitud)
//then we creat our html elements that will hold the different atrributes of the data.

//we also need to pass the city lat and city lon to our requestForecast function which will
//be in charge of requesting the forecast data.

//Here we are creating a weathers array which will hold 5 different "cards (elements)" with
//the proper forecast data for each city, we will pass this weathers array to renderOnScreen() function all the
//elements with the different "attributes" that we created in renderWeatherConditions(),
var weathers = [];
function renderWeatherConditions(data) {
  var cityName = data.name;
  var cityLon = data.coord.lon;
  var cityLat = data.coord.lat;
  var cityTemp = Math.floor(1.8 * (data.main.temp - 273) + 32);
  console.log("CITY DATA:", data);
  console.log("LON :", cityLon);
  console.log("LAT :", cityLat);
  requestForecast(cityLat, cityLon);

  var cardEL = document.createElement("div");
  var cardTitle = document.createElement("h2");
  var cardTemp = document.createElement("p");
  var cardWind = document.createElement("p");
  var cardHumidity = document.createElement("p");
  cardTitle.className = "card-title";
  cardEL.classList.add("card");
  cardTitle.textContent = cityName + " " + currentDay;
  cardTemp.textContent = "Temperature : " + cityTemp + "°F";
  cardWind.textContent = "Wind : " + data.wind.speed + "MPH";
  cardHumidity.textContent = "Humidity : " + data.main.humidity + "%";
  cardEL.appendChild(cardTitle);
  cardEL.appendChild(cardTemp);
  cardEL.appendChild(cardWind);
  cardEL.appendChild(cardHumidity);
  //divEl.append(cardEL);
  var cardID = "el-" + counter;
  cardEL.setAttribute("id", cardID);

  weathers.push(cardEL);
  console.log("WEATHERS ", weathers);
  renderOnScreen(weathers);
}

// 4)
//Here in renderOnScreen function we recieve the weathers array containing cardEL element
//which contains the weather conditions of the city, first we remove all the innerHTML of the divs in our page
//and then we append our weatherArray using a index which will be a counter variable
function renderOnScreen(weathersArray) {
  divEl.innerHTML = "";
  forecastDIV.innerHTML = "";
  divEl.append(weathersArray[counter]);
  counter++;
}

// 4.1)
//Here we are requesting the forecast data with the help of the lat, and the lon that we recieve
//from the renderWeatherConditions function, and we pass the data to our renderForecast function
//which will be in charge of rendering our forecast for each city.
var requestForecast = function (lat, lon) {
  var requestForecastURL =
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=" +
    APIKey;
  fetch(requestForecastURL)
    .then((Response) => Response.json())
    .then((data) => renderForecast(data));
};
var forecast = [];
var forecastArray = [];

//Here we will recieve the forecast data and display it along the main weather conditions for each city.
function renderForecast(forecastData) {
  var forecastList = forecastData.list;
  for (var i = 0; i < forecastList.length; i += 8) {
    var forecastEL = document.createElement("div");
    forecastEL.classList.add("card");
    forecastEL.classList.add("forcast-card");
    var forecastTitle = document.createElement("p");
    var forecastTemp = document.createElement("p");
    var forecastWind = document.createElement("p");
    var forecastHumidity = document.createElement("p");
    forecastTitle.className = "card-title";
    forecastTemp.textContent =
      "Temperature : " +
      Math.floor(1.8 * (forecastData.list[i].main.temp - 273) + 32) +
      " °F";
    forecastWind.textContent =
      "Wind : " + forecastData.list[i].wind.speed + " MPH";
    forecastHumidity.textContent =
      "Humidity : " + forecastData.list[i].main.humidity + " %";
    var forecastDate = forecastData.list[i].dt_txt.replace("21:00:00", "");
    forecastTitle.textContent = forecastDate;
    forecastEL.appendChild(forecastTitle);
    forecastEL.appendChild(forecastTemp);
    forecastEL.appendChild(forecastWind);
    forecastEL.appendChild(forecastHumidity);
    console.log("FORECAST DATE :", forecastDate);
    forecastDIV.appendChild(forecastEL);
    console.log("List :" + [i], forecastData.list[i]);
  }
  forecastArray.push(forecastEL);
}
rCounter = 0;

function renderListItems(cityName) {
  var liEL = document.createElement("li");
  liEL.className = "list-group-item";
  liEL.dataset.liID = "el-" + rCounter;
  liEL.textContent = cityName;
  ulEL.appendChild(liEL);
  rCounter++;
  var itemID = liEL.dataset.liID;
  liEL.addEventListener("click", function checkIDs() {
    console.log("LI CLICKEDDD");
    switch (itemID) {
      case "el-0":
        divEl.innerHTML = "";
        forecastDIV.innerHTML = "";
        divEl.append(weathers[0], forecastArray[0]);
        break;
      case "el-1":
        divEl.innerHTML = "";
        forecastDIV.innerHTML = "";
        divEl.append(weathers[1], forecastArray[1]);
        break;
      case "el-2":
        divEl.innerHTML = "";
        forecastDIV.innerHTML = "";
        divEl.append(weathers[2], forecastArray[2]);
        break;
      case "el-3":
        divEl.innerHTML = "";
        forecastDIV.innerHTML = "";
        divEl.append(weathers[3], forecastArray[3]);
        break;
      case "el-4":
        divEl.innerHTML = "";
        forecastDIV.innerHTML = "";
        divEl.append(weathers[4], forecastArray[4]);
        break;
      case "el-5":
        divEl.innerHTML = "";
        forecastDIV.innerHTML = "";
        divEl.append(weathers[5], forecastArray[5]);
        break;
      case "el-6":
        divEl.innerHTML = "";
        forecastDIV.innerHTML = "";
        divEl.append(weathers[6], forecastArray[6]);
        break;
      case "el-7":
        divEl.innerHTML = "";
        forecastDIV.innerHTML = "";
        divEl.append(weathers[7], forecastArray[6]);
        break;
      case "el-8":
        divEl.innerHTML = "";
        forecastDIV.innerHTML = "";
        divEl.append(weathers[8], forecastArray[8]);
        break;
      case "el-9":
        divEl.innerHTML = "";
        forecastDIV.innerHTML = "";
        divEl.append(weathers[9], forecastArray[9]);
        break;
      case "el-10":
        divEl.innerHTML = "";
        forecastDIV.innerHTML = "";
        divEl.append(weathers[10], forecastArray[10]);
        break;
      case "el-11":
        divEl.innerHTML = "";
        forecastDIV.innerHTML = "";
        divEl.append(weathers[11], forecastArray[11]);
        break;
      case "el-12":
        divEl.innerHTML = "";
        forecastDIV.innerHTML = "";
        divEl.append(weathers[12], forecastArray[12]);
        break;
      case "el-13":
        divEl.innerHTML = "";
        forecastDIV.innerHTML = "";
        divEl.append(weathers[13], forecastArray[13]);
        break;
      case "el-14":
        divEl.innerHTML = "";
        forecastDIV.innerHTML = "";
        divEl.append(weathers[14], forecastArray[14]);
        break;
      case "el-15":
        divEl.innerHTML = "";
        forecastDIV.innerHTML = "";
        divEl.append(weathers[15], forecastArray[15]);
        break;
      case "el-16":
        divEl.innerHTML = "";
        forecastDIV.innerHTML = "";
        divEl.append(weathers[16], forecastArray[16]);
        break;
      case "el-17":
        divEl.innerHTML = "";
        forecastDIV.innerHTML = "";
        divEl.append(weathers[17], forecastArray[17]);
        break;
      case "el-18":
        divEl.innerHTML = "";
        forecastDIV.innerHTML = "";
        divEl.append(weathers[18], forecastArray[18]);
        break;
      case "el-19":
        divEl.innerHTML = "";
        forecastDIV.innerHTML = "";
        divEl.append(weathers[19], forecastArray[19]);
        break;
      case "el-20":
        divEl.innerHTML = "";
        forecastDIV.innerHTML = "";
        divEl.append(weathers[20], forecastArray[20]);
        break;
    }
  });
}

formEL.addEventListener("submit", submitCity);
