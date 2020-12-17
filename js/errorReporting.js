/* © Copyright 2020, Tobias Günther, All rights reserved. */


// NEED TO HAVE A LOOK AT MAXIMUM CALL STACK SIZE ISSUE WHICH OCCURSE WHEN reportError() IS CALLED TO MANY TIMES!!!!

var occuredErrorsReset = true;


/**
 * Resets the error counter for each new webpage,
 * and checks how many errors have occured on the current on.
 * If the max amount of allowed errors has been exceeded, alert the user.
 */
function errorManagement() {
    if (occuredErrorsReset) {
        resetErrorCount();
    } else {
        if (parseInt(localStorage.getItem("occurredErrors")) === 10) {
            createErrorMSGBox();
        }
    }
}


/**
 * Creates a popup messagebox on the current page,
 * which informes the user that something is wrong.
 */
function createErrorMSGBox() {
    if (typeof getDOMElement("class", "errorPopupContainer") === "undefined") {
        let popupContainer = createDOMElement("div", ["class"], ["errorPopupContainer"]);

        let errorMsg = createDOMElement("p", ["class"], ["errorPopupContent"]);
        let errorTxt = ["An error occured setting up the YT-uninterrupted. :(",
            "Reloading the page will most likely solve this issue.",
            "If the error still presists try restarting the web-browser."];
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
    occuredErrorsReset = false;
}


function removeErrorMSGBox() {
    getDOMElement("class", "errorPopupContainer").remove();
    localStorage.setItem("occurredErrors", "-1");
}