let cityInput = document.getElementById("cityInput");
let searchButton = document.getElementById("searchButton");
let locationButton = document.getElementById("locationButton");
let weatherContainer = document.getElementById("weatherContainer");
let apiKey = "a3da49c065a09547a9080fd176029601";


function displayWeather(data) {
 

  let temperature = Math.round(data.main.temp - 273.15);
  let feelsLike = Math.round(data.main.feels_like - 273.15);
  let icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  weatherContainer.innerHTML = `${data.name}<br>${temperature}°C<br>Feels Like: ${feelsLike}°C<br>Humidity: ${data.main.humidity}%<br>${data.weather[0].description}<br>Wind Speed: ${data.wind.speed}m/s<br><img src="${icon}">`;  
}


searchButton.addEventListener("click", async function () {
  let city = cityInput.value.trim();

  if (city === "") {
    weatherContainer.textContent = "Please Enter A city Name";
    return;
  }

  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  let data;

  weatherContainer.textContent = "Loading...";

  try {
    let response = await fetch(apiUrl);

    if (!response.ok) {
      weatherContainer.textContent = "City Not Found";
      return;
    }

    data = await response.json();

  } catch (error) {
    weatherContainer.textContent = "Something went wrong. Please try again.";
    return;
  }

  displayWeather(data);
});
locationButton.addEventListener("click", function () {

  navigator.geolocation.getCurrentPosition(
    async function (position) {

      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;
      let data;

      let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

      weatherContainer.textContent = "Loading...";
      try {
        let response = await fetch(apiUrl);

        if (!response.ok) {
          weatherContainer.textContent = "Unable to get weather data.";
          return;
        }

        data = await response.json();

      } catch (error) {
        weatherContainer.textContent = "Something went wrong. Please try again.";
        return;
      }
      displayWeather(data);
    },

    function (error) {

      if (error.code === 1) {
        weatherContainer.textContent = "Location permission denied. Please allow location access.";
      }
      else if (error.code === 2) {
        weatherContainer.textContent = "Location unavailable. Please try again.";
      }
      else if (error.code === 3) {
        weatherContainer.textContent = "Location request timed out. Please try again.";
      }

    }
  );

});