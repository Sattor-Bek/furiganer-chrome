importScripts("./contentScript.js");

function showAlert(text) {
	let str = "";
	if(text){
		str = text;
	} else {
		str = document.title;
	}
	alert(str);
} // this function will be replaced


async function postData(input){
	const body = {
		id: userId,
		jsonrpc: "2.0",
		method: method,
		params: {
			q: input,
			grade: 1
		}
	}
	const request = {
		method: "POST",
		mode: "no-cors",
		body: JSON.stringify(body)
	}

	const response = await fetch(baseUrl, request);
	return response.json()
}

function convert(input) {
	let response = {}
	postData(input).then(res => {
		console.log("start coverting...")
		response = res;
		console.log("finished converting")
	})
	const result = JSON.stringify(response);
	return result.result;
}


chrome.action.onClicked.addListener((tab) => {
	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		function: showAlert
	});
});

chrome.runtime.onInstalled.addListener(() => {
	chrome.contextMenus.create({
		"id": extensionId,
		"title":"Furiganer",
		"contexts":["selection"],
	});
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
	const text = info.selectionText;
	const textData = convert(text)
	//inject the text with furigana to clipboard
		chrome.scripting.executeScript({
			target: { tabId: tab.id },
			function: showAlert,
			args:[textData]
		});		

});