var global;

var mangastream = {};
(function()
{
	this.serviceName = "MangaStream";
	this.serviceWeb = "http://mangastream.com/";

	var numImages=0;
	this.getNumImages = function(url, callback)
	{
		if(numImages == 0)
		{
			$.ajax({
				url: this.serviceWeb+"read/none/"+getIdFromUrl(url)+"/1",
				success: function(response ){
					var div = document.createElement("div");
					div.innerHTML = response;

					numImages =  parseInt($("div#controls a:last", div).prev().text());
					callback(numImages);
				}
			});
		}
		else
		{
			callback(numImages);
		}
	};



	this.getImage = function(url, nImg, callback)
	{
		var urlImage = this.serviceWeb+"read/none/"+getIdFromUrl(url)+"/"+nImg;

		$.ajax({
			url: urlImage,
			success: function(response ){
				var div = document.createElement("div");
				div.innerHTML = response;

				pathImage = $("div a img#p", div).attr("src");
				callback(pathImage);
			}
		});
	}

	function getIdFromUrl(url)
	{
		var parts = url.split('/');
		return parts[parts.length-2];
	}

}).apply(mangastream);

