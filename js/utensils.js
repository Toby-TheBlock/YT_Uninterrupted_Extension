
// returns a short version of the URL which doesn't include query-parameters and such,
// as they change even when the video is playing which cause trouble in regards to the playbutton.
function getVideoURL() {
    return window.location.href.substring(0,50);
}

function createDOMElement(elementType, elementattribute, value) {
    let element = document.createElement("" + elementType + "");
    elementattribute.forEach(function(currentVal, index) {
        element.setAttribute(currentVal, value[index]);
    });

    return element;
}

function getDOMElement(retrievalMethod, identificator, index = 0) {
    let object;
    switch (retrievalMethod) {
        case "id":
            object = document.getElementById("" + identificator + "");
            break;
        case "class":
            object = document.getElementsByClassName(identificator)[index];
            break;
        case "tag":
            object = document.getElementsByTagName(identificator)[index];
            break;
    }

    return object;
}


// Checks if the current YouTube-page is a video.
// @return true if current page is a video, else false.
function checkURLForVideo() {
    return document.URL.includes("https://www.youtube.com/watch");
}

function deleteLocalStorage(storageIndex) {
    try {
        localStorage.removeItem(storageIndex);
    } catch {
        reportError();
    }
}

function getLocalStorageValue(storageIndex) {
    return localStorage.getItem(storageIndex);
}


function setLocalStorageValue(storageIndex, value) {
    let localData = getLocalStorageValue(storageIndex);
    switch (localData) {
        case "true":
            localStorage.setItem(storageIndex, "false");
            break;
        case "false":
            localStorage.setItem(storageIndex, "true");
            break;
        default:
            localStorage.setItem(storageIndex, value);
            break;
    }
}

function reportError() {
    let occurredErrors = parseInt(localStorage.getItem("occurredErrors")) + 1;
    localStorage.setItem("occurredErrors", occurredErrors.toString());
}


/* LOOK AT THIS AT A LATER POINT

// Checks if the current page URL is different from the last time this function was called.
// @return true if the oldURL and the currentURL are different, else false.
function checkURLForChange() {
    try {

        let currentURL = getVideoURL();
        let previousURL = "";

        let caller = checkURLForChange.caller;

        if (caller === setupExtenstionInDOM) {
            previousURL = oldURL;
        } else {
            previousURL = getLocalStorageValue("oldURLForTab" + getDOMElement("id", "TabID").innerHTML);
        }

        if (currentURL !== previousURL) {
            if (caller === setupExtenstionInDOM) {
                oldURL = currentURL;
            } else {
                deleteLocalStorage(previousURL);
                localStorage.setItem("oldURLForTab" + getDOMElement("id", "TabID").innerHTML, currentURL);
            }
            return true;
        } else {
            return false;
        }
    } catch {
        return false;
    }
}

*/