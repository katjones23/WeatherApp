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
        var APIKey = "&appid=fc3e557a89901d475f37aaf29507552a";
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + inputCity + "&units=imperial" + APIKey;
        var currentDate = moment().format('dddd MMM Do YYYY')

        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(function(response) {
                $(".weatherCard").css("display", "block");

                var iconURl = "http://openweathermap.org/img/wn/" + response.weather[0].icon + ".png";

                $(".cityWeather").html("<h3>" + response.name + ", " + currentDate + "<img src='" + iconURl + "'>" + "</h3>");

                var temperature = response.main.temp;
                var humidity = response.main.humidity;
                var windSpeed = response.wind.speed;
                
                $(".cityWeather").append("<p>Temperature: " + temperature + " °F</p>");
                $(".cityWeather").append("<p>Humidity: " + humidity + "%</p>");
                $(".cityWeather").append("<p>Wind Speed: " + windSpeed + " MPH</p>");

                var UVqueryURL = "http://api.openweathermap.org/data/2.5/uvi?" + APIKey + "&lat=" + response.coord.lat + "&lon=" + response.coord.lon

                $.ajax({
                    url: UVqueryURL,
                    method: "GET"
                })
                    .then(function(response) {
                        var UVIndex = response.value;
                        var UVIndexHTML = $("<p>").html("UV Index: ")
                        var UVBadge = $("<span>").addClass("badge").text(UVIndex)

                        if (UVIndex < 3) {
                            $(UVBadge).css({"background-color": "green", "color": "white"})
                        } else if (UVIndex < 6 && UVIndex >= 3) {
                            $(UVBadge).css({"background-color": "yellow", "color": "white"})
                        } else if (UVIndex < 8 && UVIndex >= 6) {
                            $(UVBadge).css({"background-color": "orange", "color": "white"})
                        } else if (UVIndex < 11 && UVIndex >= 8) {
                            $(UVBadge).css({"background-color": "red", "color": "white"})
                        } else if (UVIndex >= 11) {
                            $(UVBadge).css({"background-color": "violet", "color": "white"})
                        }

                        $(".cityWeather").append(UVIndexHTML);
                        $(UVIndexHTML).append(UVBadge);
                        console.log(response);
                    })
                    .catch(function(error) {
                        alert("uv error")
                    });


                console.log(response);
            })
            .catch(function(error) {
                alert("error");
            });
    });
});
