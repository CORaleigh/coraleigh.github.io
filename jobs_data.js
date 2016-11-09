jobsWidget = {
	openJobs : {
		jobData : [],
		getTableRowMarkup : function(jobTitle,jobSalaryMin,jobSalaryMax,jobDepartment){
			jobTableMarkup = 
				"<tr class='gsa-table__row'>" +
					"<td>"+
						"<a href='#'>"+ jobTitle + "</a>" +
					"</td>"+
					"<td>" +jobSalaryMin +"-" + jobSalaryMax + "</td>" +
					"<td>" + jobDepartment +"</td>" +
				"</tr>";
			return getTableRowMarkup;

		},

		getJobsData : function(){
			//get the data from socrata
			$.ajax({
				url: "https://data.raleighnc.gov/resource/a95t-r2n7.json",
			}).done(function(data){
				// console.log(data);
				//load the array, and only keep the attr that we want
				data.forEach(function(jobListing){
					// console.log(jobListing);
					var tempObject = {
						url : "https://www.governmentjobs.com/careers/raleighnc/jobs/" + jobListing.jobid,
						title : jobListing.job_title,
						salaryMin : jobListing.minimum_salary,
						salaryMax : jobListing.maximum_salary,
						department : jobListing.department,

					}
					jobsWidget.openJobs.jobData.push(tempObject);
				});
				console.log(jobsWidget.openJobs.jobData);
			});
		},
		getJobTableRowMarkup : function(){
			var tableRowsDisplayed = 7; //number of rows that show up in the onebox

			//check the value of the dropdown
			dropdownValue = $("#filter-jobsSelectBoxItText").text();
			dropdownValue = dropdownValue.trim(); //get rid of the spaces at the start and end of the string
		},
		sortJobData : function(dropdownValue){

			switch(dropdownValue){
				//because we're comparing internal array properties, each sort type needs it's own compare function
				case "Highest Salary":
					//first, we have to pull out the items that dont have a max salary, or have a salary of "Hourly"
					var salariedJobs = [];
					jobsWidget.openJobs.jobData.forEach(function(job){
						if(job.salaryMax){ //if there's no value for salary max, ignore the value
							if(job.salaryMax != "Hourly"){ //if it's an hourly job, then ignore the value
								salariedJobs.push(job); //add the job to the list of salaried jobs
							}
						}
							
					});
					function salarySort(a, b){
					  return ((a.salaryMax < b.salaryMax) ? -1 : ((a.salaryMax > b.salaryMax) ? 1 : 0));
					}
					salariedJobs.sort(salarySort);
					console.log(salariedJobs);
					break;
				case "Part-Time":
					break;
				case "Most Popular":
					break;
			}
		}	
	}
}

jobsWidget.openJobs.getJobsData();
jobsWidget.openJobs.sortJobData();