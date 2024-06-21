let currentSelection = sessionStorage.getItem("selectedCity")
let cardContainer = document.querySelector('.row')
let chosenCity = document.querySelector('.chosenCity')
if (currentSelection) {
    let currCity = sessionStorage.getItem("SessionCity")
    let currState = sessionStorage.getItem("SessionState")
    fetch(`https://api.openweathermap.org/data/2.5/forecast?appid=df22cc6d986066e36e5c9fca1db5de13&q=${currCity},${currState},US&units=imperial`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            chosenCity.innerText = `${currCity}, ${currState}`
            for (let i = 0; i <= data.list.length; i++) {
                cardContainer.innerHTML += `
                <div class="card mx-auto mb-3" style="width: 20rem; background: ${Math.floor((data.list[i].main.temp)) >= 68 ? "orange" : "skyblue"}">
                    <div class="cityName fw-bold my-4 text-center">${data.list[i].dt_txt}</div>
                    <div class="cityTemp fw-bold my-2 fs-1 text-center">${Math.ceil(data.list[i].main.temp)}</div>
                    <div class="emos text-center"><img src="https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png" style="width: 2em"></img></div>
                    <div class="desc fw-bold text-center my-1 fs-5" style="background-color:rgb(222, 230, 234); border-radius:10px">${data.list[i].weather[0].description}</div>
                    <div class="windSpeed fw-bold text-center my-1 fs-5" style="background-color:rgb(222, 230, 234); border-radius:10px">Wind Speed: ${Math.ceil(data.list[i].wind.speed)} mph, ${(Math.ceil((data.list[i].wind.speed) / 1.151))} kts </div>
                    <div class="windGust fw-bold text-center my-1 fs-5" style="background-color:rgb(222, 230, 234); border-radius:10px">Wind Gust: ${Math.ceil(data.list[i].wind.gust)} mph, ${(Math.ceil((data.list[i].wind.gust) / 1.151))} kts </div>
                    <div class="visibility fw-bold text-center my-1 fs-5" style="background-color:rgb(222, 230, 234); border-radius:10px">Visibility: ${(data.list[i].visibility) / 1000} Statute Miles</div>
                </div>
                `
            }
        })
}
else {
    alert("No City Found!")
}