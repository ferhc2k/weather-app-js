const API_KEY = "f8d0fc246484ed113a33f2c3205dacd3";
const container = document.querySelector(".container");
const formWeather = document.getElementById("form-weather");
const weatherIcons = {
    "01d": "ri-sun-fill",
    "02d": "ri-sun-cloudy-line",
    "03d": "ri-cloudy-fill",
    "04d": "ri-cloudy-2-fill",
    "09d": "ri-rainy-fill",
    "10d": "ri-drizzle-fill",
    "11d": "ri-thunderstorms-fill",
    "13d": "ri-snowy-fill",
    "50d": "ri-mist-fill",
    "01n": "ri-moon-fill",
    "02n": "ri-moon-cloudy-line",
    "03n": "ri-cloudy-fill",
    "04n": "ri-cloudy-2-fill",
    "09n": "ri-rainy-fill",
    "10n": "ri-drizzle-fill",
    "11n": "ri-thunderstorms-fill",
    "13n": "ri-snowy-fill",
    "50n": "ri-mist-fill",
}

const weatherRender = (data, unit) => {
    const setUnit = unit.shift() === "metric" ? "C" : "F";
    moment.locale('es');
    const ui = `
        <i class="${weatherIcons[data.weather[0].icon]} weather-icon"></i>
        <div class="weather-main">
            <h1 class="temperature">${Math.round(data.main.temp)} &#176 ${setUnit}</h1>
            <p class="weather-text-small"><i class="ri-map-pin-2-line"></i> ${data.name}, ${data.sys.country}</p>
        </div>
        <div class="weather-data">
            <div class="data-item">
                <i class="ri-cloud-fill"></i>
                <p>${data.clouds.all}%</p>
            </div>
            <div class="data-item">
                <i class="ri-drop-fill"></i>
                <p>${data.main.humidity}%</p>
            </div>
            <div class="data-item">
                <i class="ri-windy-line"></i>
                <p>${data.wind.speed} km/h</p>
            </div>
            <div class="data-item">
                <i class="ri-temp-cold-line"></i>
                <p>${Math.round(data.main.temp_max)} &#176</p>
            </div>
        </div>
        <p>Ultima actualización: ${moment(moment(moment.unix(data.dt)["_i"]).format()).fromNow()}.</p>
    `; 
    return ui;
}

const spinner = () => {
    const container = document.createElement("div");
    container.classList.add("spinner");
    return container;
}

const fetchData = (city, unit) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&lang=es&appid=${API_KEY}`)
        .then(res => res.ok ? res.json() : Promise.reject(res)) 
        .then(data => container.innerHTML = weatherRender(data, unit))
        .catch(error => container.innerHTML = `<p class="msg-error">${error.statusText} ${error.status}</p>`);
}

formWeather.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    container.innerHTML = "";
    container.appendChild(spinner());
    await fetchData(formData.getAll("city"), formData.getAll("unit"));
    formWeather.reset();
})



    