chrome.extension.sendRequest("sS");

function submanga_web_checkPosition()
{
	var url=location.href;

	var exp1 = /http:\/\/submanga.com\/(.*\/){2}[0-9]{5,6}/;
	var exp2 = /http:\/\/submanga.com\/c\/[0-9]{5,6}/;
	var exp3 = /http:\/\/submanga.com\/?$/; // Página inicio
	var exp4 = /http:\/\/submanga.com\/adulto\/?$/;	// Página adultos
	var exp5 = /http:\/\/submanga.com\/p\/[0-9]+\/?$/; // Recientes
	var exp6 = /http:\/\/submanga.com\/oneshots\/?$/;	// Página oneshots

	if(exp2.test(url))
	{
		chrome.extension.sendRequest({action: "reader", server: "submanga", url: url}, function(response) {
			console.log(response.farewell);
		});
	}
}


submanga_web_checkPosition();
