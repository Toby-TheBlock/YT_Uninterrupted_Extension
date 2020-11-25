
var occuredErrorsReset = true;

function errorManagement() {
    if (occuredErrorsReset) {
        resetErrorCount();
    } else {
        if (parseInt(localStorage.getItem("occurredErrors")) === 1) {
            createErrorMSGBox();
        }
    }
}

function resetErrorCount() {
    localStorage.setItem("occurredErrors", "0");
    occuredErrorsReset = false;
}

function createErrorMSGBox() {
    if (typeof getDOMElement("class", "errorPopupContainer") === "undefined") {
        let popupContainer = createDOMElement("div", ["class"], ["errorPopupContainer"]);

        let closeBtn = createDOMElement("p", ["class", "click"], ["errorPopupContent"]);
        closeBtn.addEventListener("click", removeErrorMSGBox);
        let closeBtnTxt = document.createTextNode("X");
        closeBtn.appendChild(closeBtnTxt);
        popupContainer.appendChild(closeBtn);

        document.body.appendChild(popupContainer);
    }

}

function removeErrorMSGBox() {
    getDOMElement("class", "errorPopupContainer").remove();
    resetErrorCount();
}