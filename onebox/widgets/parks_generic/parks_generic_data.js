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

function parksNearMeTableRow(parkInfo){
	var output = "";
	output += "<tr class='gsa-table__row'>";
	output += "<td>" + parkInfo[0]; + "</td>"; //name
	output += "<td>" + parkInfo[1].toFixed(1) + "</td>"; //distance
	output += "<td></td>"; //dive time. Leaving blank for now. 
	output += "</tr>";
	return output;
}

function showPosition(pos){
	console.log(pos.coords.latitude);
	console.log(pos.coords.longitude);

	var originArr = [pos.coords.latitude,pos.coords.longitude];

	$.ajax({
		url : "https://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/0/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=pjson"
	}).done(function(parks){
		
		var parksJSON = JSON.parse(parks);
		console.log(parksJSON);
		var parksJSONArray = [];
		parksJSON.features.forEach(function(park){
			console.log(park);
			//generate array form latlong
			var destArr = [park.geometry.y,park.geometry.x];

			//get the distance from the user's location
			var parkDistance = distanceBetweenArrays(originArr,destArr);
			parksJSONArray.push([park.attributes.NAME,parkDistance]);
		});
		parksJSONArray.sort(compareSecondColumn);

		parksJSONArray = parksJSONArray.splice(0,5) //eliminate all but the 5 closet parks for display
		console.log(parksJSONArray);

		var parksNearMeHTML = "";
		parksJSONArray.forEach(function(parkInfo){
			parksNearMeHTML += parksNearMeTableRow(parkInfo);
		});
		jQuery("#cor-parks-near-me-tbody").empty();
		jQuery("#cor-parks-near-me-tbody").append(parksNearMeHTML);
	});
}

