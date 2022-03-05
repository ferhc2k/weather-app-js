const API_KEY = "f8d0fc246484ed113a33f2c3205dacd3";
const form = document.querySelector(".form");
const container = document.querySelector(".weather__container");
const toggleTheme = document.querySelector(".btn__toggle-theme");
moment.locale('es');
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

const setUnit = (unit) => unit === "metric" ? "C" : "F";

const weatherRender = (data, unit) => {
    const ui = `
        <i class="weather__icon ${weatherIcons[data.weather[0].icon]}"></i>
        <div class="weather__main">
            <h1 class="main__temperature">${Math.round(data.main.temp)}&#176 ${setUnit(unit)}</h1>
            <p class="weather__text--small"><i class="ri-map-pin-2-line"></i> ${data.name}, ${data.sys.country}</p>
        </div>
        <div class="weather__data">
            <div class="data__item">
                <i class="ri-cloud-fill"></i>
                <p class="data__description">${data.clouds.all}%</p>
            </div>
            <div class="data__item">
                <i class="ri-drop-fill"></i>
                <p class="data__description">${data.main.humidity}%</p>
            </div>
            <div class="data__item">
                <i class="ri-windy-line"></i>
                <p class="data__description">${data.wind.speed} km/h</p>
            </div>
            <div class="data__item">
                <i class="ri-temp-cold-line"></i>
                <p class="data__description">${Math.round(data.main.temp_max)}&#176</p>
            </div>
        </div>
        <p>Ultima actualización: ${moment(moment(moment.unix(data.dt)["_i"]).format()).fromNow()}.</p>
    `; 
    return ui;
}

const spinner = () => {
    const content = document.createElement("div");
    const container = document.createElement("div");
    content.classList.add("spinner__container");
    container.classList.add("spinner__circle");
    content.appendChild(container);
    content.innerHTML += '<p class="weather__msg--normal">Obtiendo datos.</p>'
    return content;
}


const fetchDataByCity = (city, unit) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&lang=es&appid=${API_KEY}`)
        .then(response => response.ok ? response.json() : response.json().then(json => { throw json })) 
        .then(data => container.innerHTML = weatherRender(data, unit))
        .catch(error => container.innerHTML = `<p class="weather__msg--error">${error.message}</p>`);
}

const fetchDataByCoords = (lat, lon, unit ) => {
    fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&lang=es&appid=${API_KEY}`)
        .then(response => response.ok ? response.json() : response.json().then(json => { throw json })) 
        .then(data => container.innerHTML = weatherRender(data, unit))
        .catch(error => container.innerHTML = `<p class="weather__msg--error">${error.message}</p>`);
}


/*const fetchData = async (city, unit) => {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ city }&units=${ unit }&lang=es&appid=${ API_KEY }`);
        const data = await response.json();
        if (!response.ok) throw data;
        container.innerHTML = weatherRender(data, unit);
    } catch (error) {
        container.innerHTML = `<p class="msg-error">${error.message}</p>`;
    }
}*/

/*const fetchData = async (city, unit) => {
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${ city }&units=${ unit }&lang=es&appid=${ API_KEY }`);
        const data = await response.data;
        container.innerHTML = weatherRender(data, unit);
    } catch (error) {
        const errorData = error.response.data
        container.innerHTML = `<p class="msg-error">${errorData.message}</p>`;
    }
}*/

/*const fetchData = (city, unit) => {
    const xhr = new XMLHttpRequest(); 
    xhr.addEventListener("readystatechange", () => { 
        if(xhr.readyState !== 4) return;
        if(xhr.status >= 200 && xhr.status < 300){ 
            const data = JSON.parse(xhr.responseText);
            container.innerHTML = weatherRender(data, unit);
        }else{
            const error = JSON.parse(xhr.responseText);
            container.innerHTML = `<p class="msg-error">${error.message}</p>`;
        }
    })
    xhr.open(
        "GET", 
        `https://api.openweathermap.org/data/2.5/weather?q=${ city }&units=${ unit }&lang=es&appid=${ API_KEY }`
    );
    xhr.send() 
}*/

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    container.innerHTML = "";
    container.appendChild(spinner());
    await fetchDataByCity(form.city.value, form.unit.value);
    form.reset();
})


const onLocationSuccess = async (position) => {
    const { latitude, longitude } = position.coords;
    container.innerHTML = "";
    container.appendChild(spinner());
    await fetchDataByCoords(latitude, longitude, form.unit.value);
}
    
const onLocationError = (error) => {
    container.innerHTML = `<p class="weather__msg--error">${error.message}</p>`;
}

const getLocation = () => {
    if (navigator.geolocation) navigator.geolocation.getCurrentPosition(onLocationSuccess, onLocationError);
    else console.log("Geolocation is not supported by this browser.")
}
  

toggleTheme.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    if(document.body.classList.contains("dark-theme")) {
        toggleTheme.classList.replace("ri-moon-line", "ri-sun-line")
    } else {
        toggleTheme.classList.replace("ri-sun-line", "ri-moon-line")
    }
})