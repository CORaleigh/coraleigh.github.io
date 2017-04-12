console.log("running");
if(navigator.geolocation){
	navigator.geolocation.getCurrentPosition(showPosition);
	//get the list of all of the parksf
	
}else{
	console.log("Unable to geolocate");
}

function distanceBetweenArrays(originArr, destArr){ //wrapper for the calculate distance function to make it easier to work w/ the arrays
	return getDistanceFromLatLonInKm(originArr[0],originArr[1],destArr[0],destArr[1]);
}

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) { //function from http://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

function compareSecondColumn(a, b) { //function from http://stackoverflow.com/questions/16096872/how-to-sort-2-dimensional-array-by-column-value
    if (a[1] === b[1]) {
        return 0;
    }
    else {
        return (a[1] < b[1]) ? -1 : 1;
    }
}

function sortFunction(a, b) { //function from http://stackoverflow.com/questions/16096872/how-to-sort-2-dimensional-array-by-column-value
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] < b[0]) ? -1 : 1;
    }
}

function generateParksTable(parksInfo){
	var tableHTML = "";
	parksInfo.forEach(function(parkInfo){
		tableHTML += parksNearMeTableRow(parkInfo);
	});

	//populate the html table
	jQuery("#cor-parks-near-me-tbody").empty();
	jQuery("#cor-parks-near-me-tbody").append(tableHTML);
}

function parksNearMeTableRow(parkInfo){
	var output = "";
	output += "<tr class='gsa-table__row'>";
	output += "<td>" + parkInfo[0].name; + "</td>"; //name
	output += "<td>" + parkInfo[1].toFixed(1) + "mi</td>"; //distance
	output += "<td>" + parkInfo[0].travelTime + "</td>"; //dive time. Leaving blank for now. 
	output += "</tr>";
	return output;
}
function eventsTableRow(eventInfo){

	function getDateString(date){

		function getDayMonthYearTimeObjectFromDate(date){
			var dateObject = new Date(date);
			var dateObjectString = dateObject.toDateString();
			var dateObjectArray = dateObjectString.split(" ");

			var timeObjectString = dateObject.toTimeString();
			var timeObjectArray = timeObjectString.split(" ");

			var hourMinSecArray = timeObjectArray[0].split(":");

			var hours = hourMinSecArray[0];
			var minutes = hourMinSecArray[1];

			//12 hour conversion taken from http://stackoverflow.com/questions/4898574/converting-24-hour-time-to-12-hour-time-w-am-pm-using-javascript			
		    var suffix = (hours >= 12)? 'PM' : 'AM'; //it is pm if hours from 12 onwards
    
		    hours = (hours > 12)? hours -12 : hours; //only -12 from hours if it is greater than 12 (if not back at mid night)    
		    hours = (hours == '00')? 12 : hours; //if 00 then it is 12 am

		    var timeOutput = hours + ":" + minutes + " " + suffix
			var outputObject = {
				"time"      : timeOutput,
				"dayOfWeek" : dateObjectArray[0],
				"month"     : dateObjectArray[1],
				"day"       : dateObjectArray[2],
				"year"      : dateObjectArray[3]
			};

			return outputObject;
		}
		var dateObject = getDayMonthYearTimeObjectFromDate(date);
		var outputString = "";
		outputString += dateObject.month + " " + dateObject.day;
		return outputString;
	}
	var startDateString = getDateString(eventInfo[0]);
	var endDateString = getDateString(eventInfo[1].endDate);
	var output = "";
	output += "<tr class='gsa-table__row'>";
	output += "<td>" + eventInfo[1].name + "</td>";
	output += "<td>" + startDateString + "</td>";
	output += "</tr>";

	return output;
}

