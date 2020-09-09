
var tabMap = new Map();

chrome.tabs.onUpdated.addListener(function(tabId, info) {
    chrome.tabs.sendMessage(tabId, {urlChange: "" + tabId + ""});
    console.log("sendt")
    /*
    if (info.url !== undefined) {
        if (info.url.includes("youtube.com/watch")) {
            if (!tabMap.has(tabId)) {
                tabMap.set(tabId, [info.url, "https://noPreviousURL"]);
            } else {
                tabMap.set(tabId, [info.url, tabMap.get(tabId)[0]]);
            }
        } else if (tabMap.has(tabId)) {
            tabMap.delete(tabId);
        }
    }
    console.log(tabMap);

    if (typeof info.url !== "undefined") {
        console.log("hello")
        chrome.tabs.sendMessage(tabId, {urlChange: "" + tabId + tabMap.get(tabId)[1] + ""});
    }
    */
});

chrome.tabs.onRemoved.addListener(function(tabId) {
    if (tabMap.has(tabId)) {
        tabMap.delete(tabId);
    }
    console.log(tabMap);
});