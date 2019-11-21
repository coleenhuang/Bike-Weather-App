'use strict';
const openWeatherurl = 'https://api.openweathermap.org/data/2.5/weather?';
const apiKey = '4b25e1e747da0d35147a5258c7fd6b90';
const forecasturl = 'https://api.weatherbit.io/v2.0/forecast/daily';
const forecastKey = '3d56838f28a549368a4f65e675ad0be9'
let coordinates= {};
let current = {};
let data = {};
let forecastInfo = {};

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
    dateSection.append("<img id='clock' src='Clock.png'>")
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
        loadResults();
    })
}

function loadResults() {
    //Loads the results to the page
    const resultSection = $('.results');
    resultSection.empty();
    callForecast(formatForecasturl());
    resultSection.show();
    restartApp();
}

function generateWeatherResults() {
    //Generates weather results template
    const day = $('#day').val();
    getForecastWeather();
    let weather = `The high and low temperatures are ${forecastInfo.high} and ${forecastInfo.low}. `;
    if (day === 'now') {
        //add current temperature to string to be appended
        weather += `The current temperature is ${current.temp}°C, and the weather is ${current.weather}`;
    }
    else {
        weather += `The weather is ${forecastInfo.description}`;
    }
    
    $('.results').append(`<p>${weather}</p>`)
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
    .catch(error => alert('Data for that location is not available, please try again.'))
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
    .then(responseJson => {getForecastData(responseJson), generateWeatherResults()})
    .catch(error => alert('Data for that time is not available, please try again.'))
}

function formatForecasturl() {
    const { lat, lon } = coordinates;
    const latitude = `lat=${lat}`;
    const longitude = `lon=${lon}`;
    const url = `${forecasturl}?&key=${forecastKey}&${latitude}&${longitude}`;
    console.log(url)
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
    console.log(data);
}

function getForecastWeather() {
    //gets forecasted weather info
    //FIXME: make the data into an global object
    //FIXME: make a function for converting time from unix local
    forecastInfo.high = data.high_temp;
    forecastInfo.low = data.low_temp;
    forecastInfo.description = data.weather.description;
    forecastInfo.sunrise = dayjs.unix(data.sunrise_ts);
    forecastInfo.sunset = dayjs.unix(data.sunset_ts);
    forecastInfo.moonrise = data.moonrise_ts;
    forecastInfo.moonset = data.moonset_ts;
    forecastInfo.moonphase = data.moon_phase;
    console.log(forecastInfo);
}


function bikelight(sunrise, sunset) {
    //tells you whether you need a bike light or not
    let light;
    console.log('chosenTime:', chosenTime);
    console.log('sunrise:', sunrise, 'sunset:', sunset)
   /* if (userTime.isBefore(sunrise)===true) {
        light = `<p>The sun isn't up yet. Remember to bring a bike light!</p>`;
        $('.results').append(light);
        changeNight();
        //getMoon(moonrise, moonset);
    }
    else if (userTime.isAfter(sunset)===true) {
        light = `<p>The sun has already set. Remember to bring a bike light!</p>`;
        $('.results').append(light);
        changeNight();
        //getMoon(moonrise, moonset);
    }*/

}


function getChosenTime() {
    //gets the time selected by the user
    //FIXME: function doesn't work
    //Returns undefined for chosenTime especially when attempting to make it global
    let chosenTime;
    const d = $('#day').val()
    if (d === 'now') {
        // assigns chosenTime to current time
        chosenTime = dayjs();
    }
    else {
        let date = getSelectedDate();
        const t = $('#time').val()
        chosenTime.hour(t).minute(0);
    }

}


function getMoon(moonrise, moonset) {
    if (chosenTime.isAfter(moonrise) && chosenTime.isBefore(moonset)) {
        //moon is present
        alert('hi');
        $('.results').append("<img src='Moon/fullmoon.png'>");
    }
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