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
let historyArr = []
let selectedCity = ''
let date = new Date();
let hours = date.getHours();
let minutes = date.getMinutes();
let day = date.getDate();
let month = date.getMonth() + 1; // JavaScript months are 0-11
let year = date.getFullYear();
setHistory()

// Add leading zeros to day and month if they are less than 10
if (day < 10) day = '0' + day;
if (month < 10) month = '0' + month;

// Convert 24 hour format to 12 hour format
let period = hours >= 12 ? 'pm' : 'am';
hours = hours % 12;
hours = hours ? hours : 12; // the hour '0' should be '12'

// Add leading zero to minutes if they are less than 10
minutes = minutes < 10 ? '0' + minutes : minutes;

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
        let apiStr = `https://api.openweathermap.org/data/2.5/weather?appid=df22cc6d986066e36e5c9fca1db5de13&q=${selectedCity}&units=imperial`
        fetch(apiStr)
            .then(response => response.json())
            .then(data => {
                cityName.innerText = `${data.name ? data.name : (alert("Invalid Input"), window.location.reload())}`;
                let formattedTime = `[${month}/${day}/${year}] [${hours}.${minutes}${period}] `;

                // get the current item in localstorage and set that to historyArr
                historyArr = localStorage.getItem("historyArr").split(',')
                historyArr.unshift(`${formattedTime} ${sessionStorage.getItem("selectedCity")} `);
                localStorage.setItem("historyArr", historyArr)
                setHistory()

                cityTemp.innerHTML = `${data.main.temp ? Math.floor((data.main.temp)) : (alert("Invalid Input"), window.location.reload())}°`
                if (Math.floor((data.main.temp)) >= 68) {
                    card.style.background = `linear-gradient(to bottom, skyblue, orange)`
                }
                else {
                    card.style.background = `linear-gradient(to bottom, skyblue, blue)`
                }
                emos.innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" style="width: 2em"></img>`
                desc.innerText = toTitleCase(data.weather[0].description);
                windSpeed.innerHTML = `Wind Speed: ${data.wind.speed} MPH`
                visibility.innerHTML = `Visibility: ${(data.visibility) / 1000} Miles`
                // reset search value
                searchValue.value = ''
            })
    } else {
        // Handle empty or invalid input
        (alert("Invalid Input"), window.location.reload())
    }
}

function setHistory() {
    let getHistory = localStorage.getItem("historyArr")
    if (getHistory) {
        let getHistoryArr = getHistory.split(",")
        history.innerHTML = ''
        getHistoryArr.forEach(element => {
            history.innerHTML += `<p>${element}</p>`
        });
    }
    else {
        localStorage.setItem("historyArr", historyArr)
    }
}