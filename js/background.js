function z_Secret(){
    /*
     * Deleting a log which shows visit to this url
     * and opening new secret tab to visit the url
     */

    var close_tab = function(tab_id){
        chrome.tabs.remove(tab_id);
    }

    var create_new_tab_by_url = function(secret_url){
        chrome.windows.create({
            url: secret_url,
            incognito: true
        });
    };

    var delete_history = function(tab_url){
        chrome.history.search({
            text: tab_url
        }, function(data){
            if(data.length !== 0){
                var last_visit_time = data[0].lastVisitTime;

                chrome.history.search({
                    text: "",
                    startTime: last_visit_time
                }, function(pages){
                    chrome.browsingData.removeHistory({ since: last_visit_time }, function(){
                        pages.pop();
                        pages.reverse().forEach(function(page){
                            chrome.history.addUrl({ url: page.url });
                        });
                    });
                });
            }
        });
    };

    chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tab_list){
        var tab_url = tab_list[0].url;

        close_tab(tab_list[0].id);
        delete_history(tab_url);
        create_new_tab_by_url(tab_url);
    });
}


function z_TabSearch() {
    /*
     * Sending a query to background script
     * and finding a string that user wants to search
     */

    var node = document.createElement('input');
    var input_id = document.createAttribute('id');
    input_id.value = 'search';
    var input_type = document.createAttribute('type');
    input_type.value = 'text';

    node.setAttributeNode(input_id);
    node.setAttributeNode(input_type);
    body.appendChild(node);

    // send message to every tabs; content_scripts
    var send_message_to_every_tabs = function(search_str){
        chrome.tabs.query({ currentWindow: true }, function(tabs){
            tabs.forEach(function(each_tab){
                chrome.tabs.sendMessage(each_tab.id, search_str, function(response){
                    // TODO: handle the response
                });
            });
        });
    };

    node.addEventListener("keydown", function(e){
        var comp = document.getElementById(input_id.value);
        send_message_to_every_tabs(comp.value);
    });
}


var all_commands = {
    "z_Secret": z_Secret,
    "z_TabSearch": z_TabSearch
};


chrome.commands.onCommand.addListener(function(command){
        // check if popup is activated
    var activated_flag = chrome.extension.getViews({ type: "popup" });
    if (activated_flag.length === 0)
        return false;

        // call function or wait for extended command
    body = document.getElementById('z_body');
    if (command in all_commands){
        body.innerHTML = command;
        all_commands[command]();
    }
    else{
        // TODO: define extended command and print the command
    }
});
