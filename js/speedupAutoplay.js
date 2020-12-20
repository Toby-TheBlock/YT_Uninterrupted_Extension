/* © Copyright 2020, Tobias Günther, All rights reserved. */

var nextUpPressed = false;


/**
 * Looks for the start-next-video button that appears after the current video has finished,
 * and presses it once detected. The button will be only pressed once due to nextUpPressed.
 */
function playNextVideo() {
    if (checkURLForVideo()) {
        let ytpStartNextVideo = getDOMElement("class", "ytp-upnext ytp-player-content ytp-suggestion-set");
        if (ytpStartNextVideo != null && ytpStartNextVideo.style.display !== "none") {
            if (!nextUpPressed) {
                document.getElementsByClassName("ytp-upnext-autoplay-icon")[0].click();
                nextUpPressed = true;
            }
        }
    }
}
