//Google Analytics Code
//Pasted at the top to allow loading first

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-9880547-11', 'auto');
ga('send', 'pageview');

//number format function for the salary values
Number.prototype.formatMoney = function(c, d, t){
var n = this, 
    c = isNaN(c = Math.abs(c)) ? 2 : c, 
    d = d == undefined ? "." : d, 
    t = t == undefined ? "," : t, 
    s = n < 0 ? "-" : "", 
    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))), 
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };

jobsWidget = {
	openJobs : {
		jobData : [],

		sortJobData : function(dropdownValue){

			switch(dropdownValue){
				//because we're comparing internal array properties, each sort type needs it's own compare function
				case "Highest Salary":
				case "highest salary":
				// console.log(jobsWidget.openJobs.jobData);
					//first, we have to pull out the items that dont have a max salary, or have a salary of "Hourly"
					salariedJobs = [];
					jobsWidget.openJobs.jobData.forEach(function(job){
						// console.log(job.salaryMax + "<-" + (typeof job.salaryMax));
						// console.log()
						if(job.salaryMax && job.salaryMax != "Hourly" && (typeof job.salaryMax != "undefined")){ //if there's no value for salary max, ignore the value
							if(Number(job.salaryMax) > 99){ //eliminate the jobs that have an hourly number listed
								// console.log("^added^")
								job.salaryMax = Number(job.salaryMax);
								salariedJobs.push(job); //add the job to the list of salaried jobs
							}
							
						}
					});
					function salarySort(a, b){
					  return ((a.salaryMax < b.salaryMax) ? -1 : ((a.salaryMax > b.salaryMax) ? 1 : 0));
					}
					salariedJobs.sort(salarySort);
					// console.log(salariedJobs);
					return salariedJobs;
					break;
				case "Part-Time":
				case "part time":
					partTimeJobs = [];
					jobsWidget.openJobs.jobData.forEach(function(job){
						if(job.type == "Part-Time"){
							partTimeJobs.push(job);
						}
					});
					return partTimeJobs;
					break;
				case "Most Popular":
				case "most popular":
					popularJobs = jobsWidget.openJobs.jobData;
					function hitsSort(a, b){
					  return ((a.hits < b.hits) ? -1 : ((a.hits > b.hits) ? 1 : 0));
					}
					popularJobs.sort(hitsSort);
					return popularJobs;
					break;
				case "All":
				case "all":
				default:
					defaultJobs = jobsWidget.openJobs.jobData;
					return defaultJobs;
			}
			
			


		},

		// getTableRowMarkup : function(jobLink,jobTitle,jobSalaryMin,jobSalaryMax,jobDepartment){
		// 	//control structures for the 'salary range' field.
		// 	if(jobSalaryMin < 99){ //hourly rate provided
		// 		if(typeof jobSalaryMax == "undefined"){
		// 			//only a min rate was provided
		// 			salaryString = jobSalaryMin + "/hr";
		// 		}else{
		// 			//min and max rate provided
		// 			salaryString = jobSalaryMin + "/hr - " + jobSalaryMax + "/hr";
		// 		}
		// 	}else{ //annual salary provided
		// 		salaryString = jobSalaryMin + "-" + jobSalaryMax + "</td>";
		// 	}
		// 	debugger;
		// 	jobTableMarkup = 
		// 		"<tr class='gsa-table__row'>" +
		// 			"<td>"+
		// 				"<a href='" + jobLink + "'>"+ jobTitle + "</a>" +
		// 			"</td>"+
		// 			"<td>" + salaryString + "</td>" +
		// 			"<td>" + jobDepartment +"</td>" +
		// 		"</tr>";
		// 	return jobTableMarkup;

		// },

		updateJobsTable : function(dropdownValue){
			//get the data from socrata
			$.ajax({
				// url: "https://data.raleighnc.gov/resource/a95t-r2n7.json", THIS IS THE OLD URL
				url : "https://services.arcgis.com/v400IkDOw1ad7Yad/arcgis/rest/services/Job_Postings_Current/FeatureServer/0/query?where=1%3D1&objectIds=&time=&resultType=none&outFields=*&returnIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=pjson&token="
			}).done(function(data){
				data = JSON.parse(data);
				console.log(data);
				data = data.features; //we only want the features, not the fields format
				
				//load the array, and only keep the attr that we want
				jobsWidget.openJobs.jobData = [] //clear the array, since we're re-pulling the data
				data.forEach(function(jobListing){
					jobListing = jobListing.attributes;
					// console.log(jobListing);
					var tempObject = {
						url : "https://www.governmentjobs.com/careers/raleighnc/jobs/" + jobListing.Jobid,
						title : jobListing.Job_Title,
						salaryMin : jobListing.Minimum_Salary,
						salaryMax : jobListing.Maximum_Salary,
						department : jobListing.Department,
						hits: jobListing.Hits,
						type : jobListing.Job_Type,

					}
					jobsWidget.openJobs.jobData.push(tempObject);
				});
				// console.log(jobsWidget.openJobs.jobData);
				displayJobsData = jobsWidget.openJobs.sortJobData(dropdownValue);
				var tableRowsDisplayed = 10; //number of rows that show up in the onebox
				if(tableRowsDisplayed > displayJobsData.length){
					tableRowsDisplayed = displayJobsData.length; //reduce the number of rows displayed to the number of available jobs to show
				}
				
				// console.log(displayJobsData);
				function generateTableRowMarkup(jobLink,jobTitle,jobSalaryMin,jobSalaryMax,jobDepartment){
					//control structures for the 'salary range' field.
					if(jobSalaryMin < 99){ //hourly rate provided
						if(typeof jobSalaryMax == "undefined"){
							//only a min rate was provided
							var salaryMin = Number(jobSalaryMin);
							salaryString = "$" + salaryMin.formatMoney(2) + "/hr";
						}else{
							//min and max rate provided
							salaryString = "$" + Number(jobSalaryMin).formatMoney(2) + "/hr - " + "$" + Number(jobSalaryMax).formatMoney(2) + "/hr";
						}
					}else{ //annual salary provided
						salaryString = "$" + Number(jobSalaryMin).formatMoney(2) + " - " + "$" + Number(jobSalaryMax).formatMoney(2) + "</td>";
					}
					jobTableMarkup = 
						"<tr class='gsa-table__row'>" +
							"<td>"+
								"<a class='cor-gsa-onebox-job-link' href='" + jobLink + "'  target='_blank'>"+ jobTitle + "</a>" +
							"</td>"+
							"<td>" + salaryString + "</td>" +
							"<td>" + jobDepartment +"</td>" +
						"</tr>";
					return jobTableMarkup;

				}
				jQuery(".gsa-table tbody").empty();
				jQuery(".cor-blurred").removeClass("cor-blurred");
				while(tableRowsDisplayed > 0){
					var job = displayJobsData.pop();
					// console.log(displayJobsData);
					// console.log(job);
					// console.log(job.url);
					var url = job.url;
					var title = job.title;
					var min = job.salaryMin;
					var max = job.salaryMax;
					var dept = job.department;

					


					markup = generateTableRowMarkup(url,title,min,max,dept);
					// console.log(markup); 
					jQuery(".gsa-table tbody").append(generateTableRowMarkup(job.url,job.title,job.salaryMin,job.salaryMax,job.department));
					tableRowsDisplayed = tableRowsDisplayed - 1;
				}

				$(".cor-gsa-onebox-job-link").click(function(){
					ga("send","event","Link","click","Individual Job Listing");
					console.log("Sending GA Event");
				});

				$("#cor-onebox-view-all-jobs").click(function(){
					ga("send","event","Link","click","View All Jobs");
					console.log("Sending GA Event - VAJ");
				});

				$("#cor-onebox-expand-list").click(function(){
					ga("send","event","Link","click","Expand List");
					console.log("Sending GA Event - EL");
				});

				$("#cor-onebox-view-more-data").click(function(){
					ga("send","event","Link","click","View More Data");
					 console.log("Sending GA Event - VMD");
				});

				$("#keymatch").children().first().children('a').click(function(){
					ga("send","event","Link","click","Keyword Match");
					console.log("Sending GA Event - KM");
				})

				$("#filter-jobs").change(function(){
					var newDropDownVal = $(this).val();
					ga("send","event","Dropdown","Selection",newDropDownVal);
					console.log("sending event DDSel - " + newDropDownVal);
				});

				$(".cor-gsa-onebox-job-link").hover(
					function(){ //entry function
						console.log("hovering!");
						ga("send","event","Link","hover","Individual Job Listing");
					},
					function(){ //exit function
						//intentionally empty
					})

				$(".result-item").children().first().children().first().children('a');
			});
			
		},
		getJobTableRowMarkup : function(){
			var tableRowsDisplayed = 10; //number of rows that show up in the onebox

			//check the value of the dropdown
			dropdownValue = $("#filter-jobsSelectBoxItText").text();
			dropdownValue = dropdownValue.trim(); //get rid of the spaces at the start and end of the string
		}
			
	}
}
dropdownValue = $("#filter-jobsSelectBoxItText").text();
dropdownValue = dropdownValue.trim(); //get rid of the spaces at the start and end of the string

