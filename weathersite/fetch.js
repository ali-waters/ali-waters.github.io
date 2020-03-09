var url = "";
function getWeatherData(url) {
    fetch(url)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            throw new ERROR('Network response was not OK.');
        })
        .then(function (data) {

        })
    .catch(function (error) {
        console.log('There was a fetch problem: ', error.message);
    })
    }

getWeatherData(url);