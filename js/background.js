function z_Secret(command) {
  // Deleting a log which shows visit to this url
  // and opening new secret tab to visit the url

  // TODO: erasing history function needed

    var create_new_tab_by_url = function(secret_url){
        chrome.windows.create({
            url: secret_url,
            incognito: true
        });
    };

    chrome.tabs.getSelected(null, function(tab){
        chrome.history.search({
            text: tab.url
        }, function(data){
            if(data.length === 0){
                return false;
            }

            else{
                var lastVisitTime = data[0].lastVisitTime;

                chrome.history.search({
                    text: "",
                    startTime: lastVisitTime
                }, function(data){
                    var pages = data;

                    chrome.browsingData.removeHistory({
                        since: lastVisitTime
                    }, function(){
                        pages.pop();
                        pages.forEach(function(page){
                            chrome.history.addUrl({
                                url: page.url
                            });
                        });
                        create_new_tab_by_url(tab.url);
                    });
                });
            }
        });
    });
}

chrome.commands.onCommand.addListener(z_Secret);
