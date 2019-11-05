const openWeatherurl = 'api.openweathermap.org/data/2.5/weather?'

function watchLocationForm() {
    $('.user-location').on('submit', event => {
        event.preventDefault();
        getLocationValues();
    })
}

function getLocationValues() {
    const city = $('#city').val
}

function loadCountriesMenu(countryObject) {
    const selectEl = document.querySelector('#country');
    const countries = countryObject.forEach(country => {
        let el = document.createElement("option");
        el.textContent = country.name;
        el.value = country.value;
        selectEl.appendChild(el)
    });
    
}

function startApp() {
    loadCountriesMenu(COUNTRY);
    watchLocationForm()
}

$(startApp)