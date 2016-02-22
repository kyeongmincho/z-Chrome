function z_Secret(command) {
  // Deleting a log which shows visit to this url
  // and opening new secret tab to visit the url

  // TODO: erasing history function needed

  var create_new_tab_by_url = function(secret_url) {
    chrome.windows.create({
      "url": secret_url,
      "incognito": true
    });
  }

  chrome.tabs.getSelected(null, function(tab) {
    chrome.history.getVisits({"url": "naver.com"}, function(results){
      alert(results[0]);
    });
    chrome.history.deleteUrl({"url": tab.url});
    create_new_tab_by_url(tab.url);
  });
}

chrome.commands.onCommand.addListener(z_Secret);
