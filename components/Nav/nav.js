fetch('./components/Nav/nav.html')
    .then(response => response.text())
    .then(data => {
        document.querySelector('HeaderNav').innerHTML += `${data}
        `
    })