function getImageFromWeatherCode(code){
	//this is to get an image from the weather code
	//weather codes listed here: https://developer.yahoo.com/weather/documentation.html#channel

	var srcDir = "https://coraleigh.github.com/static/img/"; //dir where the images are

	var codeArray = []; 

	codeArray[0] = "wind-cloudy-storms.jpg";
	codeArray[1] = "wind-cloudy-storms.jpg";
	codeArray[2] = "wind-cloudy-storms.jpg";
	codeArray[3] = "wind-cloudy-storms.jpg";
	codeArray[4] = "rain-lightening.png";
	codeArray[5] = "snow-showers.png";
	codeArray[6] = "snow-showers.png";
	codeArray[7] = "snow-showers.png";
	codeArray[8] = "snow-showers.png";
	codeArray[9] = "rain.png"; //drizzle
	codeArray[10] = "snow-showers.png";
	codeArray[11] = "weather-rain.png";//showers
	codeArray[12] = "weather-rain.png";//showers
	codeArray[13] = "snow-showers.png";
	codeArray[14] = "snow-showers.png";
	codeArray[15] = "snow-showers.png";
	codeArray[16] = "snow-showers.png";
	codeArray[17] = "snow-showers.png";
	codeArray[18] = "snow-showers.png";
	//leaving the next 4 blank until a sutible replacement can be found
	codeArray[19] = ""; //dust
	codeArray[20] = ""; //foggy
	codeArray[21] = ""; //hazy
	codeArray[22] = ""; //smoky
	codeArray[23] = ""; //blustery
	codeArray[24] = ""; //windy
	codeArray[25] = ""; //cold

	codeArray[26] = "cloudy.png";
	codeArray[27] = "night-cloudy.png";
	codeArray[28] = "partly-cloudy.png";
	codeArray[29] = "night-cloudy.png";
	codeArray[30] = "partly-cloudy.png";

	codeArray[31] = "night-clear.png";
	codeArray[32] = "weather-sunny.png";

	codeArray[33] = "night-clear.png";
	codeArray[34] = "weather-sunny.png";

	codeArray[35] = "weather-rain.png";
	codeArray[36] = ""; //hot

	codeArray[37] = "rain-lightening.png"; //iso thunder
	codeArray[38] = "rain-lightening.png"; //scattered thunder
	codeArray[39] = "rain-lightening.png"; //scattered thunder
	codeArray[40] = "scattered-showers.png"; //scattered showers

	codeArray[40] = "weather-snow.png"; //heavy snow
	codeArray[41] = "weather-snow.png"; //scattered snow showers
	codeArray[42] = "weather-snow.png";//heavy snow
	codeArray[43] = "weather-snow.png"; //scattered snow showers
	codeArray[44] = "partly-cloudy.png"; //partly clowdy

	codeArray[44] = "partly-cloudy.png"; //thunder showers
	codeArray[44] = "partly-cloudy.png"; // shnow showers
	codeArray[44] = "partly-cloudy.png"; //isolated thundershowers

	codeArray[3200] = ""; //not available;

	return srcDir + codeArray[code];
}

function getImageHTMLFromWeatherCode(code,alt = 'weather'){
	var imgURL = getImageFromWeatherCode(code);
	var outputHTML = "";
	outputHTML = "<img src='" + imgURL + "' alt='" + alt + "'>";
	return outputHTML;
}

function showPosition(pos){

	console.log(map);
	var originArr = [pos.coords.latitude,pos.coords.longitude];

	$.ajax({
		url : "https://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/0/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=pjson"
	}).done(function(parks){
		
		var parksJSON = JSON.parse(parks);
		var parksJSONArray = [];
		parksJSON.features.forEach(function(park){
			//generate array form latlong
			var destArr = [park.geometry.y,park.geometry.x];

			//get the distance from the user's location
			var parkDistance = distanceBetweenArrays(originArr,destArr);
			parksJSONArray.push(
				[
					{
						"name" : park.attributes.NAME,
						"coord" : [park.geometry.y,park.geometry.x]
					},
					parkDistance
				]
			);
		});
		parksJSONArray.sort(compareSecondColumn);
		var parksMapJSONArray = parksJSONArray.slice();
		parksMapJSONArray = parksMapJSONArray.splice(0,20); //get the 10 closest parks for the map 
		parksJSONArray = parksJSONArray.splice(0,5); //eliminate all but the 5 closest parks for table display

		var parksNearMeHTML = "";
		var parksTableRowsLeftToProcess = parksJSONArray.length;
		parksJSONArray.forEach(function(parkInfo){
			//get the travel time for the park
			var travelTimeOrigin = new google.maps.LatLng(originArr[0],originArr[1]);
			var travelTimeDest = new google.maps.LatLng(parkInfo[0].coord[0],parkInfo[0].coord[1]);

			var service = new google.maps.DistanceMatrixService();
			service.getDistanceMatrix(
			  {
			    origins: [travelTimeOrigin],
			    destinations: [travelTimeDest],
			    travelMode: 'DRIVING'
			  }, travelTimeCallback);
			function travelTimeCallback(response,status){
				console.log(response);
				console.log(status);

				if(status == "OK"){
					parkInfo[0].travelTime = response.rows[0].elements[0].duration.text;
					parksTableRowsLeftToProcess -= 1;
					// debugger;

					if(parksTableRowsLeftToProcess == 0){ //only if all the rows are done
						generateParksTable(parksJSONArray); //generate and apply the html
					}
				}
			}
			
		});

		//populate the google map
		parksMapJSONArray.forEach(function(park){
			var parkLatLong = {"lat":park[0].coord[0],"lng":park[0].coord[1]};
			var marker = new google.maps.Marker({
				position : parkLatLong,
				map : map,
				title : park[0].name
			});
		});
	});
}

