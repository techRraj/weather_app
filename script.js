
const apiKey = 'b597ac1da99d1910617260c1bb9a57b6';
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const searchHistory = document.getElementById('search-history');

// Function to fetch weather data
async function getWeatherData(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        const data = await response.json();
        
        if (response.ok) {
            return data;
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        throw new Error(`Failed to fetch weather data: ${error.message}`);
    }
}

// Function to display current weather
function displayCurrentWeather(data) {
    document.getElementById('city-name').textContent = data.name;
    document.getElementById('current-date').textContent = new Date().toLocaleDateString();
    document.getElementById('current-icon').innerHTML = `
        <img src="http://openweathermap.org/img/w/${data.weather[0].icon}.png" 
             alt="${data.weather[0].description}"
             class="w-16 h-16">
    `;
    document.getElementById('current-temp').textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById('current-description').textContent = 
        data.weather[0].description.charAt(0).toUpperCase() + 
        data.weather[0].description.slice(1);
    document.getElementById('current-humidity').innerHTML = `
        <i class="fas fa-tint text-blue-500"></i>
        <span class="ml-2">Humidity: ${data.main.humidity}%</span>
    `;
    document.getElementById('current-wind').innerHTML = `
        <i class="fas fa-wind text-blue-500"></i>
        <span class="ml-2">Wind: ${Math.round(data.wind.speed)} m/s</span>
    `;
}

// Function to display forecast
async function displayForecast(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
        const data = await response.json();

        if (response.ok) {
            const forecastInfo = document.getElementById('forecast-info');
            forecastInfo.innerHTML = '';

            // Get one forecast per day
            const dailyForecasts = data.list.filter(reading => 
                reading.dt_txt.includes('12:00:00')
            ).slice(0, 5);

            dailyForecasts.forEach(forecast => {
                const date = new Date(forecast.dt_txt);
                const forecastCard = document.createElement('div');
                forecastCard.className = 'bg-gray-50 rounded-lg p-4 text-center';
                forecastCard.innerHTML = `
                    <div class="text-gray-500 text-sm">${date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                    <img src="http://openweathermap.org/img/w/${forecast.weather[0].icon}.png" 
                         alt="${forecast.weather[0].description}"
                         class="w-12 h-12 mx-auto my-2">
                    <div class="text-2xl font-bold">${Math.round(forecast.main.temp)}°C</div>
                    <div class="text-sm text-gray-500">${forecast.weather[0].description}</div>
                    <div class="text-sm mt-2">
                        <span class="text-blue-500">
                            <i class="fas fa-tint"></i> ${forecast.main.humidity}%
                        </span>
                    </div>
                `;
                forecastInfo.appendChild(forecastCard);
            });
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        throw new Error(`Failed to fetch forecast data: ${error.message}`);
    }
}

// Function to add to search history
function addToSearchHistory(city) {
    const existingCities = Array.from(searchHistory.children)
        .map(item => item.querySelector('span').textContent);
    
    if (!existingCities.includes(city)) {
        const historyItem = document.createElement('div');
        historyItem.className = 'flex items-center justify-between bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition duration-200';
        historyItem.innerHTML = `
            <span class="text-gray-700">${city}</span>
            <button class="text-blue-500 hover:text-blue-600">
                <i class="fas fa-search"></i>
            </button>
        `;
        
        historyItem.querySelector('button').addEventListener('click', async () => {
            try {
                const weatherData = await getWeatherData(city);
                displayCurrentWeather(weatherData);
                await displayForecast(city);
            } catch (error) {
                alert(error.message);
            }
        });

        searchHistory.insertBefore(historyItem, searchHistory.firstChild);
        
        // Keep only last 5 searches
        if (searchHistory.children.length > 5) {
            searchHistory.removeChild(searchHistory.lastChild);
        }
    }
}

// Search button click handler
searchBtn.addEventListener('click', async () => {
    const city = cityInput.value.trim();
    if (city) {
        try {
            const weatherData = await getWeatherData(city);
            displayCurrentWeather(weatherData);
            await displayForecast(city);
            addToSearchHistory(city);
            cityInput.value = '';
        } catch (error) {
            alert(error.message);
        }
    }
});

// Enter key handler
cityInput.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});
