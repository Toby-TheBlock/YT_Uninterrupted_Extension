
function skipAd() {
    let adBanner = getDOMElement("class", "ytp-ad-image-overlay");
    let fullScreenAd = getDOMElement("class", "ytp-ad-skip-button ytp-button");

    // Check if the ad is a banner or a skippable video, and act accordingly.
    if (adBanner != null || typeof adBanner != "undefined"){
        document.getElementsByClassName('ytp-ad-overlay-close-button')[0].click();
        console.log('Ad Banner closed!');
    } else if (fullScreenAd != null || typeof fullScreenAd != "undefined") {
        document.getElementsByClassName('ytp-ad-skip-button ytp-button')[0].click();
        console.log('Full video add skipped!');
    }
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