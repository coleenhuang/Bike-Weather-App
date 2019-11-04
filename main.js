const geoCodeurl = 'https://www.mapquestapi.com/geocoding/v1/address';

function getCoordinates(url) {
    //converts the location into coordinates
    fetch(url)
    .then(response => response.json())
    .then(responseJson => getLatLng(responseJson))
}

function generateGeoquery(location) {
    //generates the url to get coordinates
}

function getLatLng(responseJson){
    //gets the specific latitude and longitude from the json response
    const latlng = responseJson.locations[0].latLng;
    const latitude = latlng.lat;
    const longitude = latlng.lng;
    return [latitude, longitude]
}

function watchLocationForm() {
    $('.user-location').on('submit', event => {
        event.preventDefault();
        const location = $('#location').val();
    })
}

$(watchLocationForm)