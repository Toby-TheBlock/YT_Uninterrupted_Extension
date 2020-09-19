
// Variable to check that the nextUp Button isn't being pressed more than once.
var nextUpPressed = false;

// Click the start-next-video button as soon as it appears.
function playNextVideo() {
    if (checkURLForVideo()) {
        let ytpStartNextVideo = getDOMElement("class", "ytp-upnext ytp-player-content ytp-suggestion-set");
        if (ytpStartNextVideo != null && ytpStartNextVideo.style.display !== "none") {
            if (getDOMElement("id", "ytu_replay_button").classList.contains("ytu_replay_button_off") && !nextUpPressed) {
                document.getElementsByClassName("ytp-upnext-autoplay-icon")[0].click();
                nextUpPressed = true;
            }
        }
    }
}
