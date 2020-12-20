/* © Copyright 2020, Tobias Günther, All rights reserved. */

/**
 * Creates a dedicated replay-button, sets it's intial state, and inserts it to the video-controlbar.
 * Also initialises/sets up all of the functionality for the replay-button.
 */
function createReplayButton() {
    let replayButton = createDOMElement("button", ["id"], ["ytuReplayButton"]);
    replayButton.addEventListener("click", setReplayStatus);

    readyYTContextmenu();

    let currentStorageValue = localStorage.getItem(getVideoURL());
    if (currentStorageValue === null || currentStorageValue === "false") {
        replayButton.classList.add("ytuReplayButton");
    } else {
        replayButton.classList.add("ytuReplayButtonOn");
        setYTContextmenuReplayStatus();
    }

    let replayButtonIcon = document.createTextNode("↻");
    replayButtonIcon.id = "ytuReplayButtonIcon";
    replayButton.appendChild(replayButtonIcon);

    let ytpLeftControls = getDOMElement("class", "ytp-left-controls");
    ytpLeftControls.insertBefore(replayButton, ytpLeftControls.childNodes[3]);

    createMutator(detectFullscreen, getDOMElement("class", "html5-video-player"));

}


/**
 * Looks for changes in the attributes of the specififed element (in this case the main video-player).
 * @param mutations - mutations which are to be monitored.
 */
function detectFullscreen(mutations) {
    for (let mutation of mutations) {
        if (mutation.type === "attributes") {
            videoplayerFullscreen();
        }
    }
}


/**
 * Moves the replay-button into the right place, bases on if the video-player is in fullscreenmode or not.
 */
function videoplayerFullscreen() {
    let replayButton = getDOMElement("id", "ytuReplayButton");
    let fullscreenModeActive = getDOMElement("class", "html5-video-player").classList.contains("ytp-big-mode");

    if (fullscreenModeActive) {
        replayButton.classList.add("ytuReplayButtonFullScreen");
    } else if (!fullscreenModeActive){
        replayButton.classList.remove("ytuReplayButtonFullScreen");
    }
}


/**
 * Resets the replay-button status on URL change.
 * This ensures that the replay-button doesn't stay active on video change.
 */
function resetReplayButton(){
    if (checkURLForChange() && getReplayBtnStatus()) {
        setReplayStatus();
    }
}


/**
 * Sets the replay-button status to either "on" (true) or "off" (false), based on it's current state.
 * Also activates/clears all background intervals which are being used.
 */
function setReplayStatus() {
    let replayButton = getDOMElement("id", "ytuReplayButton").classList;
    let toggleButton = getDOMElement("id", "toggleButton");

    if (!getReplayBtnStatus()) {
        replayButton.add("ytuReplayButtonOn");
        setLocalStorageValue(getVideoURL(), "true");
        manageAllIntervals(false);

        // These two function need to be included in both of the if statments because of "tab-bleeding".
        // Meaning that the the setReplayStatus called in one tab also runs in all the other idling tabs.
        checkForFullscreenAd();
        setYTContextmenuReplayStatus();

    } else if (getReplayBtnStatus()) {
        replayButton.remove("ytuReplayButtonOn");
        setLocalStorageValue(getVideoURL(), "false");
        manageAllIntervals(true);

        // Duplicate code
        checkForFullscreenAd();
        setYTContextmenuReplayStatus();
    }
}


/**
 * Checks and returns the current state of the replay-button.
 * @returns {boolean}
 */
function getReplayBtnStatus() {
    if (getDOMElement("id", "ytuReplayButton").classList.contains("ytuReplayButtonOn")) {
        return true;
    }

    return false;
}


/**
 * Enables the hidden contextmenu which normally appears on a right-click on the main video-player,
 * to unsure that all of it's HTML-code is loaded into the DOM.
 * @returns {Promise<void>}
 */
function readyYTContextmenu() {

    checkForFullscreenAd();

    try {
        getDOMElement("class", "video-stream").dispatchEvent(new MouseEvent("contextmenu", {
            bubbles: true,
            cancelable: false,
            view: window,
            button: 2,
            buttons: 0,
        }));

        document.querySelectorAll('[role="menuitemcheckbox"]')[0].setAttribute("style", "display: none;");
    } catch {
        readyYTContextmenu();
    }
}


/**
 * Activates or disables the repeat-option in the hidden contextmenu based on the replay-button status.
 */
function setYTContextmenuReplayStatus() {
    if (getDOMElement("class", "ytp-menuitem").getAttribute("aria-checked") != getReplayBtnStatus()) {
        document.querySelectorAll('[role="menuitemcheckbox"]')[0].click();
    }
}


/**
 * Checks if there is currently a fullscreen ad playing, if so wait for it to finish.
 * @returns {Promise<void>}
 */
async function checkForFullscreenAd() {
    let fullScreenAd = getDOMElement("class", "ytp-ad-preview-container");

    if (fullScreenAd != null || typeof fullScreenAd != "undefined") {
        await waitForFullscreenAd();
    }
}


/**
 * A promise which resolves automatically once a fullscreen ad has finished.
 * @returns {Promise<unknown>}
 */
function waitForFullscreenAd() {
    return new Promise(
        function(resolve) {
            let rawTime = getDOMElement("class", "ytp-time-duration").innerHTML.split(":");
            let timeToWait = parseInt(rawTime[0])*60000 + parseInt(rawTime[1])*1000 + 1000;

            setTimeout(function (){
                resolve();
            },timeToWait);
        }
    );
}