var apiKey = "e06072637e10d92c8fe85c67087937bf";
var searchBtn = document.querySelector("#search-btn");
var currentWeatherContainer = document.querySelector("#current-weather-container");
var fiveDayWeatherContainer = document.querySelector("#five-day-weather-container");
var searchedCitiesContainer = document.getElementById("searched-cities-container");
var userInputEl = document.querySelector("#user-input");

// Load the search history from localStorage when the page loads
var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

searchBtn.addEventListener('click', (event) => {
    event.preventDefault();
    const userInput = userInputEl.value.trim(); // Remove leading/trailing spaces

    // Validate the input city name
    if (!isValidCityName(userInput)) {
        alert("Please enter a valid city name containing only letters and spaces.");
        return;
    }

    getWeatherData(userInput); // Call the getWeatherData function with the entered city
    getFiveDayWeatherData(userInput)
});

const iconMappings = {
    "01d": "https://openweathermap.org/img/w/01d.png", // clear sky (day)
    "01n": "https://openweathermap.org/img/w/01n.png", // clear sky (night)
    "02d": "https://openweathermap.org/img/w/02d.png", // few clouds (day)
    "02n": "https://openweathermap.org/img/w/02n.png", // few clouds (night)
    "03d": "https://openweathermap.org/img/w/03d.png", // scattered clouds (day)
    "03n": "https://openweathermap.org/img/w/03n.png", // scattered clouds (night)
    "04d": "https://openweathermap.org/img/w/04d.png", // broken clouds (day)
    "04n": "https://openweathermap.org/img/w/04n.png", // broken clouds (night)
    "09d": "https://openweathermap.org/img/w/09d.png", // shower rain (day)
    "09n": "https://openweathermap.org/img/w/09n.png", // shower rain (night)
    "10d": "https://openweathermap.org/img/w/10d.png", // rain (day)
    "10n": "https://openweathermap.org/img/w/10n.png", // rain (night)
    "11d": "https://openweathermap.org/img/w/11d.png", // thunderstorm (day)
    "11n": "https://openweathermap.org/img/w/11n.png", // thunderstorm (night)
    "13d": "https://openweathermap.org/img/w/13d.png", // snow (day)
    "13n": "https://openweathermap.org/img/w/13n.png", // snow (night)
    "50d": "https://openweathermap.org/img/w/50d.png", // mist (day)
    "50n": "https://openweathermap.org/img/w/50n.png", // mist (night)
};


function renderCurrentWeather(data) {

    // Extract relevant weather information
    var cityName = data.name;
    var temperature = data.main.temp;
    var weatherDescription = data.weather[0].description;
    var windSpeed = data.wind.speed;
    var humidity = data.main.humidity;
    var iconCode = data.weather[0].icon

    // Format the current date using Day.js
    var currentDate = dayjs().format('YYYY-MM-DD'); // Customize the date format as you like

    // Create HTML to display the weather information
    var weatherHTML = `
      <h3>${cityName} ${currentDate}</h3>
      <p>Temperature: ${temperature}°C</p>
      <p>Description: ${weatherDescription}</p>
      <p>Wind: ${windSpeed} m/s</p>
      <p>Humidity: ${humidity}%</p>
      <div>
      <img src="${iconMappings[iconCode]}" alt="Weather Icon">
    </div>
  `;

    // Render the weather information
    currentWeatherContainer.innerHTML = weatherHTML;
}

function renderFiveDayWeather(data) {
    var forecastList = data.list; // Array of forecast data for different time intervals
    var groupedForecasts = {};
  
    // Group the forecast data by date
    for (var i = 0; i < forecastList.length; i++) {
      var forecast = forecastList[i];
      var forecastDate = dayjs(forecast.dt * 1000).format('YYYY-MM-DD');
  
      // Update the latest forecast for each date
      groupedForecasts[forecastDate] = forecast;
    }
  
    // Clear the container before rendering new data
    fiveDayWeatherContainer.innerHTML = '';
  
    // Loop through the grouped forecasts and render the data for each date
    for (var date in groupedForecasts) {
      var forecast = groupedForecasts[date];
      var formattedDate = dayjs(date).format('MMMM DD, YYYY');
      var temperature = forecast.main.temp;
      var windSpeed = forecast.wind.speed;
      var humidity = forecast.main.humidity;
      var icon = forecast.weather[0].icon;
  
      var forecastHTML = `
        <div>
          <h3>${formattedDate}</h3>
          <p>Temperature: ${temperature}°C</p>
          <p>Wind Speed: ${windSpeed} m/s</p>
          <p>Humidity: ${humidity}%</p>
          <img src="http://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon">
        </div>
      `;
  
      fiveDayWeatherContainer.innerHTML += forecastHTML;
    }
  }

function updateSavedSearches(searchHistory) {
    searchedCitiesContainer.innerHTML = '';

    for (var i = 0; i < searchHistory.length; i++) {
        var city = searchHistory[i];
        var button = document.createElement('button');
        button.textContent = city;

        // Use a function to handle the click event and pass the city as an argument
        button.addEventListener('click', createClickHandler(city));

        searchedCitiesContainer.appendChild(button);
    }
}

// Helper function to create the click event handler with the correct city value
function createClickHandler(city) {
    return function () {
        getWeatherData(city);
        getFiveDayWeatherData(city) // Call getWeatherData with the correct city value
    };
}

// Function to validate the input city name
function isValidCityName(cityName) {
    // Use a regular expression to check if the input contains only letters and spaces
    // This will allow city names like "New York", "Los Angeles", etc.
    var regex = /^[A-Za-z\s]+$/;
    return regex.test(cityName);
}

function savedSearches(city) {
    var cityAlreadySaved = false;

    // Validate the city name before saving to search history
    if (!isValidCityName(city)) {
        alert("Please enter a valid city name containing only letters and spaces.");
        return; // Do not proceed with saving the search
    }

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

        // Save the updated search history to localStorage
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

        // Update the recent searches UI
        updateSavedSearches(searchHistory);
    }
}

// Event listener for the search button
searchBtn.addEventListener('click', (event) => {
    event.preventDefault();
    const userInput = userInputEl.value.trim(); // Remove leading/trailing spaces
    savedSearches(userInput); // Call the savedSearches function with the entered city
});

// Load the UI with the search history when the page loads
updateSavedSearches(searchHistory);

function getWeatherData(city) {
    var currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    fetch(currentWeatherUrl)
        .then((response) => response.json())
        .then((data) => {
            console.log("Current weather data", data); // Optional: Log the data to check the API response
            renderCurrentWeather(data);
        })
        .catch((error) => {
            console.error('Error fetching weather data:', error);
        });
}

function getFiveDayWeatherData(city) {
    var fiveDayWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}
    `;
  
    fetch(fiveDayWeatherUrl)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("Five day weather data", data);
        renderFiveDayWeather(data);
      })
      .catch((error) => {
        console.error("Error fetching 5-day weather data:", error);
      });
  }