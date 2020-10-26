
window.setInterval(injectJSFile, 1);

var settingUpTabID = window.setInterval(setTabID, 1);
var tabID = "";


function setTabID() {
    try {
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
                clearInterval(settingUpTabID);
            }
        } else {
            listenToBackground();
        }
    } catch (e) {
        // Nothing needs to be caught, the element in question is "null" because the page hasn't loaded it jet.
    }
}


function listenToBackground() {
    chrome.runtime.onMessage.addListener(function (request) {
        tabID = request.urlChange;
    });
}


function injectJSFile() {
    try {
        if (checkURLForChange() && checkURLForVideo()) {
            let possibleOptions = ["replayButton", "skipAds", "speedupAutoplay", "preventAutostop", "mainDOM"];
            possibleOptions.forEach(async function(currentEntry) {
                let result = await getFromDB(currentEntry);

                if (result === "true") {
                    $('script').each(function () {
                        if (this.src.includes(currentEntry)) {
                            this.parentNode.removeChild(this);
                        }
                    })

                    let scriptTag = document.createElement("script");
                    scriptTag.src = chrome.runtime.getURL("js/" + currentEntry + ".js");
                    (document.head || document.documentElement).appendChild(scriptTag);
                }
            });

        }
    } catch (error) {

    }
}


function getFunctionalityList() {
    return new Promise(
        function(resolve) {


            console.log(activeFunctionality[1])
            resolve(activeFunctionality);
        }
    );
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