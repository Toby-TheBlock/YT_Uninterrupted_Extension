/* © Copyright 2020, Tobias Günther, All rights reserved. */

/**
 * Closes the autostop dialog box and all other dialog options once they appear,
 * and then ensures that the video is being resumed.
 */
function preventAutostop() {
    try {
        let areYouStillThereContainer = getDOMElement("class", "style-scope yt-notification-action-renderer", 3);

        if (typeof areYouStillThereContainer !== "undefined" && !areYouStillThereContainer.getAttribute("aria-hidden")) {
            getDOMElement("class", "style-scope yt-notification-action-renderer", 2).click();
            areYouStillThereContainer.remove();

        } else if (getDOMElement("id", "confirm-button") !== null) {
            getDOMElement("class", "yt-simple-endpoint style-scope yt-button-renderer").click();
            getDOMElement("tag", "paper-dialog").remove();

            /**
             * The page needs to be reloaded since Youtube won't continue to play the video,
             * even if the dialog box asking to resume is being pressed. Therefore a reload is necessary.
             * The delay ensures that YouTube has registered the closing of the autostop dialog box
             * before the page is being reloaded.
             */
            setTimeout(function() {
                localStorage.setItem("reloadAfterAutostop", "true");
                location.reload();
            }, 100);
        }
    } catch {
        reportError();
    }
}
