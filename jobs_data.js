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
						department : jobListing.department
					}
					jobsWidget.openJobs.jobData.push(tempObject);
				});
				console.log(jobsWidget.openJobs.jobData);
			});
		},
		getJobTalbeRowMarkup : function(){

		}		
	}
}