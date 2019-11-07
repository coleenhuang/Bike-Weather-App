const openWeatherurl = 'https://api.openweathermap.org/data/2.5/weather?';
const apiKey = '4b25e1e747da0d35147a5258c7fd6b90';
const sunriseurl ='https://api.met.no/weatherapi/sunrise/2.0/?';



function watchLocationForm() {
    //Adds event listener to form
    $('.user-location').on('submit', event => {
        event.preventDefault();
        //getWeather(formatUrl());
        loadDateForm();
    })
}

function getWeather(url) {
    //makes call to weather api
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
    const sectionEl = $('.user-response')
    sectionEl.hide().empty();
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
        <button>Submit</button>
    <form>
    `
    sectionEl.append(question).append(answer).show();
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
        $('.user-response').hide();
        loadResults();
    })
}


function loadResults() {
    //Loads the results to the page
    //FIX ME: move the sunrise function later
    formatSunriseurl()
    $('.results').show();
}

function getCoordinates(responseJson) {
    //Gets the coordinates
    let coordinates = responseJson.coord;
    console.log([coordinates.lat, coordinates.lon]);
    return [coordinates.lat, coordinates.lon]
}

function getSunrise() {
    //Makes call to sunrise api

}

function formatSunriseurl() {
    //Formats url for sunrise api call
    const coordinates = getCoordinates(TEST);
    const lat = `lat=${coordinates[0]}`;
    const lon = `lon=${coordinates[1]}`;
    const date = `date=${formatDateTime}`
    const offset = `offset=${getTimeZoneOffset()}`;
    const url = `${sunriseurl}${lat}&${lon}&${date}&${offset}`
    console.log('url')
    return url
}

function formatDateTime() {
    //Gets time and date
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth()+1; 
    let day = today.getDate();
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
    return `${h}:${m}`;
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