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
	url : "https://data.raleighnc.gov/resource/32wj-c4mi.json",
}).done(function(recentPermits){
	var numberOfGlobalPermits = recentPermits.length; //the number for permits

	//get the types of each permit


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
	            arr.push([Sting(key),obj[key]]);
	        }
	    };
	    var result = arr.join(',');
	    console.log(result);
	    var dataCommonPermits = new google.visualization.DataTable();
	    dataCommonPermits.addColumn('string', 'Item');
	    dataCommonPermits.addColumn('number', 'Amount');

	    //convert the array into something gcharts can digest
	    var googleChartWorkTypeCount = [];
	    workTypeCount.forEach(function(key){
	    	console.log(key);
	    	console.log(value);
	    	googleChartWorkTypeCount.push([String(key),value]);
	    });
	    console.log(googleChartWorkTypeCount);
	    dataCommonPermits.addRows(workTypeCount);
	    // dataCommonPermits.addRows([
	    //     ['Home Additions', 500],
	    //     ['Sidewalks', 125],
	    //     ['Pools', 250]
	    // ]);

	    
	    var optionsCommonPermits = {
	        colors: ['#477dca', '#efb505', '#ffffff'], // blue | gold | white
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