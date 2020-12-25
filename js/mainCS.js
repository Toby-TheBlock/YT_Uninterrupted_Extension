/* © Copyright 2020, Tobias Günther, All rights reserved. */

window.setInterval(setupExtenstionInDOM, 1);

var notLoggedIn;
checkIfLoggedIn();

var oldURL = "";
var settingUpTabID = window.setInterval(setTabID, 1);
var tabID = "";


/**
 * Gets current tab-id and stores it in a local DOM element.
 */
async function setTabID() {
    try {
        if (tabID !== "") {
            if (document.getElementById("TabID") === null) {
                let scriptTag = document.createElement("script");
                scriptTag.id = "TabID";
                let textNode = document.createTextNode(tabID);
                scriptTag.appendChild(textNode);
                (document.head || document.documentElement).appendChild(scriptTag);

                if (localStorage.getItem("oldURLForTab" + tabID) === null) {
                    await setLocalStorageValue("oldURLForTab" + tabID, "noPreviousURL");
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


/**
 * Listens for a message from the background containing the current tab-id.
 * The id is stored in the global tabID variable.
 */
function listenToBackground() {
    chrome.runtime.onMessage.addListener(function(request) {
        tabID = request.urlChange;
    });
}


/**
 * Injects extension files into created script-tags in the current DOM-head.
 * Sets also up the extensions error handling.
 */
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


/**
 * Checks if someone is logged in with an google account on the current page.
 * If not create an interval for preventLoginPopup().
 */
function checkIfLoggedIn() {
    let avatarBtn  = getDOMElement("id", "avatar-btn");
    if (typeof avatarBtn === "undefined" && avatarBtn === null) {
        notLoggedIn = window.setInterval(preventLoginPopup, 500);
    }
}


/**
 * Checks the DOM for the presence of the Login popup, and closes it if present.
 * Also clears the interval in the notLoggedIn variable.
 */
function preventLoginPopup() {
    let noThxBtn = getDOMElement("class", "style-scope yt-button-renderer style-text size-small", 1);

    if (typeof noThxBtn !== "undefined" && noThxBtn !== null) {
        noThxBtn.click();
        clearInterval(notLoggedIn);
    }
}


