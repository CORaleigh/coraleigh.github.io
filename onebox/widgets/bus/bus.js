$(document).ready(function(){
    //write the code to fill the container div here
    
    const widgetMarkup = <div w3-include-html="https://coraleigh.github.io/onebox/widgets/bus/static-bus.html"></div>

	$.get("https://coraleigh.github.io/onebox/widgets/jobs/jobsWidget.html",function(widgetMarkup){
		$(".onloadFillThis").append(widgetMarkup);

		$.getScript( "https://code.jquery.com/jquery-1.9.0.js",function(){

			$.getScript( "https://ajax.googleapis.com/ajax/libs/jqueryui/1.9.1/jquery-ui.min.js", function(){

				$.getScript( "https://coraleigh.github.io/js/jquery.selectBoxIt.min.js", function(){

			        $.getScript( "https://www.gstatic.com/charts/loader.js",function(){
						google.charts.load('current', {'packages':['corechart', 'bar']});

						$.getScript( "https://coraleigh.github.io/onebox/js/global.js", function(){

							$.getScript( "https://coraleigh.github.io/onebox/js/global.js", function(){


							});

						});
					});

				});

			});
			
		});
		
                
	})
	console.log("COReady")
});