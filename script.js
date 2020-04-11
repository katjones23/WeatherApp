$(document).ready(function () {

    var prevSearches = [];
    var searchHistory = $(".searchHistory");

    init();

    function init() {
        var storedSearches = JSON.parse(localStorage.getItem("prevSearchesStore"));

        if (storedSearches !== null) {
            prevSearches = storedSearches;
            renderSearchHistory();
        } else {
            return;
        };
    };

    function renderSearchHistory() {
        $(searchHistory).empty();

        var inputCity = prevSearches[prevSearches.length - 1];

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

                var iconURl = "https://openweathermap.org/img/wn/" + response.weather[0].icon + ".png";

                $(".cityWeather").html("<h3>" + response.name + ", " + currentDate + "<img src='" + iconURl + "'>" + "</h3>");

                var temperature = response.main.temp;
                var humidity = response.main.humidity;
                var windSpeed = response.wind.speed;

                $(".cityWeather").append("<p>Temperature: " + temperature + " °F</p>");
                $(".cityWeather").append("<p>Humidity: " + humidity + "%</p>");
                $(".cityWeather").append("<p>Wind Speed: " + windSpeed + " MPH</p>");

                var UVqueryURL = "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/uvi?" + APIKey + "&lat=" + response.coord.lat + "&lon=" + response.coord.lon

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
                // Store response in an array
                var fiveDayArr = response.list
                var dayOne = [];
                var dayTwo = [];
                var dayThree = [];
                var dayFour = [];
                var dayFive = [];

                var firstDate = moment(fiveDayArr[0].dt_txt).format();
                var secondDate = moment(firstDate).add(1, 'days').format();
                var thirdDate = moment(firstDate).add(2, 'days').format();
                var fourthDate = moment(firstDate).add(3, 'days').format();
                var fifthDate = moment(firstDate).add(4, 'days').format();

                // split up the array in the five different dates
                for (var i = 0; i < fiveDayArr.length; i++) {
                    var itemDate = moment(fiveDayArr[i].dt_txt).format();

                    if (itemDate < secondDate) {
                        dayOne.push(fiveDayArr[i]);
                    } else if (itemDate < thirdDate) {
                        dayTwo.push(fiveDayArr[i]);
                    } else if (itemDate < fourthDate) {
                        dayThree.push(fiveDayArr[i]);
                    } else if (itemDate < fifthDate) {
                        dayFour.push(fiveDayArr[i]);
                    } else {
                        dayFive.push(fiveDayArr[i]);
                    };
                };

                // For each day, find the highest temp
                function findHighTemp(arr) {
                    var highTemp = 0;

                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i].main.temp > highTemp) {
                            highTemp = arr[i].main.temp
                        };
                    };

                    return highTemp;
                };

                var dayOneTemp = findHighTemp(dayOne);
                var dayTwoTemp = findHighTemp(dayTwo);
                var dayThreeTemp = findHighTemp(dayThree);
                var dayFourTemp = findHighTemp(dayFour);
                var dayFiveTemp = findHighTemp(dayFive);

                // For each day, find highest humidity
                function findHumidity(arr) {
                    var maxHumidity = 0;

                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i].main.humidity > maxHumidity) {
                            maxHumidity = arr[i].main.humidity
                        };
                    };

                    return maxHumidity;
                };

                var dayOneHum = findHumidity(dayOne);
                var dayTwoHum = findHumidity(dayTwo);
                var dayThreeHum = findHumidity(dayThree);
                var dayFourHum = findHumidity(dayFour);
                var dayFiveHum = findHumidity(dayFive);

                // get formatted date
                function getDate(arr) {
                    var date = moment(arr[0].dt_txt).format("l");
                    return date;
                }

                var dayOneDate = getDate(dayOne);
                var dayTwoDate = getDate(dayTwo);
                var dayThreeDate = getDate(dayThree);
                var dayFourDate = getDate(dayFour);
                var dayFiveDate = getDate(dayFive);

                // find icon
                function getIconArray(arr) {
                    var iconArray = [];

                    for (var i = 0; i < arr.length; i++) {
                        iconArray.push(arr[i].weather[0].icon);
                    };

                    return iconArray;
                };

                var dayOneIA = getIconArray(dayOne);
                var dayTwoIA = getIconArray(dayTwo);
                var dayThreeIA = getIconArray(dayThree);
                var dayFourIA = getIconArray(dayFour);
                var dayFiveIA = getIconArray(dayFive);

                function getIcon(arr) {

                    var result = {};

                    // https://stackoverflow.com/a/5668116/11805572; 
                    for (var i = 0; i < arr.length; ++i) {
                        if (!result[arr[i]])
                            result[arr[i]] = 0;
                        ++result[arr[i]];
                    };

                    var iconID = Object.keys(result);
                    var iconInstances = Object.values(result);

                    var instances = 0;
                    var iconIndex = 0;

                    function findIconInstances(arr2) {
                        for (var i = 0; i < arr2.length; i++) {
                            if (parseInt(arr2[i]) > instances) {
                                instances = arr2[i];
                                iconIndex = i;
                            };
                        };

                        return iconIndex;
                    };

                    findIconInstances(iconInstances);

                    var foundIcon = iconID[iconIndex]

                    return foundIcon;
                };

                var dayOneIcon = getIcon(dayOneIA);
                var dayTwoIcon = getIcon(dayTwoIA);
                var dayThreeIcon = getIcon(dayThreeIA);
                var dayFourIcon = getIcon(dayFourIA);
                var dayFiveIcon = getIcon(dayFiveIA);

                var dayOneIconURl = "https://openweathermap.org/img/wn/" + dayOneIcon + ".png";
                var dayTwoIconURl = "https://openweathermap.org/img/wn/" + dayTwoIcon + ".png";
                var dayThreeIconURl = "https://openweathermap.org/img/wn/" + dayThreeIcon + ".png";
                var dayFourIconURl = "https://openweathermap.org/img/wn/" + dayFourIcon + ".png";
                var dayFiveIconURl = "https://openweathermap.org/img/wn/" + dayFiveIcon + ".png";

                // Add to page
                $(".fiveDay").css("display", "block");

                $(".dayOneDate").text(dayOneDate);
                $(".dayOneIcon").attr("src", dayOneIconURl);
                $(".dayOneTemp").text("Temp: " + dayOneTemp + " °F");
                $(".dayOneHumidity").text("Humidity: " + dayOneHum + "%");

                $(".dayTwoDate").text(dayTwoDate);
                $(".dayTwoIcon").attr("src", dayTwoIconURl);
                $(".dayTwoTemp").text("Temp: " + dayTwoTemp + " °F");
                $(".dayTwoHumidity").text("Humidity: " + dayTwoHum + "%");

                $(".dayThreeDate").text(dayThreeDate);
                $(".dayThreeIcon").attr("src", dayThreeIconURl);
                $(".dayThreeTemp").text("Temp: " + dayThreeTemp + " °F");
                $(".dayThreeHumidity").text("Humidity: " + dayThreeHum + "%");

                $(".dayFourDate").text(dayFourDate);
                $(".dayFourIcon").attr("src", dayFourIconURl);
                $(".dayFourTemp").text("Temp: " + dayFourTemp + " °F");
                $(".dayFourHumidity").text("Humidity: " + dayFourHum + "%");

                $(".dayFiveDate").text(dayFiveDate);
                $(".dayFiveIcon").attr("src", dayFiveIconURl);
                $(".dayFiveTemp").text("Temp: " + dayFiveTemp + " °F");
                $(".dayFiveHumidity").text("Humidity: " + dayFiveHum + "%");
            })
            .catch(function (error) {
                $(".fiveDay").css("display", "block");
                $(".forecast-cards").css("display", "none");
                $(".fiveDay").text("Forecast data unavailable at this time.");
            });


        for (var i = 0; i < prevSearches.length; i++) {
            var searchedCity = prevSearches[i];

            var div = $("<div>");

            $(searchHistory).css("display", "block")
            $(div).text(searchedCity);
            $(div).addClass("card");
            $(searchHistory).prepend(div);
        }
    };

    $("#clear").click(function clearStorage(event) {
        event.stopPropagation();
        localStorage.clear();
        $(searchHistory).empty();
    })

    $("form").on("submit", function(event) {
        if (event.preventDefault) { 
            event.preventDefault(); 
        } else { event.returnValue = false; }
        
        event.stopImmediatePropagation();
        
        var inputCity = $("#searchCity").val();

        if (inputCity.search(/(?<=,)(.*al)/i) !== -1) {
            inputCity = inputCity.replace(/[^,]*$/,"Alabama")
        } else if (inputCity.search(/(?<=,)(.*ak)/i) !== -1) {
            inputCity = inputCity.replace(/[^,]*$/,"Alaska")
        } else if (inputCity.search(/(?<=,)(.*az)/i) !== -1) {
            inputCity = inputCity.replace(/[^,]*$/,"Arizona")
        } else if (inputCity.search(/(?<=,)(.*ar)/i) !== -1) {
            inputCity = inputCity.replace(/[^,]*$/,"Arkansas")
        } else if (inputCity.search(/(?<=,)(.*ca)/i) !== -1) {
            inputCity = inputCity.replace(/[^,]*$/,"California")
        } else if (inputCity.search(/(?<=,)(.*co)/i) !== -1) {
            inputCity = inputCity.replace(/[^,]*$/,"Colorado")
        } else if (inputCity.search(/(?<=,)(.*ct)/i) !== -1) {
            inputCity = inputCity.replace(/[^,]*$/,"Connecticut")
        } else if (inputCity.search(/(?<=,)(.*de)/i) !== -1) {
            inputCity = inputCity.replace(/[^,]*$/,"Delaware")
        } else if (inputCity.search(/(?<=,)(.*fl)/i) !== -1) {
            inputCity = inputCity.replace(/[^,]*$/, "Florida")
        } else if (inputCity.search(/(?<=,)(.*ga)/i) !== -1) {
            inputCity = inputCity.replace(/[^,]*$/,"Georgia")
        } else if (inputCity.search(/(?<=,)(.*hi)/i) !== -1) {
            inputCity = inputCity.replace(/[^,]*$/,"Hawaii")
        } else if (inputCity.search(/(?<=,)(.*id)/i) !== -1) {
            inputCity = inputCity.replace(/[^,]*$/,"Idaho")
        } else if (inputCity.search(/(?<=,)(.*il)/i) !== -1) {
            inputCity = inputCity.replace(/[^,]*$/,"Illinois")
        } else if (inputCity.search(/(?<=,)(.*in)/i) !== -1) {
            inputCity = inputCity.replace(/[^,]*$/,"Indiana")
        } else if (inputCity.search(/(?<=,)(.*ia)/i) !== -1) {
            inputCity = inputCity.replace(/[^,]*$/,"Iowa")
        } else if (inputCity.search(/(?<=,)(.*ks)/i) !== -1) {
            inputCity = inputCity.replace(/[^,]*$/,"Kansas")
        } else if (inputCity.search(/(?<=,)(.*ky)/i) !== -1) {
            inputCity = inputCity.replace(/[^,]*$/,"Kentucky")
        } else if (inputCity.search(/(?<=,)(.*la)/i) !== -1) {
            inputCity = inputCity.replace(/[^,]*$/,"Louisiana")
        } else if (inputCity.search(/(?<=,)(.*me)/i) !== -1) {
            inputCity = inputCity.replace(/[^,]*$/,"Maine")
        } else if (inputCity.search(/(?<=,)(.*md)/i) !== -1) {
            inputCity = inputCity.replace(/[^,]*$/,"Maryland")
        } else if (inputCity.search(/(?<=,)(.*ma)/i) !== -1) {
            inputCity = inputCity.replace(/[^,]*$/,"Massachusetts")
        } else if (inputCity.search(/(?<=,)(.*mi)/i) !== -1) {
            inputCity = inputCity.replace(/[^,]*$/,"Michigan")
        } else if (inputCity.search(/(?<=,)(.*mn)/i) !== -1) {
            inputCity = inputCity.replace(/[^,]*$/,"Minnesota")
        } else if (inputCity.search(/(?<=,)(.*ms)/i) !== -1) {
            inputCity = inputCity.replace(/[^,]*$/,"Mississippi")
        } else if (inputCity.search(/(?<=,)(.*mo)/i) !== -1) {
            inputCity = inputCity.replace(/[^,]*$/,"Missouri")
        } else if (inputCity.search(/(?<=,)(.*mt)/i) !== -1) {
            inputCity = inputCity.replace(/[^,]*$/,"Montana")
        } else if (inputCity.search(/(?<=,)(.*ne)/i) !== -1) {
            inputCity = inputCity.replace(/[^,]*$/,"Nebraska")
        } else if (inputCity.search(/(?<=,)(.*nv)/i) !== -1) {
            inputCity = inputCity.replace(/[^,]*$/,"Nevada")
        } else if (inputCity.search(/(?<=,)(.*nh)/i) !== -1) {
            inputCity = inputCity.replace(/[^,]*$/,"New Hampshire")
        } else if (inputCity.search(/(?<=,)(.*nj)/i) !== -1) {
            inputCity = inputCity.replace(/[^,]*$/,"New Jersey")
        } else if (inputCity.search(/(?<=,)(.*nm)/i) !== -1) {
            inputCity = inputCity.replace(/[^,]*$/,"New Mexico")
        } else if (inputCity.search(/(?<=,)(.*ny)/i) !== -1) {
            inputCity = inputCity.replace(/[^,]*$/, "New York")
        } else if (inputCity.search(/(?<=,)(.*nc)/i) !== -1) {
            inputCity = inputCity.replace(/[^,]*$/,"North Carolina")
        } else if (inputCity.search(/(?<=,)(.*nd)/i) !== -1) {
            inputCity = inputCity.replace(/[^,]*$/,"North Dakota")
        } else if (inputCity.search(/(?<=,)(.*oh)/i) !== -1) {
            inputCity = inputCity.replace(/[^,]*$/,"Ohio")
        } else if (inputCity.search(/(?<=,)(.*ok)/i) !== -1) {
            inputCity = inputCity.replace(/[^,]*$/,"Oklahoma")
        } else if (inputCity.search(/(?<=,)(.*or)/i) !== -1) {
            inputCity = inputCity.replace(/[^,]*$/,"Oregon")
        } else if (inputCity.search(/(?<=,)(.*pa)/i) !== -1) {
            inputCity = inputCity.replace(/[^,]*$/,"Pennsylvania")
        } else if (inputCity.search(/(?<=,)(.*ri)/i) !== -1) {
            inputCity = inputCity.replace(/[^,]*$/,"Rhode Island")
        } else if (inputCity.search(/(?<=,)(.*sc)/i) !== -1) {
            inputCity = inputCity.replace(/[^,]*$/,"South Carolina")
        } else if (inputCity.search(/(?<=,)(.*sd)/i) !== -1) {
            inputCity = inputCity.replace(/[^,]*$/,"South Dakota")
        } else if (inputCity.search(/(?<=,)(.*tn)/i) !== -1) {
            inputCity = inputCity.replace(/[^,]*$/,"Tennessee")
        } else if (inputCity.search(/(?<=,)(.*tx)/i) !== -1) {
            inputCity = inputCity.replace(/[^,]*$/,"Texas")
        } else if (inputCity.search(/(?<=,)(.*ut)/i) !== -1) {
            inputCity = inputCity.replace(/[^,]*$/,"Utah")
        } else if (inputCity.search(/(?<=,)(.*vt)/i) !== -1) {
            inputCity = inputCity.replace(/[^,]*$/,"Vermont")
        } else if (inputCity.search(/(?<=,)(.*va)/i) !== -1) {
            inputCity = inputCity.replace(/[^,]*$/,"Virginia")
        } else if (inputCity.search(/(?<=,)(.*wa)/i) !== -1) {
            inputCity = inputCity.replace(/[^,]*$/,"Washington")
        } else if (inputCity.search(/(?<=,)(.*wv)/i) !== -1) {
            inputCity = inputCity.replace(/[^,]*$/,"West Virginia")
        } else if (inputCity.search(/(?<=,)(.*wi)/i) !== -1) {
            inputCity = inputCity.replace(/[^,]*$/,"Wisconsin")
        } else if (inputCity.search(/(?<=,)(.*wy)/i) !== -1) {
            inputCity = inputCity.replace(/[^,]*$/,"Wyoming")
        }; 

        function saveSearch() {
            var div = $("<div>")

            $(searchHistory).css("display", "block")
            $(div).text(inputCity);
            $(div).addClass("card");
            $(searchHistory).prepend(div);

            prevSearches.push(inputCity);
            localStorage.setItem("prevSearchesStore", JSON.stringify(prevSearches));

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

                var iconURl = "https://openweathermap.org/img/wn/" + response.weather[0].icon + ".png";

                $(".cityWeather").html("<h3>" + response.name + ", " + currentDate + "<img src='" + iconURl + "'>" + "</h3>");

                var temperature = response.main.temp;
                var humidity = response.main.humidity;
                var windSpeed = response.wind.speed;

                $(".cityWeather").append("<p>Temperature: " + temperature + " °F</p>");
                $(".cityWeather").append("<p>Humidity: " + humidity + "%</p>");
                $(".cityWeather").append("<p>Wind Speed: " + windSpeed + " MPH</p>");

                var UVqueryURL = "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/uvi?" + APIKey + "&lat=" + response.coord.lat + "&lon=" + response.coord.lon

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
                // Store response in an array
                var fiveDayArr = response.list
                var dayOne = [];
                var dayTwo = [];
                var dayThree = [];
                var dayFour = [];
                var dayFive = [];

                var firstDate = moment(fiveDayArr[0].dt_txt).format();
                var secondDate = moment(firstDate).add(1, 'days').format();
                var thirdDate = moment(firstDate).add(2, 'days').format();
                var fourthDate = moment(firstDate).add(3, 'days').format();
                var fifthDate = moment(firstDate).add(4, 'days').format();

                // split up the array in the five different dates
                for (var i = 0; i < fiveDayArr.length; i++) {
                    var itemDate = moment(fiveDayArr[i].dt_txt).format();

                    if (itemDate < secondDate) {
                        dayOne.push(fiveDayArr[i]);
                    } else if (itemDate < thirdDate) {
                        dayTwo.push(fiveDayArr[i]);
                    } else if (itemDate < fourthDate) {
                        dayThree.push(fiveDayArr[i]);
                    } else if (itemDate < fifthDate) {
                        dayFour.push(fiveDayArr[i]);
                    } else {
                        dayFive.push(fiveDayArr[i]);
                    };
                };

                // For each day, find the highest temp
                function findHighTemp(arr) {
                    var highTemp = 0;

                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i].main.temp > highTemp) {
                            highTemp = arr[i].main.temp
                        };
                    };

                    return highTemp;
                };

                var dayOneTemp = findHighTemp(dayOne);
                var dayTwoTemp = findHighTemp(dayTwo);
                var dayThreeTemp = findHighTemp(dayThree);
                var dayFourTemp = findHighTemp(dayFour);
                var dayFiveTemp = findHighTemp(dayFive);

                // For each day, find highest humidity
                function findHumidity(arr) {
                    var maxHumidity = 0;

                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i].main.humidity > maxHumidity) {
                            maxHumidity = arr[i].main.humidity
                        };
                    };

                    return maxHumidity;
                };

                var dayOneHum = findHumidity(dayOne);
                var dayTwoHum = findHumidity(dayTwo);
                var dayThreeHum = findHumidity(dayThree);
                var dayFourHum = findHumidity(dayFour);
                var dayFiveHum = findHumidity(dayFive);

                // get formatted date
                function getDate(arr) {
                    var date = moment(arr[0].dt_txt).format("l");
                    return date;
                }

                var dayOneDate = getDate(dayOne);
                var dayTwoDate = getDate(dayTwo);
                var dayThreeDate = getDate(dayThree);
                var dayFourDate = getDate(dayFour);
                var dayFiveDate = getDate(dayFive);

                // find icon
                function getIconArray(arr) {
                    var iconArray = [];

                    for (var i = 0; i < arr.length; i++) {
                        iconArray.push(arr[i].weather[0].icon);
                    };

                    return iconArray;
                };

                var dayOneIA = getIconArray(dayOne);
                var dayTwoIA = getIconArray(dayTwo);
                var dayThreeIA = getIconArray(dayThree);
                var dayFourIA = getIconArray(dayFour);
                var dayFiveIA = getIconArray(dayFive);

                function getIcon(arr) {

                    var result = {};

                    // https://stackoverflow.com/a/5668116/11805572; 
                    for (var i = 0; i < arr.length; ++i) {
                        if (!result[arr[i]])
                            result[arr[i]] = 0;
                        ++result[arr[i]];
                    };

                    var iconID = Object.keys(result);
                    var iconInstances = Object.values(result);

                    var instances = 0;
                    var iconIndex = 0;

                    function findIconInstances(arr2) {
                        for (var i = 0; i < arr2.length; i++) {
                            if (parseInt(arr2[i]) > instances) {
                                instances = arr2[i];
                                iconIndex = i;
                            };
                        };

                        return iconIndex;
                    };

                    findIconInstances(iconInstances);

                    var foundIcon = iconID[iconIndex]

                    return foundIcon;
                };

                var dayOneIcon = getIcon(dayOneIA);
                var dayTwoIcon = getIcon(dayTwoIA);
                var dayThreeIcon = getIcon(dayThreeIA);
                var dayFourIcon = getIcon(dayFourIA);
                var dayFiveIcon = getIcon(dayFiveIA);

                var dayOneIconURl = "https://openweathermap.org/img/wn/" + dayOneIcon + ".png";
                var dayTwoIconURl = "https://openweathermap.org/img/wn/" + dayTwoIcon + ".png";
                var dayThreeIconURl = "https://openweathermap.org/img/wn/" + dayThreeIcon + ".png";
                var dayFourIconURl = "https://openweathermap.org/img/wn/" + dayFourIcon + ".png";
                var dayFiveIconURl = "https://openweathermap.org/img/wn/" + dayFiveIcon + ".png";

                // Add to page
                $(".fiveDay").css("display", "block");

                $(".dayOneDate").text(dayOneDate);
                $(".dayOneIcon").attr("src", dayOneIconURl);
                $(".dayOneTemp").text("Temp: " + dayOneTemp + " °F");
                $(".dayOneHumidity").text("Humidity: " + dayOneHum + "%");

                $(".dayTwoDate").text(dayTwoDate);
                $(".dayTwoIcon").attr("src", dayTwoIconURl);
                $(".dayTwoTemp").text("Temp: " + dayTwoTemp + " °F");
                $(".dayTwoHumidity").text("Humidity: " + dayTwoHum + "%");

                $(".dayThreeDate").text(dayThreeDate);
                $(".dayThreeIcon").attr("src", dayThreeIconURl);
                $(".dayThreeTemp").text("Temp: " + dayThreeTemp + " °F");
                $(".dayThreeHumidity").text("Humidity: " + dayThreeHum + "%");

                $(".dayFourDate").text(dayFourDate);
                $(".dayFourIcon").attr("src", dayFourIconURl);
                $(".dayFourTemp").text("Temp: " + dayFourTemp + " °F");
                $(".dayFourHumidity").text("Humidity: " + dayFourHum + "%");

                $(".dayFiveDate").text(dayFiveDate);
                $(".dayFiveIcon").attr("src", dayFiveIconURl);
                $(".dayFiveTemp").text("Temp: " + dayFiveTemp + " °F");
                $(".dayFiveHumidity").text("Humidity: " + dayFiveHum + "%");
            })
            .catch(function (error) {
                $(".fiveDay").css("display", "block");
                $(".forecast-cards").css("display", "none");
                $(".fiveDay").text("Forecast data unavailable at this time.");
            });
    });

    $(".searchHistory").on("click", function redoSearch(event) {
        event.stopPropagation();
        var inputCity = $(event.target).text();
        console.log($(event.target))

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

                var iconURl = "https://openweathermap.org/img/wn/" + response.weather[0].icon + ".png";

                $(".cityWeather").html("<h3>" + response.name + ", " + currentDate + "<img src='" + iconURl + "'>" + "</h3>");

                var temperature = response.main.temp;
                var humidity = response.main.humidity;
                var windSpeed = response.wind.speed;

                $(".cityWeather").append("<p>Temperature: " + temperature + " °F</p>");
                $(".cityWeather").append("<p>Humidity: " + humidity + "%</p>");
                $(".cityWeather").append("<p>Wind Speed: " + windSpeed + " MPH</p>");

                var UVqueryURL = "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/uvi?" + APIKey + "&lat=" + response.coord.lat + "&lon=" + response.coord.lon

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
                // Store response in an array
                var fiveDayArr = response.list
                var dayOne = [];
                var dayTwo = [];
                var dayThree = [];
                var dayFour = [];
                var dayFive = [];

                var firstDate = moment(fiveDayArr[0].dt_txt).format();
                var secondDate = moment(firstDate).add(1, 'days').format();
                var thirdDate = moment(firstDate).add(2, 'days').format();
                var fourthDate = moment(firstDate).add(3, 'days').format();
                var fifthDate = moment(firstDate).add(4, 'days').format();

                // split up the array in the five different dates
                for (var i = 0; i < fiveDayArr.length; i++) {
                    var itemDate = moment(fiveDayArr[i].dt_txt).format();

                    if (itemDate < secondDate) {
                        dayOne.push(fiveDayArr[i]);
                    } else if (itemDate < thirdDate) {
                        dayTwo.push(fiveDayArr[i]);
                    } else if (itemDate < fourthDate) {
                        dayThree.push(fiveDayArr[i]);
                    } else if (itemDate < fifthDate) {
                        dayFour.push(fiveDayArr[i]);
                    } else {
                        dayFive.push(fiveDayArr[i]);
                    };
                };

                // For each day, find the highest temp
                function findHighTemp(arr) {
                    var highTemp = 0;

                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i].main.temp > highTemp) {
                            highTemp = arr[i].main.temp
                        };
                    };

                    return highTemp;
                };

                var dayOneTemp = findHighTemp(dayOne);
                var dayTwoTemp = findHighTemp(dayTwo);
                var dayThreeTemp = findHighTemp(dayThree);
                var dayFourTemp = findHighTemp(dayFour);
                var dayFiveTemp = findHighTemp(dayFive);

                // For each day, find highest humidity
                function findHumidity(arr) {
                    var maxHumidity = 0;

                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i].main.humidity > maxHumidity) {
                            maxHumidity = arr[i].main.humidity
                        };
                    };

                    return maxHumidity;
                };

                var dayOneHum = findHumidity(dayOne);
                var dayTwoHum = findHumidity(dayTwo);
                var dayThreeHum = findHumidity(dayThree);
                var dayFourHum = findHumidity(dayFour);
                var dayFiveHum = findHumidity(dayFive);

                // get formatted date
                function getDate(arr) {
                    var date = moment(arr[0].dt_txt).format("l");
                    return date;
                }

                var dayOneDate = getDate(dayOne);
                var dayTwoDate = getDate(dayTwo);
                var dayThreeDate = getDate(dayThree);
                var dayFourDate = getDate(dayFour);
                var dayFiveDate = getDate(dayFive);

                // find icon
                function getIconArray(arr) {
                    var iconArray = [];

                    for (var i = 0; i < arr.length; i++) {
                        iconArray.push(arr[i].weather[0].icon);
                    };

                    return iconArray;
                };

                var dayOneIA = getIconArray(dayOne);
                var dayTwoIA = getIconArray(dayTwo);
                var dayThreeIA = getIconArray(dayThree);
                var dayFourIA = getIconArray(dayFour);
                var dayFiveIA = getIconArray(dayFive);

                function getIcon(arr) {

                    var result = {};

                    // https://stackoverflow.com/a/5668116/11805572; 
                    for (var i = 0; i < arr.length; ++i) {
                        if (!result[arr[i]])
                            result[arr[i]] = 0;
                        ++result[arr[i]];
                    };

                    var iconID = Object.keys(result);
                    var iconInstances = Object.values(result);

                    var instances = 0;
                    var iconIndex = 0;

                    function findIconInstances(arr2) {
                        for (var i = 0; i < arr2.length; i++) {
                            if (parseInt(arr2[i]) > instances) {
                                instances = arr2[i];
                                iconIndex = i;
                            };
                        };

                        return iconIndex;
                    };

                    findIconInstances(iconInstances);

                    var foundIcon = iconID[iconIndex]

                    return foundIcon;
                };

                var dayOneIcon = getIcon(dayOneIA);
                var dayTwoIcon = getIcon(dayTwoIA);
                var dayThreeIcon = getIcon(dayThreeIA);
                var dayFourIcon = getIcon(dayFourIA);
                var dayFiveIcon = getIcon(dayFiveIA);

                var dayOneIconURl = "https://openweathermap.org/img/wn/" + dayOneIcon + ".png";
                var dayTwoIconURl = "https://openweathermap.org/img/wn/" + dayTwoIcon + ".png";
                var dayThreeIconURl = "https://openweathermap.org/img/wn/" + dayThreeIcon + ".png";
                var dayFourIconURl = "https://openweathermap.org/img/wn/" + dayFourIcon + ".png";
                var dayFiveIconURl = "https://openweathermap.org/img/wn/" + dayFiveIcon + ".png";

                // Add to page
                $(".fiveDay").css("display", "block");

                $(".dayOneDate").text(dayOneDate);
                $(".dayOneIcon").attr("src", dayOneIconURl);
                $(".dayOneTemp").text("Temp: " + dayOneTemp + " °F");
                $(".dayOneHumidity").text("Humidity: " + dayOneHum + "%");

                $(".dayTwoDate").text(dayTwoDate);
                $(".dayTwoIcon").attr("src", dayTwoIconURl);
                $(".dayTwoTemp").text("Temp: " + dayTwoTemp + " °F");
                $(".dayTwoHumidity").text("Humidity: " + dayTwoHum + "%");

                $(".dayThreeDate").text(dayThreeDate);
                $(".dayThreeIcon").attr("src", dayThreeIconURl);
                $(".dayThreeTemp").text("Temp: " + dayThreeTemp + " °F");
                $(".dayThreeHumidity").text("Humidity: " + dayThreeHum + "%");

                $(".dayFourDate").text(dayFourDate);
                $(".dayFourIcon").attr("src", dayFourIconURl);
                $(".dayFourTemp").text("Temp: " + dayFourTemp + " °F");
                $(".dayFourHumidity").text("Humidity: " + dayFourHum + "%");

                $(".dayFiveDate").text(dayFiveDate);
                $(".dayFiveIcon").attr("src", dayFiveIconURl);
                $(".dayFiveTemp").text("Temp: " + dayFiveTemp + " °F");
                $(".dayFiveHumidity").text("Humidity: " + dayFiveHum + "%");
            })
            .catch(function (error) {
                $(".fiveDay").css("display", "block");
                $(".forecast-cards").css("display", "none");
                $(".fiveDay").text("Forecast data unavailable at this time.");
            });

    })
});
