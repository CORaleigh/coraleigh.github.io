//as a reminder, these items are run when the file loads, so there is no need
//for document.ready() for it to run

//get the top permit downloads

$.ajax({
	url : "https://data.raleighnc.gov/resource/3nnh-j2uc.json",
}).done(function(topFormDownloads){
	topFormDownloads.forEach(function(topFormDownload){
		var iconText = '<span class="file-downloads__icon"><span class="file-downloads__icon-text">Download</span><span class="gsa-icon-download gsa-icon--lrg"></span></span>'
		$(".cor-form-download-link-unset").first().attr("href", topFormDownload.formurl.url);
		$(".cor-form-download-link-unset").first().children(".cor-form-download-title").text(topFormDownload.name);
		$(".cor-form-download-link-unset").first().removeClass("cor-form-download-link-unset");
	});
});