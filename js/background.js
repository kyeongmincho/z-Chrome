function z_Secret() {
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
        create_new_tab_by_url(tab.url);
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
                }, function(pages){
                    chrome.browsingData.removeHistory({
                        since: lastVisitTime
                    }, function(){
                        pages.pop();
                        pages.forEach(function(page){
                            chrome.history.addUrl({
                                url: page.url
                            });
                        });
                    });
                });
            }
        });
    });
}

function z_Search(){
    chrome.tabs.query({}, function(tabs){
        var calls = [];
        var contextList = [];
        var searchKeyword = "github";

        tabs.forEach(function(tab){
            calls.push(function(callback){
                chrome.tabs.executeScript(tab.id, {
                    code: "var text = document.documentElement.innerText; text"
                }, function(resp){
                    if(chrome.runtime.lastError){
                        callback(null, null);
                    }
                    else{
                        callback(null, {
                            id: tab.id,
                            title: tab.title,
                            url: tab.url,
                            text: resp[0]
                        });
                    }
                });
            });
        });

        async.parallel(calls, function(err, results){
            var filteredList = results.filter(function(tab){
                return tab !== null && (
                        tab.title.indexOf(searchKeyword) >= 0
                        || tab.url.indexOf(searchKeyword) >= 0
                        || tab.text.indexOf(searchKeyword) >= 0
                    );
            });

            console.log(filteredList);
        });
    });
}

all_commands = {
    "z_Secret": z_Secret,
    "z_Search": z_Search
};

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

