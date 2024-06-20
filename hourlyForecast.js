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
    document.querySelector('.main-card-time').innerHTML = `Current Time: ${twelveHourFormat}`
}

async function renderTiles() {
    await getLatLon();
    const response = await fetch(`https://api.open-meteo.com/v1/gfs?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,rain,showers,snowfall,snow_depth,wind_gusts_10m,visibility&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&forecast_days=1`)
    const hourlyData = await response.json()
    for (let i = 0; i < hourlyData.hourly.time.length; i++) {
        let hourlyForecaseTilesRow = document.querySelector('.row')
        hourlyForecaseTilesRow.innerHTML += `
        <div class="card my-2 mx-1 text-center text-black" style="width: 18rem; background-color: ${Math.ceil(hourlyData.hourly.temperature_2m[i]) >= 68 ? "orange" : "skyblue"}">
            <div class="card-body">
                <p class="card-title fs-4 fw-bold">${(hourlyData.hourly.time[i]).split("T")[0]}</p>
                <p class="card-title fs-4 fw-bold">${(hourlyData.hourly.time[i]).split("T")[1]}</p>
                <p class="card-text text-dark-subtle fw-medium fs-5"><span class="fw-bold text-dark p-2" style="border-radius:10px; background-color: rgb(222, 230, 234)">Temp: ${Math.ceil(hourlyData.hourly.temperature_2m[i])}°F</span> </p>
                <p class="card-text text-dark-subtle fw-medium fs-5"><span class="fw-bold text-dark p-2" style="border-radius:10px; background-color: rgb(222, 230, 234)">Rain: ${Math.ceil(hourlyData.hourly.rain[i])} in</span></p>
                <p class="card-text text-dark-subtle fw-medium fs-5"><span class="fw-bold text-dark p-2" style="border-radius:10px; background-color: rgb(222, 230, 234)">Showers: ${Math.ceil(hourlyData.hourly.showers[i])} in</span></p>
                <p class="card-text text-dark-subtle fw-medium fs-5"><span class="fw-bold text-dark p-2" style="border-radius:10px; background-color: rgb(222, 230, 234)">Snowfall: ${Math.ceil(hourlyData.hourly.snowfall[i])} in</span></p>
                <p class="card-text text-dark-subtle fw-medium fs-5"><span class="fw-bold text-dark p-2" style="border-radius:10px; background-color: rgb(222, 230, 234)">Snow Depth: ${Math.ceil(hourlyData.hourly.snow_depth[i])} ft</span></p>
                <p class="card-text text-dark-subtle fw-medium fs-5"><span class="fw-bold text-dark p-2" style="border-radius:10px; background-color: rgb(222, 230, 234)">Wind Gust: ${Math.ceil(hourlyData.hourly.wind_gusts_10m[i])} mph</span></p>
                <p class="card-text text-dark-subtle fw-medium fs-5"><span class="fw-bold text-dark p-2" style="border-radius:10px; background-color: rgb(222, 230, 234)">Visibility: ${(Math.ceil(hourlyData.hourly.visibility[i] / 5280))} miles</span></p>
            </div>
        </div>
        `
    }

}


setCityTime()
renderTiles()


