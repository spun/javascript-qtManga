var bg_page = chrome.extension.getBackgroundPage();

$(document).ready(function(){

	$("#logo").click(function() {
		location.href=chrome.extension.getURL("page.html");
	});

	startSearchSuggest();
	//createPageFromUrl();
});


function startSearchSuggest()
{
	console.log("# Starting search suggest");
	$("#quick-search").keyup(function(event) {
		$("#quick-search-results").empty();
		$("#quick-search-results").css("display", "none");
		if($("#quick-search").val() != "")
		{
			bg_page.mangadb.getSuggests($("#quick-search").val(), function(result) {

				if(result.length>0)
				{
					$(result).each(function() {
						var url_info = chrome.extension.getURL("page.html")+"?"
							+encodeURIComponent("infoManga")
							+"&"+encodeURIComponent(this.name)
							+"&"+encodeURIComponent(this.service)
							+"&"+encodeURIComponent(this.url);

						var li = $("<li>", {
							class: "quick-search-result",
							text: this.name,
							data: { url: url_info },
							click: function() {location.href = $(this).data().url},
						}).appendTo("#quick-search-results");

						$("<img>", {
							class: "service-icon",
							src: "img/service_icons/submanga.gif",
						}).prependTo(li);


					});
					$("#quick-search-results").css("display", "block");
				}
			});
		}
	});
}







function createPageFromUrl()
{
	var parameters = location.search.substring(1).split("&");

	var pageMode = parameters[0];
	if(pageMode == "index")
	{
		createIndexPage();

	}
	else if(pageMode == "search")
	{
		createSearchPage();

	}
	else if(pageMode == "infoManga")
	{
		var name = decodeURIComponent(parameters[1]);
		var service = decodeURIComponent(parameters[2]);
		var url = decodeURIComponent(parameters[3]);

		$.getScript('servers/'+service+'.js', function() {
			createInfoMangaPage(eval(service), url, name);
		});

	}
	else if(pageMode == "reader")
	{
		var server = decodeURIComponent(parameters[1]);
		var url = decodeURIComponent(parameters[2]);

		$.getScript('servers/'+server+'.js', function() {
			doStuff(eval(server), url);
		});
	}

}

function createInfoMangaPage(serv, url, name) {
	$("#main-container").empty();
	console.log("# Creating Info Manga Page");

	var box = $("<div>", {
		class: "box"
	}).appendTo("#main-container");

	$("<div>", {
		class: "box-header",
		text: "Información de \""+name+"\" en "+serv.serviceName
	}).appendTo(box);

	var content = $("<div>", {
		class: "box-body",
		css: {
			height: "200px"
		}
	}).appendTo(box);


	var box2 = $("<div>", {
			class: "box"
		}).appendTo("#main-container");

		$("<div>", {
			class: "box-header",
			text: "Capítulos de \""+name+"\" en "+serv.serviceName
 		}).appendTo(box2);

	serv.getChapterList(url, function(list) {

		var content2 = $("<div>", {
			class: "box-body",
		}).appendTo(box2);

		$(list).each(function() {

			var urlReader = chrome.extension.getURL("reader.html")+"?"
					+encodeURIComponent("reader")
					+"&"+encodeURIComponent(serv.serviceFile)
					+"&"+encodeURIComponent(this.mangaUrl);

			$("<li>", {
				class: "quick-search-result",
				text: this.name+" - "+this.chapter+" - "+this.fansub,
				data: { url: urlReader },
				click: function() {location.href = $(this).data().url},
			}).appendTo(content2);

		});


		/*
		main-container


		<div class="box">
				<div class="box-header">
					Últimos añadidos
				</div>
				<div class="box-body">
					<ul>
						<li class="manga-fresh">Naruto</li>
						<li class="manga-fresh">Bleach</li>
						<li class="manga-fresh">Gatetes varios</li>
					</ul>
				</div>
			</div>

		*/

	});
}



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

function urlPathTo(path)
{
	window.history.pushState({"pageType": path},"", "page.html?"+path);
	createPageFromUrl();
}

window.onpopstate = function(e) {
    createPageFromUrl();
};






function createIndexPage()
{
	console.log("# Creating index page");
	document.title = "qtManga";

	$("#content").empty();
	$("<div>", {
		id: "indexPage",
		css:{
			display: "none"
		}
	}).appendTo("#content").fadeIn("fast");

	$("<a>", {
		text: "here",
		click: function() {
			urlPathTo("search");
		}
	}).appendTo("#indexPage");








}


function createSearchPage()
{
	console.log("# Creating search page");

	//$("#content").empty();
		document.title = "Search - qtManga";
		$("<div>", {
			id: "searchPage",
			css:{
				display: "none"
			}
		}).prependTo("#content");

		$("<input>", {
			type: "text",
		}).appendTo("#searchPage").fadeIn();

		$("<input>", {
			type: "submit",
			value: "Buscar"
		}).appendTo("#searchPage").fadeIn();



		$("#searchPage").slideDown();


}





//~ function processAjaxData(response, urlPath){
     //~ document.getElementById("content").innerHTML = response.html;
     //~ document.title = response.pageTitle;
     //~ window.history.pushState({"html":response.html,"pageTitle":response.pageTitle},"", urlPath);
 //~ }
//~
//~ window.onpopstate = function(e){
    //~ if(e.state){
        //~ document.getElementById("content").innerHTML = e.state.html;
        //~ document.title = e.state.pageTitle;
    //~ }
//~ };
