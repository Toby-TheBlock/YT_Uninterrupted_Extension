
// Create a button element, which acts like a replay-button,
// and insert it to the video-controlbar. Also calls all necessary
// functions which make the replay-button work as intended.
function createReplayButton() {

    let replayButton = createDOMElement("button", ["id"], ["ytuReplayButton"]);
    replayButton.addEventListener("click", setReplayStatus);

    readyYTContextMenu();

    let currentStorageValue = getLocalStorageValue(getVideoURL());
    if (currentStorageValue === null || currentStorageValue === "false") {
        replayButton.classList.add("ytuReplayButton");
    } else {
        replayButton.classList.add("ytuReplayButtonOn");
        setYTContextMenuReplayStatus();
    }

    let replayButtonIcon = document.createTextNode("↻");
    replayButtonIcon.id = "ytuReplayButtonIcon";
    replayButton.appendChild(replayButtonIcon);

    let ytpLeftControls = getDOMElement("class", "ytp-left-controls");
    ytpLeftControls.insertBefore(replayButton, ytpLeftControls.childNodes[3]);

    getDOMElement("class", "ytp-fullscreen-button ytp-button").addEventListener("click", videoplayerFullscreen);
}


// Checks if the current video is in fullscreen mode or not,
// and moves the replay-button-icon into the correct position.
function videoplayerFullscreen() {
    // This timeout is so that the dom element can make changes to its classes, before they are investigated.
    setTimeout(function() {
        let replayButton = getDOMElement("id", "ytuReplayButton");
        let fullscreenModeActive = getDOMElement("class", "html5-video-player").classList.contains("ytp-big-mode");

        if (fullscreenModeActive) {
            replayButton.classList.add("ytuReplayButtonFullScreen");
        } else if (!fullscreenModeActive){
            replayButton.classList.remove("ytuReplayButtonFullScreen");
        }
    }, 100)
}

// Reset replay-button status on URL change. This ensures that
// the replay-button isn't still active on video change.
function resetReplayButton(){
    try {
        if (checkURLForChange() && getReplayBtnStatus()) {
            setReplayStatus();
        }
    } catch (e) {
        // Nothing needs to be caught, the element in question is "null" because the page hasn't loaded it jet.
    }
}

// Set replay-button status to "on" or "off". Also starts a
// interval for the replayVideo function if the replay-button
// is activated, or clears the interval if it's deactivated.
function setReplayStatus() {
    let replayButton = getDOMElement("id", "ytuReplayButton").classList;
    let toggleButton = getDOMElement("id", "toggleButton");

    if (!getReplayBtnStatus()) {
        replayButton.add("ytuReplayButtonOn");
        setLocalStorageValue(getVideoURL(), "true");
        manageIntervals(false);

    } else if (getReplayBtnStatus()) {
        replayButton.remove("ytuReplayButtonOn");
        setLocalStorageValue(getVideoURL(), "false");
        manageIntervals(true);
    }

    setYTContextMenuReplayStatus();
}


// Checks if the YouTube autoplay-button is activated or not.
// @return true if the autoplay-button is activated, and false if it is not.
function getReplayBtnStatus() {
    if (getDOMElement("id", "ytuReplayButton").classList.contains("ytuReplayButtonOn")) {
        return true;
    }

    return false;
}

async function readyYTContextMenu() {
    let fullScreenAd = getDOMElement("class", "ytp-ad-preview-container");

    if (fullScreenAd != null || typeof fullScreenAd != "undefined") {
        await waitForFullscreenAd();
    }

    try {
        getDOMElement("class", "video-stream").dispatchEvent(new MouseEvent("contextmenu", {
            bubbles: true,
            cancelable: false,
            view: window,
            button: 2,
            buttons: 0,
        }));

        document.querySelectorAll('[role="menuitemcheckbox"]')[0].setAttribute("style", "display: none;");
    } catch (e) {
        readyYTContextMenu();
    }
}

function setYTContextMenuReplayStatus() {
    if (getDOMElement("class", "ytp-menuitem").getAttribute("aria-checked") != getReplayBtnStatus()) {
        document.querySelectorAll('[role="menuitemcheckbox"]')[0].click();
    }
}
