// Use the [OpenWeather API](https://openweathermap.org/api) to retrieve weather data for cities. The documentation includes a section called 
// "How to start" that will provide basic setup and usage instructions. Use `localStorage` to store any persistent data.

// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city
// WHEN I open the weather dashboard
// THEN I am presented with the last searched city forecast

$(document).ready(function () {

    var prevSearches = [];
    var searchHistory = $(".searchHistory");

    init();

    function init() {
        var storedSearches = JSON.parse(localStorage.getItem("prevSearches"));

        if (storedSearches !== null) {
            prevSearches = storedSearches;
        }

        renderSearchHistory();
    }

    function renderSearchHistory() {
        $(searchHistory).empty();

        for (var i = 0; i < prevSearches.length; i++) {
            var searchedCity = prevSearches[i];

            var div = $("<div>");
            
            $(searchHistory).css("display", "block")
            $(div).text(searchedCity);
            $(div).addClass("card");
            $(searchHistory).prepend(div);
        }
    };

    $("#clear").click(function clearStorage() {
        localStorage.clear();
        $(searchHistory).empty();
    })

    $("#searchBtn").on("click", function () {

        var inputCity = $("#searchCity").val();

        function saveSearch() {
            prevSearches.push(inputCity);
            localStorage.setItem("prevSearches", JSON.stringify(prevSearches));
        };

        saveSearch();

        var APIKey = "&appid=fc3e557a89901d475f37aaf29507552a";
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + inputCity + "&units=imperial" + APIKey;
        var currentDate = moment().format('dddd MMM Do YYYY')

        // Current weather
        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(function (response) {
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
                    .then(function (response) {
                        var UVIndex = response.value;
                        var UVIndexHTML = $("<p>").html("UV Index: ")
                        var UVBadge = $("<span>").addClass("badge").text(UVIndex)

                        if (UVIndex < 3) {
                            $(UVBadge).css({ "background-color": "green", "color": "white" })
                        } else if (UVIndex < 6 && UVIndex >= 3) {
                            $(UVBadge).css({ "background-color": "yellow", "color": "white" })
                        } else if (UVIndex < 8 && UVIndex >= 6) {
                            $(UVBadge).css({ "background-color": "orange", "color": "white" })
                        } else if (UVIndex < 11 && UVIndex >= 8) {
                            $(UVBadge).css({ "background-color": "red", "color": "white" })
                        } else if (UVIndex >= 11) {
                            $(UVBadge).css({ "background-color": "violet", "color": "white" })
                        }

                        $(".cityWeather").append(UVIndexHTML);
                        $(UVIndexHTML).append(UVBadge);
                    })
                    .catch(function (error) {
                        $(UVIndexHTML).text("UV Index data unavailable at this time.")
                    });


            })
            .catch(function (error) {
                $(".weatherCard").css("display", "block");
                $(".weatherCard").text("Weather data unavailable at this time.");
            });

        // 5-Day Forecast 
        var fiveDayQueryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + inputCity + "&units=imperial" + APIKey;

        $.ajax({
            url: fiveDayQueryURL,
            method: "GET"
        })
            .then(function (response) {
                console.log("Five day")
                console.log(response);
            })
            .catch(function (error) {
                alert("Forecast error")
            });
    });
});
