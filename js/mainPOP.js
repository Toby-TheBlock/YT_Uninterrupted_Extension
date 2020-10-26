
function updateStatus(id) {
    let element = document.getElementById(id);
    let status = element.getAttribute("aria-checked")

    if (status === "true") {
        element.setAttribute("aria-checked", "false");
        console.log("set to false")
    } else {
        element.setAttribute("aria-checked", "true");
        console.log("set to true")
    }

    sendToDB(id, status)
}



async function setSliderStatus(id) {
    let dbResults = await getFromDB(id);

    if (dbResults === "true") {
        document.getElementById(id).click();
    }
}



function prepareSliders() {
    let sliders = ["replayButton", "skipAds", "speedupAutoplay", "preventAutostop"]
    let setup = false;

    while (!setup) {
        try {
            console.log("test1");
            sliders.forEach(function (currentValue) {
                setSliderStatus(currentValue)
                document.getElementById(currentValue).addEventListener("click", function () {
                    updateStatus(this.id)
                });
            });

            setup = true
        } catch (e) {
            console.log("test");
            sendToDB("replayButton", "true")
        }
    }
}

prepareSliders();