jQuery.ajax({
	url : "https://maps.raleighnc.gov/arcgis/rest/services/SpecialEvents/SpecialEventsView/MapServer/1/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=pjson"
}).done(function(events){
	var eventsJSON = JSON.parse(events);
	// debugger;
	var eventsJSONArray = [];
	eventsJSON.features.forEach(function(event){
		eventsJSONArray.push(
			[
				event.attributes.EVENT_STARTDATE,
				{
					"endDate" : event.attributes.EVENT_ENDDATE,
					"name" : event.attributes.EVENT_NAME
				}
			]
		);
	});

	eventsJSONArray.sort(sortFunction);
	console.log(eventsJSONArray);
	// debugger;
	eventsJSONArray = eventsJSONArray.splice(0,6);
	var eventsHTML = "";
	eventsJSONArray.forEach(function(event){
		eventsHTML += eventsTableRow(event);
	});
	jQuery("#cor-events-tbody").empty();
	jQuery("#cor-events-tbody").append(eventsHTML);
});


jQuery.ajax({
	url : "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22raleigh%2C%20nc%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys"
}).done(function(response){
	var results = response.query.results;

	//set the date at the bottom

	var rawDate = results.channel.lastBuildDate;
	var rawDateArray = rawDate.split(" ");
	var processedDate = rawDateArray[0] + " " + rawDateArray[1] + " " + rawDateArray[2] + " " + rawDateArray[3];

	//update the html

	jQuery("#cor-parks-widget-weather-date").text(processedDate);


	//get current weather

	var currentWeather = results.channel;

	//current temp
	var currentTemp = currentWeather.item.condition.temp;
	//weather status
	var weatherStatus = {};
	weatherStatus.text = currentWeather.item.condition.text;
	weatherStatus.imageURL = getImageFromWeatherCode(currentWeather.item.condition.code);
	weatherStatus.imageHTML = getImageHTMLFromWeatherCode(currentWeather.item.condition.code,currentWeather.item.condition.text);
	//humidiy percentage
	var currentHumidity = currentWeather.atmosphere.humidity + "%";
	//rain percetnage
	var currentRainChancePercentage = 0 //dont use this. The yahoo api doesn't provide this data so it's 
	//wind speed
	var currentWindSpeed = currentWeather.wind.speed + " mph";

	//update the HTML
	jQuery("#cor-parks-widget-weather-current-temp").html(currentTemp + "<sup><small>&#x2109;</small></sup>");
	jQuery("#cor-parks-widget-weather-current-weather-img").html(weatherStatus.imageHTML);
	// jQuery("#cor-parks-widget-weather-current-weather-").attr("alt",weatherStatus.text);
	jQuery("#cor-parks-widget-weather-current-weather-text").text(weatherStatus.text);
	jQuery("#cor-parks-widget-weather-current-humidity").text(currentHumidity);
	jQuery("#cor-parks-widget-weather-current-windspeed").text(currentWindSpeed);

	var currentForecast = currentWeather.item.forecast.splice(0,4);

	currentForecast.forEach(function(forecast,index){
		var parentContainerString = "#cor-parks-widget-weather-forecast-" + index;
		var parentContainer = jQuery(parentContainerString);

		var forecastImg = getImageFromWeatherCode(forecast.code);
		var forecastHTML = getImageHTMLFromWeatherCode(forecast.code,forecast.text);
		var forecastText = forecast.text;
		var forecastDay = forecast.day;
		var forecastTemp = forecast.high + "°";

		//adjust the HTML
		jQuery(parentContainer).children(".weather__forecast-day").text(forecastDay);
		jQuery(parentContainer).children("img").html(forecastHTML);
		// jQuery(parentContainer).children("img").attr("alt",forecastText);
		jQuery(parentContainer).children(".weather__forecast-degree").text(forecastTemp);
	});



});
