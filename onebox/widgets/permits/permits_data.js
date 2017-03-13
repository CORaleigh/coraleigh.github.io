//as a reminder, these items are run when the file loads, so there is no need
//for document.ready() for it to run

//get the top permit downloads

$.ajax({
	url : "https://data.raleighnc.gov/resource/3nnh-j2uc.json",
}).done(function(topFormDownloads){
	topFormDownloads.forEach(function(topFormDownload){

		var permitRowText = '<li class="file-downloads__item"><a class="cor-form-download-link-unset" href="#" target="_blank"><span class="file-downloads__icon"><span class="file-downloads__icon-text">Download</span><span class="gsa-icon-download gsa-icon--lrg"></span></span><span class="cor-form-download-title">Standard Residentail Review</span></a></li>';
		var permittingLinkItems = $(".cor-form-download-link-unset");
		if(permittingLinkItems.length === 0){ //check if there are any items left to add to
			$(".file-downloads").append(permitRowText); //add li item if there isn't
		}
		$(".cor-form-download-link-unset").first().attr("href", topFormDownload.formurl.url);
		$(".cor-form-download-link-unset").first().children(".cor-form-download-title").text(topFormDownload.name).removeClass("cor-blurred-text");
		$(".cor-form-download-link-unset").first().removeClass("cor-form-download-link-unset");
	});
	//delete the remaning li items that dont have top form download links
	$(".cor-form-download-link-unset").remove();
});

//get the recent permits granted


$.ajax({
	url : "https://data.raleighnc.gov/resource/32wj-c4mi.json?$where=issueddate%20IS%20NOT%20NULL&$limit=50000",
}).done(function(recentPermits){
	var numberOfGlobalPermits = recentPermits.length; //the number for permits

	//get the types of each permit

	$(".cta-stats__item-count").text(numberOfGlobalPermits);
	//set up the permits chart
	if ( $('#' + $chartCommonPermitsContainer).length > 0 ) {

	    var workTypeCount = [];
	    recentPermits.forEach(function(recentPermit){
	    	if(workTypeCount[recentPermit.workclass]){
	    		workTypeCount[recentPermit.workclass]++;
	    	}else{
	    		workTypeCount[recentPermit.workclass] = 1;
	    	}

	    });
	    console.log(workTypeCount);

	    var arr = [];
	    var obj = workTypeCount;
	    for (var key in obj) {
	        if (obj.hasOwnProperty(key)) {
	            arr.push([String(key),obj[key]]);
	        }
	    };
	    // var result = arr.join(',');
	     googleChartWorkTypeCount = arr;
	     dataCommonPermits = new google.visualization.DataTable();
	    dataCommonPermits.addColumn('string', 'Item');
	    dataCommonPermits.addColumn('number', 'Amount');

	    //sort the smaller types into a "remaining types" category
	    var consolidationFactor = 0.10 //anything under 10% gets moved to "remaining types"
	    var consolidationNumber = numberOfGlobalPermits * consolidationFactor; //if there are less than this number, then consolidate the section.
	    console.log(consolidationNumber);
	    var numberOfConsolidatedPermits = 0;
	    var elementsToSplice = []
	    for(x = 0; x < googleChartWorkTypeCount.length; x++){
	    	if(googleChartWorkTypeCount[x][1] < consolidationNumber){
	    		//consolidate
	    		numberOfConsolidatedPermits = numberOfConsolidatedPermits + googleChartWorkTypeCount[x][1];
	    		elementsToSplice.push(x);
	    		console.log("consolidating " + googleChartWorkTypeCount[x][0] + " for value of  " + googleChartWorkTypeCount[x][1]);
	    	}
	    }
	    elementsToSplice.sort(function(a,b){return b-a});
	    while(elementsToSplice.length > 0){
	    	console.log("removing" + googleChartWorkTypeCount[elementsToSplice[0]][0]);
	    	googleChartWorkTypeCount.splice(elementsToSplice[0],1);
	    	elementsToSplice.splice(0,1);
	    }

	    if(numberOfConsolidatedPermits > 0){
	    	googleChartWorkTypeCount.push(['Remaining Types',numberOfConsolidatedPermits]);
	    }

	    //convert the array into something gcharts can digest
	    // var googleChartWorkTypeCount = [];
	    workTypeCount.forEach(function(key){
	    	console.log(key);
	    	console.log(value);
	    	googleChartWorkTypeCount.push([String(key),value]);
	    });
	    console.log(googleChartWorkTypeCount);
	    dataCommonPermits.addRows(googleChartWorkTypeCount);
	    // dataCommonPermits.addRows([
	    //     ['Home Additions', 500],
	    //     ['Sidewalks', 125],
	    //     ['Pools', 250]
	    // ]);


	    var optionsCommonPermits = {
	        // colors: ['#477dca', '#efb505', '#ffffff'], // blue | gold | white
	        fontSize: 13,
	        chartArea:{
	            left: '5%',
	            top: 20,
	            width: '90%',
	            height: '165',
	        },
	        legend: {
	            'position':'right',
	            textStyle: {
	                color: "fff"
	            }
	        },
	        backgroundColor: { fill:'3c61a5' }
	    };


	    var chartCommonPermits = new google.visualization.PieChart(document.getElementById('chart-common-permits'));
	        chartCommonPermits.draw(dataCommonPermits, optionsCommonPermits);
	}
});

