var apiKey = "e06072637e10d92c8fe85c67087937bf";
var searchBtn = document.querySelector("#search-btn");
var currentWeatherContainer = document.querySelector("#current-weather-container");
var fiveDayWeatherContainer = document.querySelector("#five-day-weather-container");
var cityList = document.querySelector(".city-list");
var userInputEl = document.querySelector("#user-input");

function renderCurrentWeather(data) {
    // Extract relevant weather information
    var cityName = data.name;
    var temperature = data.main.temp;
    var weatherDescription = data.weather[0].description;
    var windSpeed = data.wind.speed;
    var humidity = data.main.humidity;

    // Format the current date using Day.js
    var currentDate = dayjs().format('YYYY-MM-DD'); // Customize the date format as you like

    // Create HTML to display the weather information
    var weatherHTML = `
      <h3>${cityName}</h3>
      <p>Date: ${currentDate}</p>
      <p>Temperature: ${temperature}°C</p>
      <p>Description: ${weatherDescription}</p>
      <p>Wind: ${windSpeed} m/s</p>
      <p>Humidity: ${humidity}%</p>
    `;

    // Render the weather information
    currentWeatherContainer.innerHTML = weatherHTML;
};

searchBtn.addEventListener('click', function (event) {
    event.preventDefault();

    var userInput = userInputEl.value;
    var currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&appid=${apiKey}`;

    fetch(currentWeatherUrl)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data);
            renderCurrentWeather(data);
        });
});
