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
	url : "https://services.arcgis.com/v400IkDOw1ad7Yad/ArcGIS/rest/services/Building_Permits_Past_31_Days/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=&returnGeometry=false&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=workclass&outStatistics=%5B%0D%0A++%7B%0D%0A++++%22statisticType%22%3A+%22count%22%2C%0D%0A++++%22onStatisticField%22%3A+%22workclass%22%2C+%0D%0A++++%22outStatisticFieldName%22%3A+%22WorkClassCount%22%0D%0A++%7D%0D%0A%5D&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pgeojson&token=",
}).done(function(recentPermits){
	var numberOfGlobalPermits = 0; //= recentPermits.length; //the number for permits
	//get the full number of permits
	recentPermits = JSON.parse(recentPermits);
	// console.log(recentPermits);
	recentPermits.features.forEach(function(recentPermit){
		// console.log(recentPermit.properties.WorkClassCount);
		numberOfGlobalPermits = numberOfGlobalPermits + parseInt(recentPermit.properties.WorkClassCount);
	});

	//get the types of each permit

	
	//set up the permits chart
	if ( $('#' + $chartCommonPermitsContainer).length > 0 ) {

	    var workTypeCount = [];
	    // recentPermits.features.forEach(function(recentPermit){
	    // 	if(workTypeCount[recentPermit.workclass]){
	    // 		workTypeCount[   -.workclass]++;
	    // 	}else{
	    // 		workTypeCount[recentPermit.workclass] = 1;
	    // 	}

	    // });
	    // console.log(workTypeCount);

	    var arr = [];
	    // console.log(recentPermits)
	    recentPermits.features.forEach(function(recentPermit){
	    	arr.push([recentPermit.properties.workclass,recentPermit.properties.WorkClassCount]);
	    })
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
	    // console.log(consolidationNumber);
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
	    	// console.log(key);
	    	// console.log(value);
	    	googleChartWorkTypeCount.push([String(key),value]);
	    });
	    // console.log(googleChartWorkTypeCount);
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
	       console.log(numberOfGlobalPermits);
        $(".cta-stats__item-count").text(numberOfGlobalPermits); //paint the total permit number
	}
});

//Chlorepleth Map CODE


google.charts.load('current', {'packages':['corechart']});

	
