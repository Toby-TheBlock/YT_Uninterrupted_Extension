
window.setInterval(injectJSFile, 1);
var bgCommunication = window.setInterval(listenToBackground, 1);
var jsFiles = ["configurationManager", "preventAutostop", "speedupAutoplay", "replayButton", "skipAds"];
var tabID = "";
var failedSetupAttempts = 0;

function listenToBackground() {
    try {
        chrome.runtime.onMessage.addListener(function (request) {
            tabID = request.urlChange;
        });

        if (tabID !== "") {
            if (document.getElementById("TabID") === null) {
                let scriptTag = document.createElement("script");
                scriptTag.id = "TabID";
                let textNode = document.createTextNode(tabID);
                scriptTag.appendChild(textNode);
                (document.head || document.documentElement).appendChild(scriptTag);

                if (localStorage.getItem("oldURLForTab" + tabID) === null) {
                    localStorage.setItem("oldURLForTab" + tabID, "noPreviousURL");
                }
            } else {
                clearInterval(bgCommunication);
            }
        }
    } catch (e) {
        // Nothing needs to be caught, the element in question is "null" because the page hasn't loaded it jet.
    }
}


function injectJSFile() {
    try {
        if (checkURLForChange() && checkURLForVideo()) {
            jsFiles.forEach(function(currentValue) {
                $('script').each(function () {
                    if (this.src.includes(currentValue)) {
                        this.parentNode.removeChild(this);
                    }
                })

                let scriptTag = document.createElement("script");
                scriptTag.src = chrome.runtime.getURL("js/" + currentValue + ".js");
                (document.head || document.documentElement).appendChild(scriptTag);
            });
        }
    } catch (error) {
        if (failedSetupAttempts > 100) {
            chrome.runtime.sendMessage('', {
                type: 'notification',
                options: {
                    title: 'Something went wrong! X_X',
                    message: 'YouTube uninterrupted couldn\'t initialize correctly.\nTry reloading the page.',
                    iconUrl: '',
                    type: 'basic'
                }
            });
        } else {
            failedSetupAttempts++;
        }
    }
}


// Checks if the current page URL is different from the last time this function was called.
// @return true if the oldURL and the currentURL are different, else false.
var oldURL = "";
function checkURLForChange() {
    let currentURL = document.URL;
    if (currentURL !== oldURL) {
        oldURL = currentURL;
        return true;
    }
    return false;
}


// Checks if the current YouTube-page is a video.
// @return true if current page is a video, else false.
function checkURLForVideo() {
    return document.URL.includes("https://www.youtube.com/watch");
}




