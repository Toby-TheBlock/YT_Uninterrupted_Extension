
window.setInterval(setupExtenstionInDOM, 1);

var notLoggedIn;
//checkIfLoggedIn();

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
                    setLocalStorageValue("oldURLForTab" + tabID, "noPreviousURL");
                }
            } else {
                clearInterval(settingUpTabID);
            }
        } else {
            listenToBackground();
        }
    } catch {
       reportError();
    }
}


function listenToBackground() {
    chrome.runtime.onMessage.addListener(function(request) {
        tabID = request.urlChange;
    });
}


function setupExtenstionInDOM() {
    try {
        if (checkURLForChange()) {
            occuredErrorsReset = true;
            window.setInterval(errorManagement, 500);

            if (checkURLForVideo()) {
                let possibleOptions = ["replayButton", "skipAds", "speedupAutoplay", "preventAutostop", "utensils", "mainDOM"];
                possibleOptions.forEach(async function(currentEntry) {

                    let result = currentEntry === "utensils" ? "true" : await getDataFromBackground(currentEntry);

                    if (result === "true") {
                        $('script').each(function() {
                            if (this.src.includes(currentEntry)) {
                                this.parentNode.removeChild(this);
                            }
                        });

                        let scriptTag = document.createElement("script");
                        scriptTag.src = chrome.runtime.getURL("js/" + currentEntry + ".js");
                        (document.head || document.documentElement).appendChild(scriptTag);
                    }
                });
            }
        }
    } catch {
        reportError();
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


function checkIfLoggedIn() {
    let notLoggedInnContainer = document.getElementsByTagName("yt-icon")[9];
    let notLoggedInnIcon = "M12,0 C18.62375,0 24,5.37625 24,12 C24,18.62375 18.62375,24 12,24 C5.37625,24 " +
        "0,18.62375 0,12 C0,5.37625 5.37625,0 12,0 Z M12,10.63625 C13.66,10.63625 15,9.29625 15,7.63625 C15," +
        "5.97625 13.66,4.63625 12,4.63625 C10.34,4.63625 9,5.97625 9,7.63625 C9,9.29625 10.34,10.63625 " +
        "12,10.63625 Z M12,12.40875 C8.33375,12.40875 5.455,14.18125 5.455,15.8175 C6.84125,17.95 " +
        "9.26875,19.3625 12,19.3625 C14.73125,19.3625 17.15875,17.95 18.545,15.8175 C18.545,14.18125 " +
        "15.66625,12.40875 12,12.40875 Z";

    if (notLoggedInnContainer !== null) {
        if (notLoggedInnContainer.childNodes[0].childNodes[0].childNodes[0].getAttribute("d") === notLoggedInnIcon) {
            notLoggedIn = window.setInterval(preventLoginPopup, 500);
        }
    }
}


function preventLoginPopup() {
    let noThxBtn = document.getElementsByClassName("style-scope yt-button-renderer style-text size-small")[0];

    if (typeof noThxBtn !== "undefined" && noThxBtn !== null) {
        noThxBtn.click();
        clearInterval(notLoggedIn);
    }
}


