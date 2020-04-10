// Use the [OpenWeather API](https://openweathermap.org/api) to retrieve weather data for cities. The documentation includes a section called 
// "How to start" that will provide basic setup and usage instructions. Use `localStorage` to store any persistent data.

// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city
// WHEN I open the weather dashboard
// THEN I am presented with the last searched city forecast

$(document).ready(function () {

    $("button").on("click", function () {

        var inputCity = $("#searchCity").val();
        console.log(inputCity);
        var APIKey = "&appid=fc3e557a89901d475f37aaf29507552a";
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + inputCity + APIKey;
        console.log(queryURL);

        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(function (response) {
                $(".cityWeather").html("<h3>" + response.name + "</h3>")
                // var dateUTC = response.dt
                // var localDate = moment.utc(dateUTC).local().format();
                console.log(localDate);
                console.log(response);
            })
            .catch(function (error) {
                alert("error");
            });
    });
});
