console.log("running");
if(navigator.geolocation){
	navigator.geolocation.getCurrentPosition(showPosition);
}else{
	console.log("Unable to geolocate");
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
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
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function sortFunction(a, b) { //function from http://stackoverflow.com/questions/16096872/how-to-sort-2-dimensional-array-by-column-value
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] < b[0]) ? -1 : 1;
    }
}

function showPosition(pos){
	var originArr = [pos.coords.latitude,pos.coords.longitude];

	$.ajax({
		url : "https://services1.arcgis.com/a7CWfuGP5ZnLYE7I/arcgis/rest/services/PoliceDepartments/FeatureServer/0/query?where=UPPER(AGENCY)%20like%20%27%25RALEIGH%25%27&outFields=*&outSR=4326&f=json"
	}).done(function(response){
		response = JSON.parse(response);
		var stations = response.features;

		var stationArray = [];

		stations.forEach(function(station){
			//get distance from station and user

			var stationCoords = [station.geometry.y,station.geometry.x];
			var distanceFromStation = distanceBetweenArrays(originArr,stationCoords);

			var pushArr = [distanceFromStation,station.attributes];

			stationArray.push(pushArr);
		});

		stationArray.sort(sortFunction);

		//put the closest station info in the array

		var nameToImgArray = [];
		nameToImgArray['Northwest District'] = {
			imgUrl : 'nwdistrictstation.png',
			phoneNumber : "919-996-2300"
		};
		nameToImgArray['North District'] = {
			imgUrl : 'ndistrictstation.png',
			phoneNumber : "919-996-3335"
		};
		nameToImgArray['Northeast District'] = {
			imgUrl : 'nedistrictstation.png',
			phoneNumber : "919-996-2457"
		};
		nameToImgArray['Southeast District'] = {
			imgUrl : 'sedistrictstation.png',
			phoneNumber : "919-996-4455"
		};
		nameToImgArray['Downtown District'] = {
			imgUrl : 'dddistrict.png',
			phoneNumber : "919-996-3855"
		};
		nameToImgArray['Southwest District'] = {
			imgUrl : 'swdistrictstation.png',
			phoneNumber : "919-996-6167"
		};

		//assign the variable to the one that's closest
		var stationImgURL = nameToImgArray[stationArray[0][1].TYPE_STATI].imgUrl;
		var stationPhoneNumber = nameToImgArray[stationArray[0][1].TYPE_STATI].phoneNumber;

		//put the info in the html

		appendHTML = 	"<figure class='contact__img'>" +
							"<img src='https://www.raleighnc.gov/content/Police/Images/" + stationImgURL + "' alt='Raleigh Police Headquarters'>" +
						"</figure>" +
						"<div class='contact__details'>" +
							"<div class='contact__title'>"+ stationArray[0][1].TYPE_STATI +"</div>" +
							"<div class='contact__address'>"+ stationArray[0][1].SITE_ADDRE +"</div>" +
							"<div class='contact__phone'>" +
								"<span class='contact__label'>Phone:</span> <a href='tel:"+ stationPhoneNumber +"'>"+ stationPhoneNumber +"</a>" +
							"</div>" +
						"</div>";

		jQuery(".cor-station-nearest-you").empty();
		jQuery(".cor-station-nearest-you-title").text("Station Nearest You");
		jQuery(".cor-station-nearest-you").append(appendHTML);
	});
}