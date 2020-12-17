/* © Copyright 2020, Tobias Günther, All rights reserved. */

var availableFunctionality = ["replayButton", "skipAds", "speedupAutoplay", "preventAutostop"];
var activeFunctionality = new Map();
var activeIntervals = new Map();

setTimeout(
    function(){
        selectFunctionality();
        setupIntervals();
    }, 500
);


/**
 * Checks which functionality is enabled, and sets up the activeFunctionality Map accordingly.
 * The check is performed by looking for the extentions injected script-tags in the DOM-head.
 */
function selectFunctionality() {
    availableFunctionality.forEach(function(currentEntry) {
        let scriptTags = document.head.getElementsByTagName("script");
        for (let tag of scriptTags) {
            if (tag.src.includes(currentEntry)) {
                var value;
                switch (currentEntry) {
                    case "replayButton":
                        value = resetReplayButton;
                        break;
                    case "skipAds":
                        value = skipAds;
                        break;
                    case "speedupAutoplay":
                        value = playNextVideo;
                        break;
                    case "preventAutostop":
                        value = preventAutostop;
                        break;
                }
                activeFunctionality.set(currentEntry, value);
            }
        }
    });
}


/**
 * Sets up intervals for all main functions of all the active functionality,
 * and creates a replaybutton if it isn't already present in the DOM.
 */
function setupIntervals() {
    if (checkURLForVideo()) {
        try {
            checkIfAutoplayHasBeenStopped();

            if (activeFunctionality.has("replayButton") && getDOMElement("id", "ytuReplayButton") === null) {
                createReplayButton();
            }

            if (activeFunctionality.has("preventAutostop")) {
                createMutator(checkIfVideoIsPlaying, getDOMElement("class", "ytp-play-button ytp-button").childNodes[0].childNodes[1]);
            }

            manageAllIntervals(true);
        } catch {
            reportError();
            setupIntervals();
        }
    }
}

/**
 * Either sets or clears intervals for all entries inn the activeFunctionality map.
 * @param status - true = setup intervals, false = clear intervals.
 */
function manageAllIntervals(status) {
    if (status) {
        for (let [key, intervalFunction] of activeFunctionality.entries()) {
            activeIntervals.set(key, window.setInterval(intervalFunction, 100));
        }
    } else {
        for (let interval of activeIntervals.values()) {
            clearInterval(interval);
        }
    }
}


/**
 * Either sets or clears a specified interval inn the activeFunctionality map.
 * @param intervalId - name of the functionality whos interval needs changing.
 * @param status - true = setup interval, false = clear interval.
 */
function manageSingleInterval(intervalId, status) {
    if (status) {
        activeIntervals.set(intervalId, window.setInterval(activeFunctionality.get(intervalId), 100));
    } else {
        if (activeIntervals.has(intervalId)) {
            clearInterval(activeIntervals.get(intervalId));
            activeIntervals.delete(intervalId);
        }
    }
}


/**
 * Checks if the current pageload is due to the closure of a previously closed autostop dialogbox.
 * If the page has been reloaded due to the autostop, skip to the next video.
 */
function checkIfAutoplayHasBeenStopped() {
    if (localStorage.getItem("reloadAfterAutostop") === "true") {
        localStorage.setItem("reloadAfterAutostop", "false");
        getDOMElement("class", "ytp-next-button ytp-button").click();
    }
}


/**
 * Checks if the current video is playing or paused,
 * if paused the interval for preventing autoplay is to be cleared.
 * Otherwise it is being setup, if not already active.
 * @param mutations - mutations which are to be monitored.
 */
function checkIfVideoIsPlaying(mutations) {
    for (let mutation of mutations) {
        if (mutation.type === "attributes") {
            let videoPlaying = getDOMElement("class", "ytp-play-button ytp-button").childNodes[0].childNodes[1].getAttribute("d") === "M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z";
            setTimeout(function (){
                if (!videoPlaying && activeIntervals.has("preventAutostop")) {
                    manageSingleInterval("preventAutostop", false);
                } else if (videoPlaying && !activeIntervals.has("preventAutostop")) {
                    manageSingleInterval("preventAutostop", true);
                }
            }, 3000);
        }
    }
}


/**
 * Checks if the current page URL is different from the last time this function was called.
 * The previous page URL is stored in a tab specific localStorage.
 * @returns {boolean}
 */
function checkURLForChange() {
    try {
        let currentTabID = getDOMElement("id", "TabID").innerHTML;
        let currentURL = getVideoURL();
        let oldURL = localStorage.getItem("oldURLForTab" + currentTabID)
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


