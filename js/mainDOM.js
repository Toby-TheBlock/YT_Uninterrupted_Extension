
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

            // End the setupStage by clearing the interval.
            clearInterval(setupStage);
        } catch {
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
    } catch {
        return false;
    }
}


function createMutator(callbackFunction, objectToObserve) {
    const observer = new MutationObserver(callbackFunction);
    observer.observe(objectToObserve, {attributes: true, childList: true});
    return observer;
}