//Chlorepleth Map CODE

google.charts.load('current', {'packages':['corechart']});

	jQuery.getScript("https://js.arcgis.com/3.20/").done(function(){
		debugger;
		require([
	      "esri/map",
	      "esri/layers/FeatureLayer",
	      "esri/renderers/smartMapping",
	      "esri/renderers/SimpleRenderer", "esri/Color", 
	      "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol", 
	      "esri/tasks/query",
	      "esri/dijit/Legend",
	      "esri/geometry/Point",
	      "esri/InfoTemplate",
	      // "dojo/dom",      
	      // "dojo/dom-construct",
	      "dojo/domReady!"
	    ], function(Map, FeatureLayer, smartMapping, SimpleRenderer, Color, 
	        SimpleFillSymbol, SimpleLineSymbol, Query, Legend, Point, InfoTemplate) {
    	debugger;
	      var map = new Map("arcgis-map", {
	        basemap: 'dark-gray',
	        center: [-78.65, 35.85], // longitude, latitude
	        zoom: 10
	      });
	      var legend = null;


	      $.ajax({
	        url: 'https://raw.githubusercontent.com/CORaleigh/dataviz_search/censusmap/data/construction-permitting.json',
	        type: 'GET',
	        dataType: 'json'
	      })
	      .done(function(data) {
	          var where = "GEOID10 in (";
	          var geoids = [];
	          $.each(data, function (i, d) {
	            geoids.push("'" + d.geoid_blgrp + "'");
	          });

	          where += geoids.toString() + ")";
	        var featureLayer = new FeatureLayer("https://services1.arcgis.com/a7CWfuGP5ZnLYE7I/arcgis/rest/services/CensusBlockGroups2010/FeatureServer/0", 
	          {
	            definitionExpression: where, 
	            outFields: ['*'], 
	            mode: FeatureLayer.MODE_SNAPSHOT,
	            minZoom: 8,
	            opacity: 0.6
	          }
	        );
	        var q = new Query();
	        q.where = where;
	        var cnt = 0;
	        featureLayer.queryCount(q, function (count) {
	          featureLayer.on('graphic-add', function (g) {
	            var match = $(data).filter(function (i) {
	              if (g.graphic.attributes) {
	                return data[i].geoid_blgrp === g.graphic.attributes.GEOID10.toString();
	              }
	            });
	            if (match.length > 0) {
	              g.graphic.attributes.count_permitnum = parseInt(match[0].count_permitnum);
	              g.graphic.attributes.sum_estprojectcost = parseInt(match[0].sum_estprojectcost);
	            }
	            console.log(g);
	            if (cnt === count - 1) {
	              setRenderer(featureLayer, smartMapping);
	            }
	            cnt += 1;
	          });
	        });
	        map.addLayer(featureLayer);
	        featureLayer.on("load", function(){
	          navigator.geolocation.getCurrentPosition(function (position) {
	            var point = new Point(position.coords.longitude, position.coords.latitude)
	            map.centerAndZoom(point, 15);
	            var q = new Query();
	            q.geometry = point;
	            featureLayer.queryFeatures(q, function (results) {
	              if (results.features.length > 0) {
	                map.infoWindow.setFeatures(results.features);
	                map.infoWindow.show(point);
	              }
	            });
	          })
	        });
	      })
	      .fail(function() {
	        console.log("error");
	      })
	      .always(function() {
	        console.log("complete");
	      });

	    function setInfoTemplate (featureLayer) {
	      var infoTemplate = new InfoTemplate();
	      infoTemplate.setTitle("${GEOID10}<br/>");
	      infoTemplate.setContent("<b>Estimated Total Project Cost</b><br/>$${sum_estprojectcost}"); 
	      featureLayer.setInfoTemplate(infoTemplate);  
	    }

	    function setRenderer (featureLayer, smartMapping) {
	        featureLayer.fields.push({
	          alias: 'Estimated Project Cost',
	          editable: true,
	          name: 'sum_estprojectcost',
	          nullable: true,
	          type: 'esriFieldTypeDouble'
	        });
	        featureLayer.fields.push({
	          alias: 'Count',
	          editable: true,
	          name: 'Permits',
	          nullable: true,
	          type: 'esriFieldTypeDouble'
	        });        
	            //smart mapping functionality begins
	            smartMapping.createClassedColorRenderer({
	               layer: featureLayer,
	               field: 'sum_estprojectcost',
	               basemap: 'dark-gray',
	               classificationMethod: "quantile"
	            }).then(function (response) {
	               featureLayer.setRenderer(response.renderer);
	               featureLayer.redraw();
	               createLegend(map, featureLayer, 'sum_estprojectcost');
	            });
	        setInfoTemplate(featureLayer);
	    }
	         //Create a legend
	         function createLegend(map, layer, field) {
	            //If applicable, destroy previous legend
	            if (legend) {
	               legend.destroy();
	               domConstruct.destroy(dom.byId("legendDiv"));
	            }

	            legend = new Legend({
	               map: map,
	               layerInfos: [{
	                  layer: layer,
	                  title: " "
	            }]
	            }, 'legendDiv');
	            legend.startup();
	         };      
	    });
	});
