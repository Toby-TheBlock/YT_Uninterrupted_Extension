
var setupStage = window.setInterval(setupIntervals, 1000);
var intervalFunctions = [resetReplayButton, playNextVideo, preventAutostop, skipAd];
var activeIntervals = [];

// Sets up intervals for all the functions which are needed to support the extentions functionality.
// Runs only when the current Youtube-page is a video.
function setupIntervals() {
    if (checkURLForVideo()) {
        try {
            checkIfAutoplayHasBeenStopped();

            // Create a replayButton if isn't allready present on the page.
            if (getDOMElement("id", "ytuReplayButton") === null) {
                createReplayButton();
            }

            // Start the intervals for the prevent-autostop and speed-up-autoplay functionality.
            manageIntervals(true);

            let notLoggedInnContainer = getDOMElement("class", "style-scope ytd-button-renderer style-suggestive size-small");
            let notLoggedInnIcon = "M12,0 C18.62375,0 24,5.37625 24,12 C24,18.62375 18.62375,24 12,24 C5.37625,24 " +
                "0,18.62375 0,12 C0,5.37625 5.37625,0 12,0 Z M12,10.63625 C13.66,10.63625 15,9.29625 15,7.63625 C15," +
                "5.97625 13.66,4.63625 12,4.63625 C10.34,4.63625 9,5.97625 9,7.63625 C9,9.29625 10.34,10.63625 " +
                "12,10.63625 Z M12,12.40875 C8.33375,12.40875 5.455,14.18125 5.455,15.8175 C6.84125,17.95 " +
                "9.26875,19.3625 12,19.3625 C14.73125,19.3625 17.15875,17.95 18.545,15.8175 C18.545,14.18125 " +
                "15.66625,12.40875 12,12.40875 Z";

            if (notLoggedInnContainer != null) {
                if (notLoggedInnContainer.childNodes[0].childNodes[0].childNodes[0].getAttribute("d") === notLoggedInnIcon) {
                    console.log("Not logged inn");
                }
            }
            
            // End the setupStage by clearing the interval.
            clearInterval(setupStage);
        } catch (e) {
            reportError();
        }
    }
}

// Sets up intervals for all of the continues extensions functions, or stops them.
// @para1 boolean that decides if the intervals are to be setup or stopped.
function manageIntervals(status) {
    if (status) {
        intervalFunctions.forEach(function(currentEntry) {
            activeIntervals.push(window.setInterval(currentEntry, 100))
        })
    } else {
        activeIntervals.forEach(function(currentEntry) {
            clearInterval(currentEntry);
        })
    }
}

// Checks if the current YouTube-page is a video.
// @return true if current page is a video, else false.
function checkURLForVideo() {
    return document.URL.includes("https://www.youtube.com/watch");
}

function checkIfAutoplayHasBeenStopped() {
    if (localStorage.getItem("reloadAfterAutostop") === "true") {
        localStorage.setItem("reloadAfterAutostop", "false");
        getDOMElement("class", "ytp-next-button ytp-button").click();
    }
}

// Checks if the current page URL is different from the last time this function was called.
// @return true if the oldURL and the currentURL are different, else false.
function checkURLForChange() {
    try {
        let currentTabID = getDOMElement("id", "TabID").innerHTML;
        let currentURL = getVideoURL();
        let oldURL = getLocalStorageValue("oldURLForTab" + currentTabID)
        if (currentURL !== oldURL) {
            deleteLocalStorage(oldURL);
            localStorage.setItem("oldURLForTab" + currentTabID, currentURL);
            return true;
        } else {
            return false;
        }
    } catch(e) {
        return false;
    }
}

// The split("index") removes extra URL query-parameters which cause trouble in playlists.
function getVideoURL() {
    return window.location.href.split("index")[0];
}

function createDOMElement(elementType, elementattribute, value) {
    let element = document.createElement("" + elementType + "");
    elementattribute.forEach(function(currentVal, index) {
        element.setAttribute(currentVal, value[index]);
    });

    return element;
}

function getDOMElement(retrievalMethod, identificator, index = 0) {
    let object;
    switch (retrievalMethod) {
        case "id":
            object = document.getElementById("" + identificator + "");
            break;
        case "class":
            object = document.getElementsByClassName(identificator)[index];
            break;
        case "tag":
            object = document.getElementsByTagName(identificator)[index];
            break;
    }

    return object;
}

function deleteLocalStorage(storageIndex) {
    try {
        localStorage.removeItem(storageIndex);
    } catch (e) {
       reportError();
    }
}

function getLocalStorageValue(storageIndex) {
    return localStorage.getItem(storageIndex);
}


function setLocalStorageValue(storageIndex, value) {
    let localData = getLocalStorageValue(storageIndex);
    switch (localData) {
        case null:
            localStorage.setItem(storageIndex, value);
            break;
        case "true":
            localStorage.setItem(storageIndex, "false");
            break;
        case "false":
            localStorage.setItem(storageIndex, "true");
            break;
    }
}


function createMutator(callbackFunction, objectToObserve) {
    new MutationObserver(callbackFunction).observe(objectToObserve, {attributes: true});
}


function reportError() {
    let occurredErrors = parseInt(localStorage.getItem("occurredErrors")) + 1;
    localStorage.setItem("occurredErrors", occurredErrors.toString());
}