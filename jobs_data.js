jobsWidget = {
	openJobs : {
		jobData = [],
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
			$.ajax({
				url: "https://data.raleighnc.gov/resource/a95t-r2n7.json",
			}).done(function(data){
				console.log(data);
			});
		},
		getJobTalbeRowMarkup : function(){

		}		
	}
}