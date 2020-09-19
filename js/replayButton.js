
// Variable to store the replayVideo() function interval.
var replayInterval

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
        if (checkURLForChange()) {
            if (getReplayBtnStatus()) {
                setReplayStatus();
            }
        } else {
            // Start the replayVideo interval again after the current
            // video page has been reloaded, if the replay-button is actived.
            if (typeof replayInterval === "undefined" && getReplayBtnStatus()) {
                replayInterval = setInterval(replayVideo, 1);
            }
        }
    } catch (e) {
        // Nothing needs to be caught, the element in question is "null" because the page hasn't loaded it jet.
    }
}

// Set replay-button status to "on" or "off". Also starts a
// interval for the replayVideo function if the replay-button
// is activated, or clears the interval if it's deactivated.
function setReplayStatus() {

    setAutoPlayBtnLS();

    let replayButton = getDOMElement("id", "ytu_replay_button").classList;
    let toggleButton = getDOMElement("id", "toggleButton");

    if (!getReplayBtnStatus()) {
        replayButton.add("ytu_replay_button_on");
        replayButton.remove("ytu_replay_button_off");
        setLocalStorageValue(getVideoURL(), "true");

        replayInterval = setInterval(replayVideo, 1);

    } else if (getReplayBtnStatus()) {
        replayButton.add("ytu_replay_button_off");
        replayButton.remove("ytu_replay_button_on");
        setLocalStorageValue(getVideoURL(), "false");

        // Delete the interval which tries to replay the video.
        clearInterval(replayInterval);
    }

    toggleAutoPlayBtn();
}


// Checks if the YouTube autoplay-button is activated or not.
// @return true if the autoplay-button is activated, and false if it is not.
function getReplayBtnStatus() {
    if (getDOMElement("id", "ytu_replay_button").classList.contains("ytu_replay_button_on")) {
        return true;
    }
    return false;
}


// Stores the current autoplay-button status (on/off) in a localStorage.
// Will only set the status if the autoplay-button is present on the current page.
function setAutoPlayBtnLS() {
    let autoplayButton = getDOMElement("class", "style-scope ytd-compact-autoplay-renderer", 3);
    if (autoplayButton != null) {
        let currentValue = (autoplayButton.getAttribute("aria-pressed") == "true") ? "true" : "false";
        if (getLocalStorageValue("autoplayButtonStatus") != currentValue && !getReplayBtnStatus()) {
            setLocalStorageValue("autoplayButtonStatus", currentValue);
        }
    }
}


// Automatically clicks the autoplay-button based on value stored in the localStorage.
function toggleAutoPlayBtn() {
    let autoPlayBtn = getDOMElement("class", "style-scope ytd-compact-autoplay-renderer", 3);
    // Check if the AUTOPLAY button is present on the page, since in playlists it isn't.
    if (getLocalStorageValue("autoplayButtonStatus") == "true" && autoPlayBtn != null) {
        getDOMElement("class", "toggle-container style-scope paper-toggle-button").click();
    }
}

// Checks if the current video has finished and restarts it if possible.
function replayVideo() {

    // The following value is youtubes replay-icon value.
    let replayButtonValue = "M 18,11 V 7 l -5,5 5,5 v -4 c 3.3,0 6,2.7 6,6 0,3.3 -2.7,6 -6,6 -3.3,0 -6,-2.7 -6,-6 h -2 c 0,4.4 3.6,8 8,8 4.4,0 8,-3.6 8,-8 0,-4.4 -3.6,-8 -8,-8 z";
    let ytpPlayButton = getDOMElement("class", "ytp-play-button");
    let ytpAutoPlayBtn = getDOMElement("class", "style-scope ytd-compact-autoplay-renderer", 3);

    if (getLocalStorageValue(getVideoURL()) == "true") {
        if (ytpPlayButton.childNodes[0].childNodes[1].getAttribute("d") == replayButtonValue) {
            // If there is no autoplay-button on the page, reload it in order to replay the video.
            // This needs to be done because we are in a playlist, and here the normal replay-button
            // doesn't work correctly.
            if (ytpAutoPlayBtn == null || typeof ytpAutoPlayBtn == "undefined") {
                location.reload();
            } else {
                ytpPlayButton.click();
            }
        }
    }
}

