const openWeatherurl = 'api.openweathermap.org/data/2.5/forecast?'

function getForecast(url) {
    fetch()
} 


function watchLocationForm() {
    $('.user-location').on('submit', event => {
        event.preventDefault();
        formatUrl();
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
    const url = `${openWeatherurl}q=${cityName},${countryCode}`;
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