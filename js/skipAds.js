
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
    // Check if the ad is a banner or a skippable video, and act accordingly.
    if ($(".ytp-ad-image-overlay")[0]){
        document.getElementsByClassName('ytp-ad-overlay-close-button')[0].click();
        console.log('Ad Banner closed!');
    } else if ($(".ytp-ad-skip-button")[0]) {
        document.getElementsByClassName('ytp-ad-skip-button')[0].click();
        console.log('Full video add skipped!');
    }
}
