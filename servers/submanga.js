var submanga = {};
(function()
{
	this.serviceName = "SubManga";
	this.serviceFile = "submanga";
	this.serviceWeb = "http://submanga.com/";
	this.serviceIcon = "submanga.gif";

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
		var id = 0;
		var exp1 = /http:\/\/submanga.com\/c\/[0-9]{5,6}/;
		var exp2 = /http:\/\/submanga.com\/(.*\/){2}[0-9]{5,6}/;

		if(exp1.test(url))
		{
			var parts = url.split('/');
			id=parts[parts.length-1];
		}
		else if(exp2.test(url))
		{
			var parts = url.split('/');
			id=parts[parts.length-1];
		}

		return id;
	}

	this.getMangaList = function(storageBD, callback)
	{
		var urlList = "http://submanga.com/series";
		$.ajax({
			url: urlList,
			success: function(response) {
				storageBD.deleteAllByService(submanga.serviceFile);

				var div = document.createElement("div");
				div.innerHTML = response;

				$(".b468 table tr:has(td)", div).each(function(index) {
					var td=$('td',this);

					var mangaData = new Object();
					mangaData.name = $('a',td[0]).contents()[1].textContent;
					mangaData.mangaUrl = $('a',td[0]).attr("href");
					mangaData.name = mangaData.name.substr(1);

					storageBD.add(mangaData.name, submanga.serviceFile, mangaData.mangaUrl);
				});

				//pathImages = $("div a img", div).attr("src").split('1.jpg')[0];
				callback();
			}
		});
	}

	this.getChapterList = function(url, callback) {
		console.log(url);

		$.ajax({
			url: url+"/completa",
			success: function(response) {
				var div = document.createElement("div");
				div.innerHTML = response;

				var mangaChapters = new Array();

				$(".b468 table tr:has(td)", div).each(function(index) {
					var td=$('td',this);

					var mangaData = new Object();
					mangaData.name = $('a',td[0]).contents()[0].textContent;
					mangaData.chapter = $('a',td[0]).contents()[1].textContent;
					mangaData.mangaUrl = $('a',td[0]).attr("href");
					mangaData.fansub = $('a',td[1]).contents()[0].textContent;

					mangaChapters.push(mangaData);
				});
				callback(mangaChapters);
			}
		});
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

