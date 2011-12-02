var submanga = {};
(function()
{
	this.serviceName = "SubManga";
	this.serviceWeb = "http://submanga.com/";

	var inside = 0;
	this.sayHi = function()
	{
		inside++;
		console.log("Oh hi"+inside);
	};


	var numImages=0;
	this.getNumImages = function(url, callback)
	{

		if(numImages == 0)
		{
			$.ajax({
				url: this.serviceWeb+"/c/"+getIdFromUrl(url),
				success: function(response ){
					var div = document.createElement("div");
					div.innerHTML = response;

					numImages = parseInt($("option:last-child", div).text());
					callback(numImages);
				}
			});
		}
		else
		{
			callback(numImages);
		}
	};

	var pathImages="";
	this.getPathImages = function(id, callback)
	{
		if(pathImages == "")
		{
			$.ajax({
				url: this.serviceWeb+"/c/"+id,
				success: function(response ){
					var div = document.createElement("div");
					div.innerHTML = response;

					pathImages = $("div a img", div).attr("src").split('1.jpg')[0];
					callback(pathImages);
				}
			});
		}
		else
		{
			callback(pathImages);
		}
	};

	this.getImage = function(url, nImg, callback)
	{
		this.getPathImages(getIdFromUrl(url), function(path)
		{
			callback(path+nImg+'.jpg')
		});
	}


	function getIdFromUrl(url)
	{
		var parts = url.split('/');
		return parts[parts.length-1];
	}

	/*var THIS = this;
	function defined(x)
	{
		return typeof x != 'undefined';
	}
	this.ready = false;
	this.init = function(
	{
		this.ready = true;
	};
	this.doSomething = function()
	{
	};
	var options = {
		x : 123,
		y : 'abc'
	};
	this.define = function(key, value)
	{
		if(defined(options[key]))
		{
			options[key] = value;
		}
	};*/
}).apply(submanga);

