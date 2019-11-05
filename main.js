const openWeatherurl = 'https://api.openweathermap.org/data/2.5/forecast?'
const apiKey = '4b25e1e747da0d35147a5258c7fd6b90';

function getForecast(url) {
    fetch(url)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    })
    .then(responseJson => console.log(responseJson))
    .catch(error => alert('Something went wrong. Please try again.'))
} 


function watchLocationForm() {
    $('.user-location').on('submit', event => {
        event.preventDefault();
        getForecast(formatUrl());
    })
}

function getLocationValues() {
    const city = $('#city').val();
    const country = $('#country').val();
    return [city, country]
}

function formatUrl() {
    const values = getLocationValues();
    const cityName = values[0];
    const countryCode = values[1];
    const url = `${openWeatherurl}q=${cityName},${countryCode}&mode=json`;
    return url
}

function loadCountriesMenu(countryObject) {
    const selectEl = document.querySelector('#country');
    const countries = countryObject.forEach(country => {
        let el = document.createElement("option");
        el.textContent = country.name;
        el.value = country.code;
        selectEl.appendChild(el)
    });
    
}

function startApp() {
    loadCountriesMenu(COUNTRY);
    watchLocationForm()
}

$(startApp)