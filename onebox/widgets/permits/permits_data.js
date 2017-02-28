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
		$(".cor-form-download-link-unset").first().children(".cor-form-download-title").text(topFormDownload.name);
		$(".cor-form-download-link-unset").first().removeClass("cor-form-download-link-unset");
	});
	//delete the remaning li items that dont have top form download links
	$(".cor-form-download-link-unset").remove();
});