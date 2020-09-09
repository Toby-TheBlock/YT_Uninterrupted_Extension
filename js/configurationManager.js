
var setupStage = window.setInterval(setupIntervals, 100);

// Sets up intervals for all the functions which are needed to support the extentions functionality.
// Runs only when the current Youtube-page is a video.
function setupIntervals() {
    if (checkURLForVideo()) {
        try {
            //createMutator(detectSkippableAd, ytpVideoAds); YOUTUBE ADS AREN'T APPEARING ?????????????????????????????

            // Create a replayButton if isn't allready present on the page.
            if (document.getElementById("ytu_replay_button") === null) {
                createReplayButton();
            }
            // Start the intervals for the prevent-autostop and speed-up-autoplay functionality.
            window.setInterval(playNextVideo, 100);
            window.setInterval(preventAutostop, 100);
            //createMutator(detectUpNextButton, document.getElementsByClassName("ytp-upnext ytp-player-content")[0]);

            // End the setupStage by clearing the interval.
            clearInterval(setupStage);
        } catch (error) {
            console.log("Something went wrong under the configuration: " + error + ". Trying again!");
        }
    }
}
// Checks if the current YouTube-page is a video.
// @return true if current page is a video, else false.
function checkURLForVideo() {
    return document.URL.includes("https://www.youtube.com/watch");
}

// Checks if the current page URL is different from the last time this function was called.
// @return true if the oldURL and the currentURL are different, else false.
function checkURLForChange() {

    // IF MULTIPLE TABS ARE OPEN THE LOCALSTORE IS BEING UPDATET FROM TWO PLACES AT ONCE,
    // THIS CAUSES BIG ISSUES SINCE THE URLS ARE COMPETING WITH EACH OTHER!!!!!!!
    try {
        let currentTabID = document.getElementById("TabID").innerHTML;
        let currentURL = document.URL;
        if (currentURL !== localStorage.getItem("oldURLForTab" + currentTabID)) {
            localStorage.setItem("oldURLForTab" + currentTabID, currentURL);
            return true;
        } else {
            return false;
        }
    } catch(error) {
        return false;
    }
}

function createMutator(callbackFunction, objectToObserve) {
    new MutationObserver(callbackFunction).observe(objectToObserve, {attributes: true,});
}