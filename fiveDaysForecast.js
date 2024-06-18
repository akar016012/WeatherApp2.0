let currentSelection = sessionStorage.getItem("selectedCity")
let cardContainer = document.querySelector('.row')
let chosenCity = document.querySelector('.chosenCity')
if (currentSelection) {
    currentSelection = currentSelection.replace("[", "")
    currentSelection = currentSelection.replace("]", "")
    currentSelection = currentSelection.split(" ")
    currentState = currentSelection[1].replace("[","")
    currentState = currentState.replace("]","")
    console.log(currentSelection);
    fetch(`https://api.openweathermap.org/data/2.5/forecast?appid=df22cc6d986066e36e5c9fca1db5de13&q=${currentSelection[0]},${currentState},US&units=imperial`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            chosenCity.innerText = `${currentSelection[0]}, ${currentState}`
            for (let i = 0; i <= data.list.length; i++) {
                cardContainer.innerHTML += `
                <div class="card mx-auto mb-3" style="width: 20rem; background: ${Math.floor((data.list[i].main.temp)) >= 68 ? "orange" : "skyblue"}">
                    <div class="cityName fw-bold my-4 text-center">${data.list[i].dt_txt}</div>
                    <div class="cityTemp fw-bold my-2 fs-1 text-center">${Math.ceil(data.list[i].main.temp)}</div>
                    <div class="emos text-center"><img src="https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png" style="width: 2em"></img></div>
                    <div class="desc fw-bold text-center py-2 fs-5">${data.list[i].weather[0].description}</div>
                    <div class="windSpeed fw-bold text-center py-2 fs-5">Wind Speed: ${Math.ceil(data.list[i].wind.speed)} mph, ${(Math.ceil((data.list[i].wind.speed) / 1.151))} kts </div>
                    <div class="windGust fw-bold text-center py-2 fs-5">Wind Gust: ${Math.ceil(data.list[i].wind.gust)} mph, ${(Math.ceil((data.list[i].wind.gust) / 1.151))} kts </div>
                    <div class="visibility fw-bold text-center py-2 fs-5">Visibility: ${(data.list[i].visibility)/1000} Statute Miles</div>
                </div>
                `
            }
        })
}
else{
    alert("No City Found!")
}