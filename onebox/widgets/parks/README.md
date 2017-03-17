# Parks Widget Resources
## ArcGIS REST API
### Park Locations
https://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/0/query
### Special Events in Next Month
https://maps.raleighnc.gov/arcgis/rest/services/SpecialEvents/SpecialEventsView/MapServer/1/query
### Parameters
* where=1=1 -> get all features
* where=NAME='Pullen Park' -> get by park name
* outFields=* -> get all fields
* outSR=4326 -> get lat/lng coordinates

## Classes
### PHP Web Service
https://maps.raleighnc.gov/class/class.php?&ids=15
### Reference for Facility IDs for Each Park
https://github.com/CORaleigh/parklocator/blob/master/app/scripts/services/classesService.js
