
chrome.tabs.onUpdated.addListener(function(tabId) {
    chrome.tabs.sendMessage(tabId, {urlChange: "" + tabId + ""});
});

