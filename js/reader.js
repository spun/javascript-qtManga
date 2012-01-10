$(document).ready(function(){


	var parameters = location.search.substring(1).split("&");

	var server = decodeURIComponent(parameters[1]);
	var url = decodeURIComponent(parameters[2]);

	$.getScript('servers/'+server+'.js', function() {
		doStuff(eval(server), url);
	});


});


function doStuff(service, url)
{
	var i=1;
	service.getNumImages(url, function(n) {

		for(i=1; i<=n; i++)
		{
			service.getImage(url, i, function(src){
				$("#reader").append("<div class=\"imgManga\"><img src='"+src+"' /></div>")
			});
		}
	});
}
