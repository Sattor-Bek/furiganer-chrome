importScripts("./contentScript.js");

function clipText(clipboardText) {
	if(navigator && navigator.clipboard){
		console.log("navigator.clipboard")
		navigator.clipboard.writeText(clipboardText);
		return navigator.clipboard.writeText(clipboardText);
	} else {
		let textArea = document.createElement("textarea");
        textArea.value = clipboardText;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        return new Promise((res, rej) => {
            document.execCommand('copy') ? res() : rej();
            textArea.remove();
        });
	}
}

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
		body: JSON.stringify(body)
	}
	let data = {}
	await fetch(baseUrl, request).then(response => {
		if (!response.ok) {
		  console.error('Server Error');
		}
		data = response.json()
	  })
	  .catch(error => {
		console.error('Connection failed', error);
	  });
	return data 
}

function convert(input, tab) {
	let textData = []
	postData(input).then(res => {
		if(res.result && res.result.word){
			textData = sortData(res.result.word)
			textData = textData.join('');
			chrome.scripting.executeScript({
				target: { tabId: tab.id },
				function: clipText,
				args:[textData]
			});	
		}
	})
	
}

function sortData(words){
	let wordList = []
	if(words.length > 0){
		words.forEach( word => {
			if(word.subword && word.subword.length > 0){
				word.subword.forEach( w => {
					w.furigana === w.surface ? wordList.push(w.surface) : wordList.push("[" + w.surface + ":" + w.furigana + "]");
				});
			} else if(word.furigana) {
				wordList.push("[" + word.surface + ":" + word.furigana + "]");
			} else {
				wordList.push(word.surface);
			}
		})
	}
	return wordList
}



chrome.runtime.onInstalled.addListener(() => {
	chrome.contextMenus.create({
		"id": extensionId,
		"title":"Furiganer",
		"contexts":["selection"],
	});
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
	const selected = info.selectionText;
	convert(selected, tab)
});