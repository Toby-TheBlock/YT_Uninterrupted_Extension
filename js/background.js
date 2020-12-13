
chrome.tabs.onUpdated.addListener(function(tabId) {
    chrome.tabs.sendMessage(tabId, {urlChange: "" + tabId + ""});
});


chrome.runtime.onMessage.addListener(async function(request) {
    if (request.sendToDB) {
        let data = request.sendToDB.split("/");
        sendToDB(data[0], data[1]);
    }
});


chrome.runtime.onConnect.addListener(async function(port) {
    if (port.name === "getFromDB") {
        port.onMessage.addListener(async function(request) {
            let status = await getFromDB(request.getFromDB);
            port.postMessage({data: "" + status + ""});
        });
    }
});