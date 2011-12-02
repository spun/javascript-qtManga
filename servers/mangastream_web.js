chrome.extension.sendRequest("sS");

function mangastream_web_checkPosition()
{
	var url=location.href;

	var exp1 = /http:\/\/mangastream.com\/read\/.*/;

	if(exp1.test(url))
	{
		chrome.extension.sendRequest({action: "reader", server: "mangastream", url: url}, function(response) {
			console.log(response.farewell);
		});
	}
}


mangastream_web_checkPosition();