$("#filter-jobs").change(function(){
	dropdownValue = $("#filter-jobs").val();
	jobsWidget.openJobs.updateJobsTable(dropdownValue);
})
jobsWidget.openJobs.updateJobsTable("Highest Salary");
$.ajax({
	//url:"https://data.raleighnc.gov/resource/8e89-69gk.json"
	url : "https://services.arcgis.com/v400IkDOw1ad7Yad/arcgis/rest/services/Job_Postings_Current/FeatureServer/0/query?where=1%3D1&objectIds=&time=&resultType=none&outFields=*&returnIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&sqlFormat=none&f=pjson&token="
}).done(function(rawPeakHiringData){
	var monthAbbrArray = ['J',"F","M","A","M","J","J","A","S","O","N","D"];
	var peakHiringData = [['Year','Full-Time','Part-Time'
	// ,{role : "annotation"}
	]];
	rawPeakHiringData.features.forEach(function(rawMonthData){
		var monthData = [monthAbbrArray.shift(),Number(rawMonthData.full_time_hires),Number(rawMonthData.part_time_hires)];
		peakHiringData.push(monthData);
	});
	// debugger;
	//var refinedPeakHiringData = google.visualization.arrayToDataTable(peakHiringData);
	// debugger;
	var hiringDataChartOptions = {
		isStacked : true,
        hAxis: {title: 'Month',  titleTextStyle: {color: '#333'}},
        vAxis: {minValue: 0},
        backgroundColor: { fill:'transparent' },
        legend: {position: 'none'},
        chartArea: {
            backgroundColor: 'f5f5f5',
            left: 40,
            right: 1,
            top: 20
        }
    };
    // debugger;

    

    function generateChart(){
    	var chartPeakHiringData = new google.visualization.ColumnChart(document.getElementById("chart-peak-hiring"));
    	chartPeakHiringData.draw(refinedPeakHiringData,hiringDataChartOptions);
    }

    window.onload = generateChart();
    window.onresize = generateChart;
});

  

