console.log("running");
if(navigator.geolocation){
	navigator.geolocation.getCurrentPosition(showPosition);
	//get the list of all of the parks
	
}else{
	console.log("Unable to geolocate");
}

function distanceBetweenArrays(originArr, destArr){ //wrapper for the calculate distance function to make it easier to work w/ the arrays
	return calculateDistance(originArr[0],originArr[1],destArr[0],destArr[1]);
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    var R = 6371; // km
    var dLat = (lat2 - lat1).toRad();
    var dLon = (lon2 - lon1).toRad();
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d; //pulled from stack overflow: http://stackoverflow.com/questions/31143598/loop-over-array-of-coordinates-and-calculate-distance-javascript
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
			parksJSONArray.push([park.attribues.NAME,parkDistance]);
		});
		console.log(parksJSONArray);
	});
}

