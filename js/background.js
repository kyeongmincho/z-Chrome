function z_Secret() {
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

all_commands = {
    "z_Secret": z_Secret
}

chrome.commands.onCommand.addListener(function(command) {
        // check if popup is activated
    var activated_flag = chrome.extension.getViews({ type: "popup" });
    if (activated_flag.length === 0)
        return false;

        // call function or wait for extended command
    body = document.getElementById('z_body');
    if (command in all_commands)
    {
        body.innerHTML = command;
        all_commands[command]();
    }
    else
    {
        // TODO: define extended command and print the command
    }
});
