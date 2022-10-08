let now = new Date();
let p = document.querySelector("p");

let date = now.getDate();
let hours = now.getHours();
if (hours < 10) {
  hours = `0${hours}`;
}
let minutes = now.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}
let year = now.getFullYear();

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
let currentDay = days[now.getDay()];
let currentMonth = months[now.getMonth()];
p.innerHTML = `${currentDay},${date} ${currentMonth},${year} ${hours}:${minutes}`;

function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "2c6da8dad3cff7b7ea9b815b83b08d69";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showForecast);
}

function formatDay(timeStamp) {
  let date = new Date(timeStamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function showForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row g-custom">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col">
      <div class="date">${formatDay(forecastDay.dt)}</div>
      <img src="http://openweathermap.org/img/wn/${
        forecastDay.weather[0].icon
      }@2x.png"
      alt="weather icon"
      width = "42"
      />
           <div class="day-temp">${Math.round(forecastDay.temp.max)}°</div>
      <div class="eve-temp">${Math.round(forecastDay.temp.min)}°</div>
      </div>`;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function showCurrentWeather(response) {
  let description = response.data.weather[0].description;
  let temperature = Math.round(response.data.main.temp);
  let wind = Math.round(response.data.wind.speed);
  let hum = response.data.main.humidity;
  let atm = response.data.main.pressure;
  let iconElement = document.querySelector("#icon");
  celsiusTemp = Math.round(response.data.main.temp);
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#description").innerHTML = `Now it is ${description}`;
  document.querySelector(
    "#change-temp"
  ).innerHTML = `Temperature ${temperature}℃`;
  document.querySelector("#change-wind").innerHTML = `Wind ${wind}MpH`;
  document.querySelector("#change-hum").innerHTML = `Humidity ${hum}%`;
  document.querySelector("#change-atm").innerHTML = `ATM ${atm}mmHg`;
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}.png`
  );
  getForecast(response.data.coord);
}

function findCity(city) {
  let apiKey = "2c6da8dad3cff7b7ea9b815b83b08d69";
  let unit = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`;
  axios.get(apiUrl).then(showCurrentWeather);
}
function search(event) {
  event.preventDefault();
  let city = document.querySelector("#search-city-input").value;
  findCity(city);
}
function showLocation(position) {
  let apiKey = "2c6da8dad3cff7b7ea9b815b83b08d69";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showCurrentWeather);
}
function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showLocation);
}

let followButton = document.querySelector("#btn");
followButton.addEventListener("click", getCurrentLocation);

let form = document.querySelector("#search-form");
form.addEventListener("submit", search);

function showFahrTemp(event) {
  event.preventDefault();
  let temperature = document.querySelector("#change-temp");
  let fahrenheitTemp = (celsiusTemp * 9) / 5 + 32;
  temperature.innerHTML = Math.round(fahrenheitTemp);
}

let fahrenheitTemp = document.querySelector("#fahrenheit-temp");
fahrenheitTemp.addEventListener("click", showFahrTemp);

function showCelsTemp(event) {
  event.preventDefault();
  let temperature = document.querySelector("#change-temp");
  temperature.innerHTML = `${celsiusTemp}℃`;
}

let celsiusTemperature = document.querySelector("#change-temp");
celsiusTemperature.addEventListener("click", showCelsTemp);

let celsiusTemp = null;

findCity("Odessa");
