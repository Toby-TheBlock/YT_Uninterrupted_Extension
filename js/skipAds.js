
// Object to be observed.
var ytpVideoAds = document.getElementsByClassName('video-ads')[0];

function detectSkippableAd(mutations) {
    for (let mutation of mutations) {
        // Ensure that the observed object has made changes to its childList.
        // If an ad has been added to the childList run the skipAd function.
        if (mutation.type === "childList") {
            skipAd();
        }
    }
}

function skipAd() {



    let test = getDOMElement("class", "ytp-ad-image-overlay");
    let test2 = getDOMElement("class", "ytp-ad-skip-button ytp-button");

    // Check if the ad is a banner or a skippable video, and act accordingly.
    if (test != null || typeof test != "undefined"){
        document.getElementsByClassName('ytp-ad-overlay-close-button')[0].click();
        console.log('Ad Banner closed!');
    } else if (test2 != null || typeof test2 != "undefined") {
        document.getElementsByClassName('ytp-ad-skip-button ytp-button')[0].click();
        console.log('Full video add skipped!');
    }
}
