
var fullscreenAdMutator;

function skipAd() {
    let adBanner = getDOMElement("class", "ytp-ad-image-overlay");

    // Check if the ad is a banner or a skippable video, and act accordingly.
    if (adBanner != null && typeof adBanner != "undefined"){
        adBanner.remove();
        //document.getElementsByClassName('ytp-ad-overlay-close-button')[0].click();
        console.log('Ad Banner closed!');
    }
    else if (fullscreenAdMutator == null) {
        //fullscreenAdMutator = createMutator(detectFullscreenAd, getDOMElement("class", "html5-video-player"));
    }
}


async function detectFullscreenAd(mutations) {
    for (let mutation of mutations) {
        if (mutation.type === "childList") {
            let fullscreenAd = getDOMElement("class", "video-ads ytp-ad-module")
            if (fullscreenAd != null && typeof fullscreenAd != "undefined") {
                await skipFullscreenAd();
                //fullscreenAd.remove();
                console.log("test");
            }
        }
    }
}


function skipFullscreenAd() {
    return new Promise(
        function(resolve) {
            setTimeout(function() {
                console.log("hello");
                let skipButton = getDOMElement("class", "ytp-ad-skip-button ytp-button");
                if (skipButton != null && typeof skipButton != "undefined") {
                    skipButton.click();
                    console.log("clicked")
                }
                resolve();
            }, 5000);

        }
    );
}

function waitForFullscreenAd() {
    return new Promise(
        function(resolve) {
            let rawTime = getDOMElement("class", "ytp-time-duration").innerHTML.split(":");
            let timeToWait = parseInt(rawTime[0])*60000 + parseInt(rawTime[1])*1000 + 1000

            setTimeout(function (){
                console.log("trying now!")
                resolve();
            },timeToWait);
        }
    );
}