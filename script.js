let card = document.querySelector(".card");
let autoCompleteCities = document.querySelector(".autoCompleteCities");
let searchValue = document.querySelector('input');
let cityName = document.querySelector('.cityName')
let cityTemp = document.querySelector('.cityTemp')
let emos = document.querySelector('.emos')
let desc = document.querySelector('.desc')
let windSpeed = document.querySelector('.windSpeed')
let visibility = document.querySelector('.visibility')
let history = document.querySelector('.history')
let fivedayBtn = document.querySelector('.fiveDayBtn')
let hourlyDayBtn = document.querySelector('.hourlyDayBtn')
let sunStatus = document.querySelector('.sun-status')

let historyArr = []
let date = new Date();
let hours = date.getHours();
let minutes = date.getMinutes();
let day = date.getDate();
let month = date.getMonth() + 1; // JavaScript months are 0-11
let year = date.getFullYear();
let selectedCity = ''
let selectedState = ''

// Add leading zeros to day and month if they are less than 10
if (day < 10) day = '0' + day;
if (month < 10) month = '0' + month;

// Convert 24 hour format to 12 hour format
let period = hours >= 12 ? 'pm' : 'am';
hours = hours % 12;
hours = hours ? hours : 12; // the hour '0' should be '12'

// Add leading zero to minutes if they are less than 10
minutes = minutes < 10 ? '0' + minutes : minutes;

setHistory()

function searchFunc() {
    autoCompleteCities.innerHTML = ''; // Clear the previous results

    if (searchValue.value.length >= 1) {
        autoCompleteCities.classList.remove('d-none')
    }
    else {
        autoCompleteCities.classList.add('d-none')
    }
    fetch("./Data/cities_states.json")
        .then(response => response.json())
        .then(data => {
            let counter = 0; // Initialize counter
            for (let state in data) {
                if (counter >= 10) break; // Break the loop if counter is 10 or more
                let cities = data[state];
                for (let city of cities) {
                    if (city.toLowerCase().startsWith(searchValue.value.toLowerCase())) {
                        autoCompleteCities.innerHTML += `<p id="${city}" class="autoCompleteChild" onclick="chooseCity(this)">${city}, ${state}</p>`;
                        counter++; // Increment counter
                        if (counter >= 10) break; // Break the loop if counter is 10 or more
                    }
                }
            }
        })
        .catch(error => console.error('Error:', error));
}

