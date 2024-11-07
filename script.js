const apiKey = 'b597ac1da99d1910617260c1bb9a57b6';
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const searchHistory = document.getElementById('search-history');
const currentWeatherInfo = document.getElementById('current-weather-info');
const forecastInfo = document.getElementById('forecast-info');

// Function to fetch weather data
async function getWeatherData(city) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      throw new Error(`Error fetching weather data: ${data.message}`);
    }
  } catch (error) {
    console.error(error);
    alert('Error fetching weather data. Please try again later.');
  }
}

// Function to display current weather
function displayCurrentWeather(data) {
  const cityName = document.getElementById('city-name');
  const currentDate = document.getElementById('current-date');
  const currentIcon = document.getElementById('current-icon');
  const currentTemp = document.getElementById('current-temp');
  const currentDescription = document.getElementById('current-description');
  const currentHumidity = document.getElementById('current-humidity');
  const currentWind = document.getElementById('current-wind');

  cityName.textContent = data.name;
  currentDate.textContent = new Date().toLocaleDateString();
  currentIcon.innerHTML = `<img src="http://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="${data.weather[0].description}">`;
  currentTemp.textContent = `${data.main.temp}°C`;
  currentDescription.textContent = data.weather[0].description;
  currentHumidity.textContent = `Humidity: ${data.main.humidity}%`;
  currentWind.textContent = `Wind: ${data.wind.speed} m/s`;
}

// Function to display 5-day forecast
async function displayForecast(city) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
    const data = await response.json();

    if (response.ok) {
      forecastInfo.innerHTML = '';

      for (let i = 0; i < 5; i++) {
        const forecastItem = document.createElement('div');
        forecastItem.classList.add('bg-white', 'shadow-md', 'rounded-lg', 'p-4', 'text-center');

        const forecastDate = document.createElement('div');
        forecastDate.classList.add('text-gray-500', 'mb-2');
        forecastDate.textContent = new Date(data.list[i * 8].dt_txt).toLocaleDateString();

        const forecastIcon = document.createElement('div');
        forecastIcon.classList.add('w-12', 'h-12', 'mx-auto', 'mb-2');
        forecastIcon.innerHTML = `<img src="http://openweathermap.org/img/w/${data.list[i * 8].weather[0].icon}.png" alt="${data.list[i * 8].weather[0].description}">`;

        const forecastTemp = document.createElement('div');
        forecastTemp.classList.add('text-2xl', 'font-bold');
        forecastTemp.textContent = `${data.list[i * 8].main.temp}°C`;

        forecastItem.appendChild(forecastDate);
        forecastItem.appendChild(forecastIcon);
        forecastItem.appendChild(forecastTemp);
        forecastInfo.appendChild(forecastItem);
      }
    } else {
      throw new Error(`Error fetching forecast data: ${data.message}`);
    }
  } catch (error) {
    console.error(error);
    alert('Error fetching forecast data. Please try again later.');
  }
}

// Function to handle search button click
searchBtn.addEventListener('click', async () => {
  const city = cityInput.value.trim();
  if (city) {
    try {
      const weatherData = await getWeatherData(city);
      displayCurrentWeather(weatherData);
      await displayForecast(city);
      addToSearchHistory(city);
    } catch (error) {
      console.error(error);
      alert(`Error: ${error.message}`);
    }
  }
});

// Function to add city to search history
function addToSearchHistory(city) {
  const historyItem = document.createElement('div');
  historyItem.classList.add('bg-white', 'shadow-md', 'rounded-lg', 'p-2', 'flex', 'items-center', 'justify-between');

  const cityName = document.createElement('div');
  cityName.textContent = city;

  const historyBtn = document.createElement('button');
  historyBtn.classList.add('bg-blue-500', 'text-white', 'px-2', 'py-1', 'rounded-md', 'hover:bg-blue-600', 'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500', 'focus:ring-offset-2');
  historyBtn.textContent = 'View';
  historyBtn.addEventListener('click', async () => {
    const weatherData = await getWeatherData(city);
    if (weatherData) {
      displayCurrentWeather(weatherData);
      displayForecast(city);
    }
  });

  historyItem.appendChild(cityName);
  historyItem.appendChild(historyBtn);
  searchHistory.appendChild(historyItem);
}