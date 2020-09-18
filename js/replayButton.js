
// Start an interval that tries to replay the video.
var replayInterval

// Create a button element, which acts like a replay-button,
// and insert it to the video-controlbar.
function createReplayButton() {

    let ytpLeftControls = getDOMElement("class", "ytp-left-controls");

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
    ytpLeftControls.insertBefore(replayButton, ytpLeftControls.childNodes[3]);

    window.setInterval(resetReplayButton, 1000);
    window.setInterval(videoplayerFullscreen, 10);
}



function videoplayerFullscreen() {
    let replayButton = getDOMElement("id", "ytu_replay_button");
    let fullscreenClassAdded = replayButton.classList.contains("ytuFullScreen");
    let fullscreenModeActive = getDOMElement("class", "html5-video-player").classList.contains("ytp-big-mode");

    if (fullscreenModeActive && !fullscreenClassAdded) {
        replayButton.classList.add("ytuFullScreen");
    } else {
        replayButton.classList.remove("ytuFullScreen");
    }
}

// Reset replay-button status on URL change.
// This ensures that the replay-button isn't still active on manual video change.
function resetReplayButton(){
    try {
        if (checkURLForChange()) {
            if (getReplayBtnStatus()) {
                setReplayStatus();
            }
        } else {
            if (typeof replayInterval === "undefined" && getReplayBtnStatus()) {
                replayInterval = setInterval(replayVideo, 1);
            }
        }
    } catch (e) {
        // Nothing needs to be caught, the element in question is "null" because the page hasn't loaded it jet.
    }
}

// Set replay-button status to "on" or "off".
// Also starts a interval for the replayVideo function if the replay-button is activated,
// or clears the interval if it's deactivated.
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


function getReplayBtnStatus() {
    if (getDOMElement("id", "ytu_replay_button").classList.contains("ytu_replay_button_on")) {
        return true;
    }
    return false;
}


function setAutoPlayBtnLS() {
    let autoplayButton = getDOMElement("class", "style-scope ytd-compact-autoplay-renderer", 3);
    if (autoplayButton != null) {
        let currentValue = (autoplayButton.getAttribute("aria-pressed") == "true") ? "true" : "false";
        if (getLocalStorageValue("autoplayButtonStatus") != currentValue && !getReplayBtnStatus()) {
            setLocalStorageValue("autoplayButtonStatus", currentValue);
        }
    }
}


function toggleAutoPlayBtn() {
    let autoPlayBtn = getDOMElement("class", "style-scope ytd-compact-autoplay-renderer", 3);
    // Check if the AUTOPLAY button is present on the page, since in playlists it isn't.
    if (getLocalStorageValue("autoplayButtonStatus") == "true" && autoPlayBtn != null) {
        getDOMElement("class", "toggle-container style-scope paper-toggle-button").click();
    }
}

// Checks if the current video has finished and can be restarted.
// Also restarts the video if that is possible.
// NOTE THIS FUNCTION DOESN'T MANAGE TO RESTART A VIDEO IF IT'S IN A PLAYLIST!!!!! NEEDS TO BE LOOKED AT,
// ONE SOLUTION COULD BE TO JUST RETURN TO THE LAST URL (VIDEO).
function replayVideo() {

    // The following value is youtubes replay-icon value.
    let replayButtonValue = "M 18,11 V 7 l -5,5 5,5 v -4 c 3.3,0 6,2.7 6,6 0,3.3 -2.7,6 -6,6 -3.3,0 -6,-2.7 -6,-6 h -2 c 0,4.4 3.6,8 8,8 4.4,0 8,-3.6 8,-8 0,-4.4 -3.6,-8 -8,-8 z";
    let ytpPlayButton = getDOMElement("class", "ytp-play-button");
    let ytpAutoPlayBtn = getDOMElement("class", "style-scope ytd-compact-autoplay-renderer", 3);

    if (getLocalStorageValue(getVideoURL()) == "true") {
        if (ytpPlayButton.childNodes[0].childNodes[1].getAttribute("d") == replayButtonValue) {
            // If there is no AUTOPLAY button reload the current page in order or replay the video,
            // otherwise first click the "cancel-up-next"-button and then the replay-button.
            console.log(getDOMElement("class", "style-scope ytd-compact-autoplay-renderer", 3))
            if (ytpAutoPlayBtn == null || typeof ytpAutoPlayBtn == "undefined") {
                location.reload();
                /*
                let prevButton = document.getElementsByClassName("ytp-prev-button ytp-button")[0];
                prevButton.href = "" + window.location.href + "";
                setTimeout(function (){
                    prevButton.click();
                },10);
                //document.getElementsByClassName("ytp-prev-button ytp-button")[0].click();
                //
                
                 */
            } else {
                //ytpCancelUpnextButton.click();
                console.log("test2");
                ytpPlayButton.click();
            }
        }
    }
}