function chooseCity(e) {
    sessionStorage.setItem("selectedCity", `[${e.innerText.split(",")[0]}] [${e.innerText.split(",")[1].trim()}]`)
    selectedCity = (e.innerText).split(",")[0]
    sessionStorage.setItem("SessionCity", selectedCity)
    selectedState = e.innerText.split(",")[1].trim()
    sessionStorage.setItem("SessionState", selectedState)
    searchValue.value = `${selectedCity}`
    autoCompleteCities.classList.add('d-none')
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function onSubmitGetWeatherInfo(e) {
    // Check if searchValue.value is not empty and contains only letters and spaces
    if (searchValue.value !== "" && /^[A-Za-z\s]*$/.test(searchValue.value)) {
        let apiStr = `https://api.openweathermap.org/data/2.5/weather?appid=df22cc6d986066e36e5c9fca1db5de13&q=${selectedCity},${selectedState},US&units=imperial`
        fetch(apiStr)
            .then(response => response.json())
            .then(data => {
                cityName.innerText = `${data.name ? data.name : (alert("Invalid Input"), window.location.reload())}`;
                let formattedTime = `[${month}/${day}/${year}] [${hours}.${minutes}${period}] `;
                // get the current item in localstorage and set that to historyArr
                if (localStorage.getItem("historyArr") !== null) {
                    historyArr = localStorage.getItem("historyArr").split(',')
                    historyArr.unshift(`${formattedTime}${sessionStorage.getItem("selectedCity")} `);
                    localStorage.setItem("historyArr", historyArr)
                    setHistory()
                }
                else {
                    historyArr = (`${formattedTime}${sessionStorage.getItem("selectedCity")} `);
                    localStorage.setItem("historyArr", historyArr)
                    setHistory()
                }

                cityTemp.innerHTML = `${data.main.temp ? Math.floor((data.main.temp)) : (alert("Invalid Input"), window.location.reload())}°`
                if (Math.floor((data.main.temp)) >= 68) {
                    card.style.background = `linear-gradient(to bottom, skyblue, orange)`
                }
                else {
                    card.style.background = `linear-gradient(to bottom, skyblue, rgb(214, 210, 245))`
                }
                emos.innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" style="width: 2em"></img>`
                desc.innerText = toTitleCase(data.weather[0].description);
                windSpeed.innerHTML = `Wind Speed: ${Math.ceil(data.wind.speed)} mph, ${(Math.ceil((data.wind.speed) / 1.151))} kts`
                visibility.innerHTML = `Visibility: ${(data.visibility) / 1000} Statute Miles`

                // show sun rise and sun set times
                // Create new Date instances
                var sunrise_date = new Date(data.sys.sunrise * 1000);
                var sunset_date = new Date(data.sys.sunset * 1000);

                // Format to string
                var sunrise_str = sunrise_date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
                var sunset_str = sunset_date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
                sunStatus.innerHTML = `🌅 ${sunrise_str} 🌇 ${sunset_str}`
                // reset search value
                searchValue.value = ''
                fivedayBtn.classList.remove("d-none")
                hourlyDayBtn.classList.remove("d-none")
                showIframeBasedOnActive()
            })
    } else {
        // Handle empty or invalid input
        (alert("Invalid Input"), window.location.reload())
    }
}

function setHistory() {
    let getHistory = localStorage.getItem("historyArr")
    if (getHistory !== null) {
        let getHistoryArr = getHistory.split(",")
        history.innerHTML = ''
        getHistoryArr.forEach(element => {
            history.innerHTML += `<p id="text" >${element} <span class="fw-bold text-danger px-2 fs-5" style="cursor: pointer" onclick="deleteHistory(document.getElementById('text'))">&times</span></p>`
        });
    }
}

function deleteHistory(e) {
    let text = e.innerText.slice(0, -1); // remove the last character
    let getHistory = localStorage.getItem("historyArr");
    if (getHistory) {
        let getHistoryArr = getHistory.split(',');
        // loop through the array
        for (let i = 0; i < getHistoryArr.length; i++) {
            // if an item matches the text remove it
            if (getHistoryArr[i] === text) {
                getHistoryArr.splice(i, 1);
                break;
            }
        }
        // set the updated array back to localstorage
        localStorage.setItem("historyArr", getHistoryArr.join(','));
        setHistory()
    }
    if (localStorage.getItem("historyArr") == '') {
        localStorage.removeItem("historyArr")
        location.reload()
    }
}

function clearAllHistory() {
    if (window.confirm("Are You Sure?")) {
        localStorage.removeItem("historyArr")
        location.reload()
    }
}

function showFiveDayData() {
    let mainDiv = document.querySelector('.main-div')
    let showMoreInfoDiv = document.querySelector('.show-more-info-div')
    const iframeContainer = document.querySelector('.iframe-hourly-forecast');
    iframeContainer.innerHTML =
        `
        <iframe src="./fiveDaysForecast.html" width="100%" height="800px" frameborder="0"></iframe>
    `;

    mainDiv.classList.add("d-none")
    showMoreInfoDiv.classList.remove("d-none")
    window.scrollTo(0, 0);
}
function showHourlyData() {
    let mainDiv = document.querySelector('.main-div')
    let showMoreInfoDiv = document.querySelector('.show-more-info-div')
    const iframeContainer = document.querySelector('.iframe-hourly-forecast');
    iframeContainer.innerHTML =
        `
        <iframe src="./hourlyForecast.html" width="100%" height="800px" frameborder="0"></iframe>
        `;
    mainDiv.classList.add("d-none")
    showMoreInfoDiv.classList.remove("d-none")
    window.scrollTo(0, 0);
}
function showRader() {
    let mainDiv = document.querySelector('.main-div')
    let showMoreInfoDiv = document.querySelector('.show-more-info-div')
    const iframeContainer = document.querySelector('.iframe-hourly-forecast');
    iframeContainer.innerHTML =
        `
        <iframe src="https://radar.weather.gov/" width="100%" height="800px" frameborder="0"></iframe>
        `;
    mainDiv.classList.add("d-none")
    showMoreInfoDiv.classList.remove("d-none")
    window.scrollTo(0, 0);
}


function onClickHistory() {
    let mainDiv = document.querySelector('.main-div')
    let historyDiv = document.querySelector('.history-div')

    mainDiv.classList.add('d-none')
    historyDiv.classList.remove('d-none')
}

function handleTimesClick() {
    let mainDiv = document.querySelector('.main-div')
    let historyDiv = document.querySelector('.history-div')
    let showMoreInfoDiv = document.querySelector('.show-more-info-div')

    mainDiv.classList.remove('d-none')
    showMoreInfoDiv.classList.add('d-none')
    historyDiv.classList.add('d-none')
}


