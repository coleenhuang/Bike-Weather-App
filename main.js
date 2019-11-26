'use strict';
const openWeatherurl = 'https://api.openweathermap.org/data/2.5/weather?';
const apiKey = '4b25e1e747da0d35147a5258c7fd6b90';
const forecasturl = 'https://api.weatherbit.io/v2.0/forecast/daily';
const forecastKey = '3d56838f28a549368a4f65e675ad0be9';
const moonurl='https://api.met.no/weatherapi/sunrise/2.0/?';
let coordinates= {};
let current = {};
let data = {};
let forecastInfo = {};
let chosenTime = dayjs();

function startApp() {
    loadCountriesMenu(COUNTRY);
    $('.date-response').hide();
    $('.results').hide();
    $('.location-response').show();
    $('body').removeClass('night');
    watchLocationForm();
}

function watchLocationForm() {
    //Adds event listener to form
    $('.user-location').on('submit', event => {
        event.preventDefault();
        callCurrentWeather(formatweatherUrl());
    })
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
    dateSection.append("<img id='clock' src='Clock.png' alt='clock'>")
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
        for (let i=0; i< 24; i++){
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
        for (let j=(hour+1); j< 24; j++){
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
        $('.results').empty();
        callForecast(formatForecasturl());
    })
}

function loadResults() {
    //Loads the results to the page
    const resultSection = $('.results');
    generateWeatherResults();
    resultSection.show();
    restartApp();
}

function generateWeatherResults() {
    //Generates weather results template
    const day = $('#day').val();
    getForecastWeather();
    let weather = `<p>The high and low temperatures are ${forecastInfo.high}°C and ${forecastInfo.low}°C.</p>`;
    if (day === 'now') {
        //add current temperature to string to be appended
        weather += `<p>The current temperature is ${current.temp}°C, and the weather is ${current.weather}.</p>`;
    }
    else {
        weather += `<p>The weather is ${forecastInfo.description.toLowerCase()}.</p>`;
    }
    
    $('.results').append(`${weather}`)
    bikelight(forecastInfo.sunrise, forecastInfo.sunset);
    $('.results').append(`<button class='restart' type='button'>Restart</button>`);
}

function restartApp() {
    $('section').on('click','.restart', event => {
        event.preventDefault();
        startApp();
    })
}


function callCurrentWeather(url) {
    //makes call to weather api
    fetch(url)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    })
    .then(responseJson => {getCurrentConditions(responseJson)
    getCoordinates(responseJson)
    loadDateForm()})
    .catch(error => $('.location-response').append('<p class="error">Sorry, data for that location is not available.</p>'))
}

function formatweatherUrl() {
    //formats url for weather api call
    const values = getLocationValues();
    const cityName = values[0];
    const countryCode = values[1];
    const units = 'units=metric';
    const url = `${openWeatherurl}id=524901&APPID=${apiKey}&q=${cityName},${countryCode}&${units}`;
    return url
}

function callForecast(url) {
    fetch(url)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    })
    .then(responseJson => {getForecastData(responseJson), loadResults()})
    .catch(error => $('.date-response').append('<p class="error">Data for that time is not available, please try again.</p>'))
}

function formatForecasturl() {
    const { lat, lon } = coordinates;
    const latitude = `lat=${lat}`;
    const longitude = `lon=${lon}`;
    const url = `${forecasturl}?&key=${forecastKey}&${latitude}&${longitude}`;
    return url
}

function getLocationValues() {
    //Gets values from location form
    const city = $('#city').val();
    const country = $('#country').val();
    return [city, country]
}

function getCoordinates(responseJson) {
    //Gets the coordinates
    coordinates.lon = responseJson.coord.lon;
    coordinates.lat = responseJson.coord.lat;
}

function getCurrentConditions(responseJson) {
    //Gets the current weather and temperature
    current.weather = responseJson.weather[0].description;
    current.temp = responseJson.main.temp;
}


function getSelectedDate () {
    //Gets the date the user selected
    const num = getDays()
    const day = dayjs().add(num, 'day');
    return day
}

function getDays() {
    let date = $('#day').val();
    if (date === 'now') {
        date = 0;
    }
    return date
}

function getForecastData(responseJson) {
    //gets the forecast data for the selected day
    const date = getSelectedDate();
    data = responseJson.data.find(day => day.valid_date === date.format('YYYY-MM-DD'));
}

function getForecastWeather() {
    //gets forecasted weather info
    forecastInfo.high = data.high_temp;
    forecastInfo.low = data.low_temp;
    forecastInfo.description = data.weather.description;
    forecastInfo.sunrise = dayjs.unix(data.sunrise_ts);
    forecastInfo.sunset = dayjs.unix(data.sunset_ts);
    forecastInfo.moonrise = dayjs.unix(data.moonrise_ts);
    forecastInfo.moonset = dayjs.unix(data.moonset_ts);
    forecastInfo.moonphase = data.moon_phase;
}


function bikelight(sunrise, sunset) {
    //tells you whether you need a bike light or not
    let light;
    getChosenTime();
    console.log('chosenTime:', chosenTime);
    console.log('sunrise:', sunrise, 'sunset:', sunset)
   if (chosenTime.isBefore(sunrise)===true) {
        light = `<p>The sun isn't up yet. Remember to bring a bike light!</p>`;
        $('.results').append(light);
        changeNight();
        getMoon();
    }
    else if (chosenTime.isAfter(sunset)===true) {
        light = `<p>The sun has already set. Remember to bring a bike light!</p>`;
        $('.results').append(light);
        changeNight();
        getMoon();
    }

}


function getChosenTime() {
    //gets the time selected by the user
    const d = $('#day').val();
    if (d !== 'now') {
        let date = getSelectedDate();
        const t = $('#time').val();
        chosenTime = dayjs(date).hour(t).minute(0);
    }
}


function getMoon() {
    //sees if moon is in the sky or not
    let moonrise = forecastInfo.moonrise;
    let moonset = forecastInfo.moonset;
    let phase = forecastInfo.moonphase*100;
    if (chosenTime.isAfter(moonrise) && chosenTime.isBefore(moonset)) {
        //moon is present
        let moonImage = getMoonPhaseImage(phase);
        $('.results').prepend(`<img src='${moonImage}'>`);
    }
}

function getMoonPhaseImage(phase = 0) {
    //Gets the right image depending on the phase of the moon
    const MOON = {
        0: `<img src='Moon/newmoon.png' alt='new moon'>`,
        25: `<img src='Moon/crescent.png' alt='crescent moon'>`,
        5: `<img src='Moon/quarter.png' alt='quarter moon'>`,
        75: `<img src='Moon/gibbous.png' alt='gibbous moon'>`,
        100: `<img src='Moon/fullmoon.png' alt='full moon'>`,
    }
    const key = Number.parseInt(phase/25, 10) * 25
    return MOON[key] || MOON[0]
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

function changeNight(){
    $('body').addClass('night')
}


$(startApp)