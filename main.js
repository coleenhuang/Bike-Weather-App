const openWeatherurl = 'https://api.openweathermap.org/data/2.5/weather?';
const futureWeatherurl = 'https://api.openweathermap.org/data/2.5/forecast?'
const apiKey = '4b25e1e747da0d35147a5258c7fd6b90';
const sunriseurl ='https://api.met.no/weatherapi/sunrise/2.0/?';
const locationforecasturl = 'https://api.met.no/weatherapi/locationforecast/1.9/?'
const coordinates= {};


function watchLocationForm() {
    //Adds event listener to form
    $('.user-location').on('submit', event => {
        event.preventDefault();
        checkWeather(formatweatherUrl());
        loadDateForm();
    })
}

function checkWeather(url) {
    //makes call to weather api
    fetch(url)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    })
    .then(responseJson => {getCurrentConditions(responseJson)
    getCoordinates(responseJson)})
    .catch(error => alert('Data for that location is not available, please try again.'))
} 

function getLocationValues() {
    //Gets values from location form
    const city = $('#city').val();
    const country = $('#country').val();
    return [city, country]
}

function formatweatherUrl() {
    //formats url for weather api call
    const values = getLocationValues();
    const cityName = values[0];
    const countryCode = values[1];
    const url = `${openWeatherurl}id=524901&APPID=${apiKey}&q=${cityName},${countryCode}&mode=json`;
    return url
}

function loadDateForm(){
    //loads time selection page
    const locationSection = $('.location-response')
    const dateSection = $('.date-response')
    const question = `<h2>When are you planning to use your bike?</h2>`
    const answer = `
    <form id='datetime'>
        <select id="day">
            <option value="now">Right now</option>
            <option value=0>Later today</option>
            <option value=1>Tomorrow</option>
            <option value=2>The day after tomorrow</option>
        </select>
        <select id="time"></select>
        <button type='submit'>Submit</button>
    <form>
    `
    locationSection.hide();
    dateSection.empty().append(question).append(answer).show();
    $('#time').hide();
    showTimeMenu();
    watchDateForm();
}

function showTimeMenu(){
    //Shows time dropdown if option different from right now is selected
    //in day dropdown menu
    let dayMenu = document.querySelector('#day');
    let timeMenu = $('#time');
    dayMenu.addEventListener('change', e => {
        let index = dayMenu.selectedIndex
        let val = dayMenu.options[index].value;
        if (val !== 'now') {
            loadTimeOptions();
            timeMenu.show();    
        }
        else {
            timeMenu.hide();
        }
    })
}

function loadTimeOptions() {
    //loads options in time dropdown menu
    let dayMenu = document.querySelector('#day');
    let value = dayMenu.options[dayMenu.selectedIndex].value;
    let timeMenu = document.querySelector('#time');
    if (value > 0) {
        timeMenu.innerHTML= '';
        for (let i=0; i<=24; i++){
            let el = document.createElement("option");
            el.textContent = `${i}:00`;
            el.value = i;
            timeMenu.appendChild(el)
        }
    }
    else {
        timeMenu.innerHTML= '';
        const today = new Date();
        const hour = today.getHours();
        for (let j=hour; j<=24; j++){
            let el = document.createElement("option");
            el.textContent = `${j}:00`;
            el.value = j;
            timeMenu.appendChild(el)
        }
    }
}

function watchDateForm() {
    //Adds event listener to date and time form
    $('#datetime').on('submit', event => {
        event.preventDefault();
        $('.date-response').hide();
        loadResults();
    })
}


function loadResults() {
    //Loads the results to the page
    whichWeather();
    $('.results').show();
}

function whichWeather() {
    //Decides which api to call based on date selected
    
    const day = $('#day').val();
    if (day === 'now') {
        callSunrise(formatSunriseurl());
    }
    else {
        if (day === 0) {
            //callLocationForecast()
        }
        else {
            //callFutureWeather(formatfutureweatherUrl());
        }
    }
}


function getCurrentConditions(responseJson) {
   const weatherConditions = responseJson.weather[0].description;
    const Kelvin = responseJson.main.temp;
   const celsius = KelvintoCelsius(Kelvin);
    const weatherText = `
    <p>The current weather outside is ${weatherConditions}.
    And the temperature is ${parseInt(celsius)}C</p>`;
    $('.results').append(weatherText);
}

function callLocationForecast(url) {
    //Makes call to location forecast api
    fetch(url)
    .then(response => {
        if (response.ok) {
            return response.xml();
        }
        throw new Error(response.statusText);
    })
    .then(responseXML => console.log(responseXML))
    .catch(error => alert('Something went wrong. Please try again.'))
}

function formatlocationforecastturl(coordinates) {
    const { lat, lon } = coordinates;
    const latitude = `lat=${lat}`;
    const longitude = `lon=${lon}`;
    const url = `${locationforecasturl}${latitude}&${longitude}`
}

function callFutureWeather(url) {

}

function formatfutureweatherUrl() {
    //formats url for weather api call
    const values = getLocationValues();
    const cityName = values[0];
    const countryCode = values[1];
    const url = `${futureWeatherurl}id=524901&APPID=${apiKey}&q=${cityName},${countryCode}&mode=json`;
    return url
}

function KelvintoCelsius(K) {
    //Converts Kelvin to celsius
    return K - 273.15;
}



function getTime() {
    //gets the time 
}

function callSunrise(url) {
    //Makes call to sunrise api
    fetch(url)
    .then(response => {
        if (response.ok) {
            return response.text();
        }
        throw new Error(response.statusText);
    })
    .then(str => (new window.DOMParser())
    .parseFromString(str, "text/xml"))
    .then(xml => console.log(xml))
    .catch(error => alert('Something went wrong. Please try again.'))
}


function formatSunriseurl() {
    //Formats url for sunrise api call
    const { lat, lon } = coordinates;
    const latitude = `lat=${lat}`;
    const longitude = `lon=${lon}`;
    const date = `date=${formatDate()}`
    const offset = `offset=+${getTimeZoneOffset()}`;
    const url = `${sunriseurl}${latitude}&${longitude}&${date}&${offset}`
    console.log(url)
    return url
}

function getCoordinates(responseJson) {
    //Gets the coordinates
    coordinates.lon = responseJson.coord.lon;
    coordinates.lat = responseJson.coord.lat;
}

function getDays() {
    let date = $('#day').val();
    if (date === 'now') {
        date = 0;
    }
    console.log(date);
    return date
}

function formatDate(date) {
    //Gets time and date
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth()+1;
    let day = today.getDate()+ parseInt(date);
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
    return `${year}-${month}-${day}`
}

function getTimeZoneOffset() {
    //gets time zone offset
    const d = new Date();
    const offsetMin = d.getTimezoneOffset();
    return convertMinsToHrsMins(offsetMin);
}

function convertMinsToHrsMins(mins) {
    //Converts mins to HH:MM format 
    let h = Math.floor(mins / 60);
    let m = mins % 60;
    h = h < 10 ? '0' + h : h;
    m = m < 10 ? '0' + m : m;
    return `${h}\:${m}`;
  }


function loadCountriesMenu(countryObject) {
    //loads dropdown menu for countries
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