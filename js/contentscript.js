'use strict';

(function() {
	//receive mssage from background script
	//send a response to background script or popup script
	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	    //TODO search innerHTML
	    console.log(request);
	});
})();
