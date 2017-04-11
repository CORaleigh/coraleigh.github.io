console.log("parks_specific widget");

function getParkInfoFromObjectID(objectID,callback = false){
	//add the object ID to the ajax string
	var ajaxString = "https://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/0/query?where=OBJECTID%3D" + objectID + "&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=pjson";

	jQuery.ajax({
		url : ajaxString
	}).done(function(parkInfo){
		parkInfo = JSON.parse(parkInfo);
		if(callback){
			callback(parkInfo);
		}else{
			return parkInfo;
		}
	});
}

function getNamedParkInfo(devmode = false){
	//function to get the name of the park that's in the search box, and get the associated park ID

	//get the string that's in the search box
	var searchBoxString = jQuery("#SearchInput").val();
	searchBoxString.toLowerCase();
	if(devmode){
		searchBoxString = searchBoxString.substring(0,searchBoxString.length - 6);
	}

	//set up list of parks

	function CORPark(parkNames,parkID){
		this.parkNames = parkNames;
		this.parkID = parkID;

		this.parkNameMatch = function(parkName){
			var returnVal = false;
			this.parkNames.forEach(function(arrParkName){
				if(arrParkName == parkName){
					returnVal = true;
				}
			});
			return returnVal;
		}
		this.getInfo = function(callback=false){
			if(callback){
				getParkInfoFromObjectID(this.parkID,function(parkInfo){callback(parkInfo);})			}else{
				return getParkInfoFromObjectID(this.parkID);
			}
		}

		this.parkImageUrl = function(){
			var baseURL = "https://maps.raleighnc.gov/parklocator/images/photos/";
			var imgType = ".jpg";
			var imgName = this.parkNames[0].replace(/\s+/g, '');

			return baseURL + imgName + imgType;
		}
	}

	var CORParks = {}

	//hard coded list of parks

	CORParks.pullen = new CORPark(['pullen park'], 80);
	CORParks.lakeJohnson = new CORPark(['lake johnson park'], 48);
	CORParks.lakeLynn = new CORPark(['lake lynn park'], 50);
	CORParks.lakeWheeler = new CORPark(['lake wheeler park'], 51);
	CORParks.laurelHills = new CORPark(['laurel hills park'], 54); 
	CORParks.millbrookExchange = new CORPark(['millbrook exchange park'], 67);
	CORParks.mordecai = new CORPark(['mordecai historic park',"mordecai park"], 70); 
	CORParks.fredFletcher = new CORPark(['fred fletcher park'], 31);
	CORParks.andersonPoint = new CORPark(['anderson point park'], 1);
	CORParks.durantNaturePreserve = new CORPark(['durant nature preserve'], 25);


	var matchingPark = false;
	Object.keys(CORParks).forEach(function(corPark){
		if(CORParks[corPark].parkNameMatch(searchBoxString)){
			matchingPark = CORParks[corPark];
		}
	});
	return matchingPark;

}

function generateImageDivHTML(imgURL){
	var outputString = "<div id='cor-parks-widget-park-image' class='panel__content panel__content--google-image' style=\"background-image: url('" + imgURL + "');background-size:cover\">";
	return outputString;
}

function generateSeeMapLink(parkName){
	parkName.replace(/ /g,"+");
	var outputString = "https://www.google.com/maps/place/" + parkName;
	return outputString;
}

function generateParkWebsiteHTML(parkURL){
	var outputString = "https://www.google.com/maps/place/Pullen+Park"
}

var namedParkObject = getNamedParkInfo(true)

namedParkObject.getInfo(function(parkInfo){
	console.log(namedParkObject.parkImageUrl());
	console.log(parkInfo);

	var parkAttributes = parkInfo.features[0].attributes;
	var parkLocation = parkInfo.features[0].geometry;
	var imgDivHTML = generateImageDivHTML(namedParkObject.parkImageUrl());
	//make the changes to the html


	jQuery("#park-name").text(parkAttributes.NAME); //title
	jQuery("#cor-parks-widget-park-image").html(imgDivHTML); //image

	//map
	var parkCoords = {lat: parkLocation.y,lng: parkLocation.x};
	map.setCenter(parkCoords); //set map center to map
	//add marker
	var parkMarker = new google.maps.Marker({
		map : map,
		position : parkCoords
	});
	//adjust "see map" link to the correct external link
	jQuery("#cor-parks-widget-see-map-link").attr("href",generateSeeMapLink(parkAttributes.NAME));
	//adjust the website link posted
	jQuery("#cor-parks-widget-park-url").text(parkAttributes.URL);
	jQuery("#cor-parks-widget-park-url").attr('href',parkAttributes.URL);


	//adjust the phone number listed
	jQuery("#cor-parks-widget-park-phone").text(parkAttributes.PHONE);
	jQuery("#cor-parks-widget-park-phone").attr("href","tel:" + parkAttributes.PHONE);

	//adjust the address
	jQuery("#cor-parks-widget-park-address").text(parkAttributes.ADDRESS);
	jQuery("#cor-parks-widget-park-address").attr("href","https://maps.google.com/?q=" + parkAttributes.ADDRESS);

	//location detail info

	if(navigator.geolocation){
		console.log('running geolcation');
		navigator.geolocation.getCurrentPosition(updateNavigationDetail);

		function updateNavigationDetail(pos){
			var userLocation = {lat:pos.coords.latitude,lng:pos.coords.longitude};

			var distanceService = new google.maps.DistanceMatrixService();

			distanceService.getDistanceMatrix({
				origins : [userLocation],
				destinations : [parkCoords],
				travelMode : "DRIVING",
				unitSystem : google.maps.UnitSystem.IMPERIAL
			},travelTimeCallback);

			function travelTimeCallback(response,status){
				console.log(response);
				console.log(status);
				var results = response.rows[0].elements[0];
				//generate the html
				var navDetailHTML = "<p id='cor-parks-widget-park-nav-detail' class=\"location-info__direction-detail\">";
				navDetailHTML += "You could be there in " + results.duration.text + "<br/>";
				navDetailHTML += "Your best route is " + results.distance.text + "</p>";

				jQuery("#cor-parks-widget-park-nav-detail").html(navDetailHTML);
			}
		}
	}

	//amenities

	//build the amenities array

	var amenitiesArray = [];
	Object.keys(parkAttributes).forEach(function(attribute){
		console.log(parkAttributes[attribute]);
		if((parkAttributes[attribute] == 'Yes' ) && (attribute != "UNIQUESP")){
			//get the text name of the amentiy

			var amenityText = parkInfo.fieldAliases[attribute];

			//add it to the array
			var newAmenity = {
				text : amenityText,
				imgURL : "https://CORaleigh.github.io/static/img/parks_activities/" + attribute + ".svg"
			};
			debugger;
			amenitiesArray.push(newAmenity);
		}
		
	});
	function generateParkAmenitiesLiElement(amenityInfo){
		var outputString = "<li class='park-extras__item'><img src=' ";
		outputString += amenityInfo.imgURL + "' alt='Amenity image of a field.'>";
		outputString += amenityInfo.text + "</li>";

		return outputString;
	}

	var amenitiesHTML = "";

	amenitiesArray.forEach(function(amentiy){
		amenitiesHTML += generateParkAmenitiesLiElement(amentiy);
	})

	jQuery("#cor-parks-widget-park-amenities").html(amenitiesHTML);
	console.log(amenitiesArray);
});

