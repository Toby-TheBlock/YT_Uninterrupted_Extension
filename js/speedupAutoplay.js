var replayPressed = false;

// Click the start-next-video button as soon as it appears.
function playNextVideo() {
    if (checkURLForVideo()) {
        let ytpStartNextVideo = document.getElementsByClassName("ytp-upnext ytp-player-content ytp-suggestion-set")[0];
        if (ytpStartNextVideo != null && ytpStartNextVideo.style.display !== "none") {
            if (document.getElementById("ytu_replay_button").classList.contains("ytu_replay_button_off") && !replayPressed) {
                document.getElementsByClassName("ytp-upnext-autoplay-icon")[0].click();
                replayPressed = true;
            }
        }
    }
}


async function sleep(msec) {
    return new Promise(resolve => setTimeout(resolve, msec));
}



function detectUpNextButton (mutations) {
    console.log(mutations)
    for (let mutation of mutations) {
        // Ensure that the observed object has made changes to its attributes.
        // If display is not "none" run the playNextVideo function.
        if (mutation.type === "attributes") {
            console.log("Changed spotted!");
            if (!document.getElementsByClassName("ytp-upnext ytp-player-content")[0].classList.contains("ytp-upnext-autoplay-paused")
                && document.getElementById("ytu_replay_button").classList.contains("ytu_replay_button_off")) {
                console.log("Tracked change!");
                playNextVideo();
            }
        }
    }
}
