console.log("running");
if(navigator.geolocation){
	navigator.geolocation.getCurrentPosition(showPosition);
}else{
	console.log("Unable to geolocate");
}

function showPosition(pos){
	console.log(pos.coords.latitude);
	console.log(pos.coords.longitude)
}