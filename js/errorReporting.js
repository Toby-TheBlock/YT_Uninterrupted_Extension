/* © Copyright 2021, Tobias Günther, All rights reserved. */

var occurredErrorsReset = true;


/**
 * Resets the error counter for each new page,
 * and checks how many errors have occurred on the current on.
 * If the max amount of allowed errors has been exceeded, alert the user.
 */
function errorManagement() {
    if (occurredErrorsReset) {
        let errorMSGBox = getDOMElement("class", "errorPopupContainer");
        if (typeof errorMSGBox !== "undefined" && errorMSGBox !== null) {
            removeErrorMSGBox();
        }
        resetErrorCount();
    } else {
        if (parseInt(localStorage.getItem("occurredErrors")) === 100) {
            createErrorMSGBox();
        }
    }
}


/**
 * Creates a popup messagebox on the current page,
 * which informs the user that something is wrong.
 */
function createErrorMSGBox() {
    if (typeof getDOMElement("class", "errorPopupContainer") === "undefined") {
        let popupContainer = createDOMElement("div", ["class"], ["errorPopupContainer"]);

        let errorMsg = createDOMElement("p", ["class"], ["errorPopupContent"]);
        let errorTxt = ["An error occurred setting up the YT-uninterrupted. :(",
            "Reloading the page will most likely solve this issue.",
            "If the error still persists try restarting the web-browser."];
        for (var i=0; i < errorTxt.length; i++) {
            errorMsg.appendChild(document.createTextNode(errorTxt[i]));
            errorMsg.appendChild(document.createElement("br"));
        }

        popupContainer.appendChild(errorMsg);

        let closeBtnWrapper = createDOMElement("div", ["class"], ["closeBtnWrapper"])
        let closeBtn = createDOMElement("p", ["class"], ["closeBtn errorPopupContent"]);
        closeBtn.innerHTML = "X";
        closeBtn.addEventListener("click", removeErrorMSGBox);
        closeBtnWrapper.appendChild(closeBtn);
        popupContainer.appendChild(closeBtnWrapper);

        document.body.appendChild(popupContainer);
    }
}


function resetErrorCount() {
    localStorage.setItem("occurredErrors", "0");
    occurredErrorsReset = false;
}


function removeErrorMSGBox() {
    getDOMElement("class", "errorPopupContainer").remove();
    localStorage.setItem("occurredErrors", "-1");
}