/* © Copyright 2021, Tobias Günther, All rights reserved. */

var nextUpPressed = false;


/**
 * Looks for the start-next-video button that appears after the current video has finished,
 * and presses it once detected. The button will be only pressed once due to nextUpPressed.
 */
function playNextVideo() {
    if (checkURLForVideo()) {
        let startNextVideoContainer = getDOMElement("class", "ytp-autonav-endscreen-button-container");
        if (startNextVideoContainer != null && startNextVideoContainer.style.display !== "none") {
            if (!nextUpPressed) {
                getDOMElement("class", "ytp-autonav-endscreen-upnext-button ytp-autonav-endscreen-upnext-play-button").click();
                nextUpPressed = true;
            }
        }
    }
}
