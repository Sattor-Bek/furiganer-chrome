function showAlert(text) {
	let str = "";
	if(text){
		str = text;
	} else {
		str = document.title;
	}
	alert(str);
} // this function will be replaced

chrome.action.onClicked.addListener((tab) => {
	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		function: showAlert
	});
});

chrome.runtime.onInstalled.addListener(() => {
	chrome.contextMenus.create({
		"id":"jnhjpmkcbhgdmlnpbppbgmagpmojamea",
		"title":"Furiganer",
		"contexts":["selection"],
	});
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
	const text = info.selectionText;
	//put furigana
	//inject the text with furigana to clipboard
		chrome.scripting.executeScript({
			target: { tabId: tab.id },
			function: showAlert,
			args:[text]
		});		

});