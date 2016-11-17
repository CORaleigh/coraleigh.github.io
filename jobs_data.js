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
				console.log(jobsWidget.openJobs.jobData);
					//first, we have to pull out the items that dont have a max salary, or have a salary of "Hourly"
					salariedJobs = [];
					jobsWidget.openJobs.jobData.forEach(function(job){
						console.log(job.salaryMax + "<-" + (typeof job.salaryMax));
						console.log()
						if(job.salaryMax && job.salaryMax != "Hourly" && (typeof job.salaryMax != "undefined")){ //if there's no value for salary max, ignore the value
							if(Number(job.salaryMax) > 99){ //eliminate the jobs that have an hourly number listed
								console.log("^added^")
								job.salaryMax = Number(job.salaryMax);
								salariedJobs.push(job); //add the job to the list of salaried jobs
							}
							
						}
					});
					function salarySort(a, b){
					  return ((a.salaryMax < b.salaryMax) ? -1 : ((a.salaryMax > b.salaryMax) ? 1 : 0));
					}
					salariedJobs.sort(salarySort);
					console.log(salariedJobs);
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
				url: "https://data.raleighnc.gov/resource/a95t-r2n7.json",
			}).done(function(data){
				// console.log(data);
				//load the array, and only keep the attr that we want
				jobsWidget.openJobs.jobData = [] //clear the array, since we're re-pulling the data
				data.forEach(function(jobListing){
					// console.log(jobListing);
					var tempObject = {
						url : "https://www.governmentjobs.com/careers/raleighnc/jobs/" + jobListing.jobid,
						title : jobListing.job_title,
						salaryMin : jobListing.minimum_salary,
						salaryMax : jobListing.maximum_salary,
						department : jobListing.department,
						hits: jobListing.submitted_resume_count,
						type : jobListing.job_type,

					}
					jobsWidget.openJobs.jobData.push(tempObject);
				});
				console.log(jobsWidget.openJobs.jobData);
				displayJobsData = jobsWidget.openJobs.sortJobData(dropdownValue);
				var tableRowsDisplayed = 7;
				if(tableRowsDisplayed > displayJobsData.length){
					tableRowsDisplayed = displayJobsData.length; //reduce the number of rows displayed to the number of available jobs to show
				}
				jQuery(".gsa-table tbody").empty();
				console.log(displayJobsData);
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
						salaryString = "$" + Number(jobSalaryMin).formatMoney(2) + "-" + "$" + Number(jobSalaryMax).formatMoney(2) + "</td>";
					}
					jobTableMarkup = 
						"<tr class='gsa-table__row'>" +
							"<td>"+
								"<a href='" + jobLink + "'>"+ jobTitle + "</a>" +
							"</td>"+
							"<td>" + salaryString + "</td>" +
							"<td>" + jobDepartment +"</td>" +
						"</tr>";
					return jobTableMarkup;

				}
				while(tableRowsDisplayed > 0){
					var job = displayJobsData.pop();
					console.log(displayJobsData);
					console.log(job);
					console.log(job.url);
					var url = job.url;
					var title = job.title;
					var min = job.salaryMin;
					var max = job.salaryMax;
					var dept = job.department;

					


					markup = generateTableRowMarkup(url,title,min,max,dept);
					console.log(markup); 
					jQuery(".gsa-table tbody").append(generateTableRowMarkup(job.url,job.title,job.salaryMin,job.salaryMax,job.department));
					tableRowsDisplayed = tableRowsDisplayed - 1;
				}
			});
			
		},
		getJobTableRowMarkup : function(){
			var tableRowsDisplayed = 7; //number of rows that show up in the onebox

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
jobsWidget.openJobs.updateJobsTable(dropdownValue);
$.ajax({
	url:"https://data.raleighnc.gov/resource/8e89-69gk.json"
}).done(function(rawPeakHiringData){
	var monthAbbrArray = ['J',"F","M","A","M","J","J","A","S","O","N","D"];
	var peakHiringData = [['Year','Full-Time','Part-Time'
	// ,{role : "annotation"}
	]];
	rawPeakHiringData.forEach(function(rawMonthData){
		var monthData = [monthAbbrArray.shift(),Number(rawMonthData.full_time_hires),Number(rawMonthData.part_time_hires)];
		peakHiringData.push(monthData);
	});
	debugger;
	var refinedPeakHiringData = google.visualization.arrayToDataTable(peakHiringData);
	debugger;
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
    debugger;
    var chartPeakHiringData = new google.visualization.ColumnChart(document.getElementById("chart-peak-hiring"));
    chartPeakHiringData.draw(refinedPeakHiringData,hiringDataChartOptions);

});
