
var availableFunctionality = ["replayButton", "skipAds", "speedupAutoplay", "preventAutostop"];
var activeFunctionality = new Map();
var activeIntervals = new Map();

selectFunctionality();

setTimeout(
    function(){
        setupIntervals();
    }, 500
);

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
                        value = skipAd;
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


// Sets up intervals for all the functions which are needed to support the extentions functionality.
// Runs only when the current Youtube-page is a video.
function setupIntervals() {
    if (checkURLForVideo()) {
        try {
            checkIfAutoplayHasBeenStopped();

            // Create a replayButton if isn't already present on the page.
            if (activeFunctionality.has("replayButton") && getDOMElement("id", "ytuReplayButton") === null) {
                createReplayButton();
            }

            // Start the intervals for the prevent-autostop and speed-up-autoplay functionality.
            manageAllIntervals(true);
            createMutator(checkIfVideoIsPlaying, getDOMElement("class", "ytp-play-button ytp-button").childNodes[0].childNodes[1]);
        } catch {
            reportError();
            setupIntervals();
        }
    }
}


// Sets up intervals for all of the continues extensions functions, or stops them.
// @para1 boolean that decides if the intervals are to be setup or stopped.
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


function checkIfAutoplayHasBeenStopped() {
    if (localStorage.getItem("reloadAfterAutostop") === "true") {
        localStorage.setItem("reloadAfterAutostop", "false");
        getDOMElement("class", "ytp-next-button ytp-button").click();
    }
}

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


// Checks if the current page URL is different from the last time this function was called.
// @return true if the oldURL and the currentURL are different, else false.
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


function createMutator(callbackFunction, objectToObserve) {
    const observer = new MutationObserver(callbackFunction);
    observer.observe(objectToObserve, {attributes: true, childList: true});
    return observer;
}


