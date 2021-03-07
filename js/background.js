/* © Copyright 2021, Tobias Günther, All rights reserved. */

/**
 * Sends a message to the extension frontend containing the tab id of the tab which was updated.
 */
chrome.tabs.onUpdated.addListener(function(tabId) {
    chrome.tabs.sendMessage(tabId, {urlChange: "" + tabId + ""});
});


/**
 * Listens for write-to-database messages, and writes the received data to the DB.
 */
chrome.runtime.onMessage.addListener(async function(request) {
    if (request.sendToDB) {
        let data = request.sendToDB.split("/");
        sendToDB(data[0], data[1]);
    }
});


/**
 * Listens for connections to the get-from-database port, and sends requested data to the port.
 */
chrome.runtime.onConnect.addListener(async function(port) {
    if (port.name === "getFromDB") {
        port.onMessage.addListener(async function(request) {
            let status = await getFromDB(request.getFromDB);
            port.postMessage({data: "" + status + ""});
        });
    }
});