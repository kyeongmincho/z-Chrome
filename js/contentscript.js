'use strict';

(function() {
	// receive message from background script
	// send a response to background script or popup script
	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	    // TODO search innerHTML
	});
})();
