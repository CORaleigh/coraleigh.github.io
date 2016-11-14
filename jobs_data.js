jobsWidget = {
	openJobs : {
		jobData : [],

		sortJobData : function(dropdownValue){

			switch(dropdownValue){
				//because we're comparing internal array properties, each sort type needs it's own compare function
				case "Highest Salary":
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
					partTimeJobs = [];
					jobsWidget.openJobs.jobData.forEach(function(job){
						if(job.type == "Part-Time"){
							partTimeJobs.push(job);
						}
						return partTimeJobs;
					});
					break;
				case "Most Popular":
					popularJobs = jobsWidget.openJobs.jobData;
					function hitsSort(a, b){
					  return ((a.hits < b.hits) ? -1 : ((a.hits > b.hits) ? 1 : 0));
					}
					popularJobs.sort(hitsSort);
					return popularJobs;
					break;
					case
				default:
					defaultJobs = jobsWidget.openJobs.jobData;
					return defaultJobs;
			}
			
			


		},

		getTableRowMarkup : function(jobLink,jobTitle,jobSalaryMin,jobSalaryMax,jobDepartment){
			jobTableMarkup = 
				"<tr class='gsa-table__row'>" +
					"<td>"+
						"<a href='" + jobLink + "'>"+ jobTitle + "</a>" +
					"</td>"+
					"<td>" +jobSalaryMin +"-" + jobSalaryMax + "</td>" +
					"<td>" + jobDepartment +"</td>" +
				"</tr>";
			return jobTableMarkup;

		},

		updateJobsTable : function(dropdownValue){
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
						jobTableMarkup = 
							"<tr class='gsa-table__row'>" +
								"<td>"+
									"<a href='" + jobLink + "'>"+ jobTitle + "</a>" +
								"</td>"+
								"<td>" +jobSalaryMin +"-" + jobSalaryMax + "</td>" +
								"<td>" + jobDepartment +"</td>" +
							"</tr>";
						return jobTableMarkup;

					};
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
jobsWidget.openJobs.updateJobsTable(dropdownValue);