let currentSelection = sessionStorage.getItem("selectedCity")
if (currentSelection) {
    currentSelection = currentSelection.replace("[", "")
    currentSelection = currentSelection.replace("]", "")
    currentSelection = currentSelection.split(" ")
    fetch(`https://api.openweathermap.org/data/2.5/forecast?appid=df22cc6d986066e36e5c9fca1db5de13&q=${currentSelection}&units=imperial`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            for (let index = 1; index <= data.cnt; index++) {

                console.log(`Executed ${index}`);
            }
        })
}
else{
    alert("No City Found!")
}