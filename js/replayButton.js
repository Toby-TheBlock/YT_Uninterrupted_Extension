
// Create a button element, which acts like a replay-button,
// and insert it to the video-controlbar. Also calls all necessary
// functions which make the replay-button work as intended.
function createReplayButton() {

    let replayButton = createDOMElement("button", ["id"], ["ytu_replay_button"]);
    replayButton.addEventListener("click", setReplayStatus);

    let currentStorageValue = getLocalStorageValue(getVideoURL());
    if (currentStorageValue === null || currentStorageValue === "false") {
        replayButton.classList.add("ytu_replay_button_off");
    } else {
        replayButton.classList.add("ytu_replay_button_on");
        clickYTContextMenu();
    }

    let replayButtonIcon = document.createTextNode("↻");
    replayButtonIcon.id = "ytu_replay_button_icon";
    replayButton.appendChild(replayButtonIcon);

    let ytpLeftControls = getDOMElement("class", "ytp-left-controls");
    ytpLeftControls.insertBefore(replayButton, ytpLeftControls.childNodes[3]);

    window.setInterval(resetReplayButton, 1000);
    window.setInterval(videoplayerFullscreen, 1);
}


// Checks if the current video is in fullscreen mode or not,
// and moves the replay-button-icon into the correct position.
function videoplayerFullscreen() {
    let replayButton = getDOMElement("id", "ytu_replay_button");
    let fullscreenModeActive = getDOMElement("class", "html5-video-player").classList.contains("ytp-big-mode");

    if (fullscreenModeActive && !replayButton.classList.contains("ytuFullScreen")) {
        replayButton.classList.add("ytuFullScreen");
    } else if (!fullscreenModeActive){
        replayButton.classList.remove("ytuFullScreen");
    }
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
    let replayButton = getDOMElement("id", "ytu_replay_button").classList;
    let toggleButton = getDOMElement("id", "toggleButton");

    if (!getReplayBtnStatus()) {
        replayButton.add("ytu_replay_button_on");
        replayButton.remove("ytu_replay_button_off");
        setLocalStorageValue(getVideoURL(), "true");

    } else if (getReplayBtnStatus()) {
        replayButton.add("ytu_replay_button_off");
        replayButton.remove("ytu_replay_button_on");
        setLocalStorageValue(getVideoURL(), "false");
    }

    clickYTContextMenu();
}


// Checks if the YouTube autoplay-button is activated or not.
// @return true if the autoplay-button is activated, and false if it is not.
function getReplayBtnStatus() {
    if (getDOMElement("id", "ytu_replay_button").classList.contains("ytu_replay_button_on")) {
        return true;
    }

    return false;
}


async function clickYTContextMenu() {
    let fullScreenAd = getDOMElement("class", "ytp-ad-preview-container");

    if (fullScreenAd != null || typeof fullScreenAd != "undefined") {
        console.log("Test")
        await waitForFullscreenAd();
    }

    for (i = 0; i < 10; i++) {
        try {
            getDOMElement("class", "video-stream").dispatchEvent(new MouseEvent("contextmenu", {
                bubbles: true,
                cancelable: false,
                view: window,
                button: 2,
                buttons: 0,
            }));

            let contextMenuReplayBtn = getDOMElement("class", "ytp-menuitem")
            let previousStatus = contextMenuReplayBtn.getAttribute("aria-checked");
            document.querySelectorAll('[role="menuitemcheckbox"]')[0].click();

            if (contextMenuReplayBtn.getAttribute("aria-checked") != previousStatus) {
                console.log("works");
                return;
            }
        } catch (e) {
            // context menu couldn't be opened, trying again.
        }
    }
    console.log("context menu couldn't be opened even after 10 tries!");
}
