console.log("running");
if(navigator.geolocation){
	navigator.geolocation.getCurrentPosition(showPosition);
	//get the list of all of the parks
	
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

function parksNearMeTableRow(parkInfo){
	var output = "";
	output += "<tr class='gsa-table__row'>";
	output += "<td>" + parkInfo[0].name; + "</td>"; //name
	output += "<td>" + parkInfo[1].toFixed(1) + "mi</td>"; //distance
	output += "<td></td>"; //dive time. Leaving blank for now. 
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
		outputString += dateObject.month + " " + dateObject.day + "<br>" + dateObject.time;
		return outputString;
	}
	var startDateString = getDateString(eventInfo[0]);
	var endDateString = getDateString(eventInfo[1].endDate);
	var output = "";
	output += "<tr class='gsa-table__row'>";
	output += "<td>" + eventInfo[1].name + "</td>";
	output += "<td>" + startDateString + "</td>";
	output += "<td>" + endDateString + "</td>";
	output += "</tr>";

	return output;
}

function showPosition(pos){

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
		parksMapJSONArray = parksJSONArray;
		parksMapJSONArray = parksMapJSONArray.splice(0,10); //get the 10 closest parks for the map 
		parksJSONArray = parksJSONArray.splice(0,5); //eliminate all but the 5 closest parks for table display

		var parksNearMeHTML = "";
		parksJSONArray.forEach(function(parkInfo){
			parksNearMeHTML += parksNearMeTableRow(parkInfo);
		});
		jQuery("#cor-parks-near-me-tbody").empty();
		jQuery("#cor-parks-near-me-tbody").append(parksNearMeHTML);
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
	debugger;
	eventsJSONArray = eventsJSONArray.splice(0,6);
	var eventsHTML = "";
	eventsJSONArray.forEach(function(event){
		eventsHTML += eventsTableRow(event);
	});
	jQuery("#cor-events-tbody").empty();
	jQuery("#cor-events-tbody").append(eventsHTML);
});

