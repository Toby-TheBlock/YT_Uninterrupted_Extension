
chrome.tabs.onUpdated.addListener(function(tabId) {
    chrome.tabs.sendMessage(tabId, {urlChange: "" + tabId + ""});
});

chrome.runtime.onMessage.addListener(data => {
    if (data.type === 'notification') {
        chrome.notifications.create('', data.options);
    }
});