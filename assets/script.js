var apiKey = "e06072637e10d92c8fe85c67087937bf";
var searchBtn = document.querySelector("#search-btn");
var currentWeatherContainer = document.querySelector("#current-weather-container");
var fiveDayWeatherContainer = document.querySelector("#five-day-weather-container");
var searchedCitiesContainer = document.getElementById("searched-cities-container");
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
      <h3>${cityName} ${currentDate}</h3>
      <p>Temperature: ${temperature}°C</p>
      <p>Description: ${weatherDescription}</p>
      <p>Wind: ${windSpeed} m/s</p>
      <p>Humidity: ${humidity}%</p>
    `;

    // Render the weather information
    currentWeatherContainer.innerHTML = weatherHTML;
    savedSearches(cityName);
};

function savedSearches(city) {
    var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    var cityAlreadySaved = false;

    for (var i = 0; i < searchHistory.length; i++) {
        if (searchHistory[i] === city) {
            cityAlreadySaved = true;
            break;
        }
    }

    if (!cityAlreadySaved) {
        searchHistory.push(city);

        // Optional: Limit the search history to 5 entries
        if (searchHistory.length > 5) {
            searchHistory.shift();
        }

        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        updateSavedSearches(searchHistory);
    }
}


searchBtn.addEventListener('click', (event) => {
    event.preventDefault();

    const userInput = userInputEl.value;
    getWeatherData(userInput); // Call getWeatherData with the entered city
});


function getWeatherData(city) {
    var currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    fetch(currentWeatherUrl)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data);
            renderCurrentWeather(data);
        });
};