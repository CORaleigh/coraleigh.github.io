console.log("running");
if(navigator.geolocation){
	console.log(navigator.geolocation.getCurrentPosition(showPosition));
}else{
	console.log("Unable to geolocate");
}