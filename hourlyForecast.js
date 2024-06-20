/* Variables */
let cityName = sessionStorage.getItem("SessionCity")
let stateName = sessionStorage.getItem("SessionState")
let Country = "US"
let lon
let lat
let currTime

/* Functions */



async function getLatLon() {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?appid=df22cc6d986066e36e5c9fca1db5de13&q=${cityName},${stateName},US&units=imperial`)
    const latLonData = await response.json()
    lon = latLonData.coord.lon
    lat = latLonData.coord.lat
    currTime = latLonData.dt
}

async function setCityTime() {
    await getLatLon()
    let unixTimestamp = currTime;
    let date = new Date(unixTimestamp * 1000); // The Date constructor takes milliseconds, so we multiply by 1000
    let twelveHourFormat = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false });
    document.querySelector('.main-card-title').innerHTML = cityName
    document.querySelector('.main-card-time').innerHTML = twelveHourFormat
}

async function renderTiles() {
    await getLatLon();
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m&temperature_unit=fahrenheit&wind_speed_unit=ms&precipitation_unit=inch&forecast_days=1`)
    const hourlyData = await response.json()
    for (let i = 0; i < hourlyData.hourly.time.length; i++) {
        let hourlyForecaseTilesRow = document.querySelector('.row')
        hourlyForecaseTilesRow.innerHTML += `
        <div class="card my-2 mx-1 text-center text-black" style="width: 18rem; background-color: ${Math.ceil(hourlyData.hourly.temperature_2m[i]) >= 68 ? "orange" : "skyblue"}">
            <div class="card-body">
                <p class="card-title fs-4 fw-bold">${(hourlyData.hourly.time[i]).split("T")[0]}</p>
                <p class="card-title fs-4 fw-bold">${(hourlyData.hourly.time[i]).split("T")[1]}</p>
                <p class="card-text fs-5">${Math.ceil(hourlyData.hourly.temperature_2m[i])}°F</p>
            </div>
        </div>
        `
    }

}


setCityTime()
renderTiles()

