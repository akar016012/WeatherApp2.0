let card = document.querySelector(".card");
let autoCompleteCities = document.querySelector(".autoCompleteCities");
let searchValue = document.querySelector('input');
let cityName = document.querySelector('.cityName')
let cityTemp = document.querySelector('.cityTemp')
let emos = document.querySelector('.emos')
let desc = document.querySelector('.desc')
let windSpeed = document.querySelector('.windSpeed')
let visibility = document.querySelector('.visibility')
let selectedCity = ''

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