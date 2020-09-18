
// Closes the autostop dialogbox and ensures that the video is being resumed.
function preventAutostop() {
    // Check if the autostop dialogbox is present on the page, if yes close it and reload the page.
    // The page needs to be reloaded since Youtube won't continue to play the video if the playbutton
    // is being press automatically.
    let areYouStillThereContainer = getDOMElement("class", "style-scope yt-notification-action-renderer", 3);

    if (typeof areYouStillThereContainer !== "undefined" && !areYouStillThereContainer.getAttribute("aria-hidden")) {
        getDOMElement("class", "style-scope yt-notification-action-renderer", 2).click();
        areYouStillThereContainer.remove();
    } else if (document.getElementById("confirm-button") !== null) {
        document.getElementsByClassName("yt-simple-endpoint style-scope yt-button-renderer")[1].click();
        document.getElementsByTagName("paper-dialog")[0].remove();
        setTimeout(function() {
            location.reload();
        }, 1000);
    }
}
