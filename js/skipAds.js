/* © Copyright 2020, Tobias Günther, All rights reserved. */

/**
 * Checks if either an banner or fullscreen Ad is currently playing, and closes it as soon as possible.
 * Fullscreen ads are managed through the use of a observer.
 */
async function skipAds() {
    let fullscreenAd = getDOMElement("class", "video-ads ytp-ad-module");
    let adBanner = getDOMElement("class", "ytp-ad-overlay-container");
    if (adBanner != null && typeof adBanner != "undefined") {
        adBanner.remove();
    }
    if (fullscreenAd != null && typeof fullscreenAd != "undefined") {
        await skipFullscreenAd();
    }
}


function skipFullscreenAd() {
    return new Promise(
        function(resolve) {
            setTimeout(function() {
                let skipButton = getDOMElement("class", "ytp-ad-skip-button ytp-button");
                if (skipButton != null && typeof skipButton != "undefined") {
                    skipButton.click();
                }
                resolve();
            }, 1000);
        }
    );
}


