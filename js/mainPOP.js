/* © Copyright 2021, Tobias Günther, All rights reserved. */

prepareSliders();


/**
 * Checks the stat of the defined input-slider and changes it to the opposite.
 * Sends the new stat of the slider to the database.
 * @param id
 */
function updateStatus(id) {
    let element = document.getElementById(id);
    let status = element.getAttribute("aria-checked")

    if (status === "true") {
        element.setAttribute("aria-checked", "false");
    } else {
        element.setAttribute("aria-checked", "true");
    }

    chrome.runtime.sendMessage({sendToDB: id + "/" + status});
}


/**
 * Set the initial stat of the defined input-slider based on the value stored in the database.
 * @param id
 * @returns {Promise<void>}
 */
async function setSliderStatus(id) {
    let sliderStatus = await getDataFromBackground(id);
    if (sliderStatus === "true") {
        document.getElementById(id).click();
    }
}


function prepareSliders() {
    let sliders = ["replayButton", "skipAds", "speedupAutoplay", "preventAutostop"];

    sliders.forEach(function (currentValue) {
        setSliderStatus(currentValue)
        document.getElementById(currentValue).addEventListener("click", function() {
            updateStatus(this.id)
        });
    });
}





