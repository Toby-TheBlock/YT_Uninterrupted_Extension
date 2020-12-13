
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
        document.getElementById(currentValue).addEventListener("click", function () {
            updateStatus(this.id)
        });
    });
}

prepareSliders();



