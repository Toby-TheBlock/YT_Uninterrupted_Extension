
/**
 * Gets a short version of the page-URL which doesn't include query-parameters and such,
 * as they somethimes change while a video is playing which cause trouble in regards to resetting things.
 * @returns {string}
 */
function getVideoURL() {
    return window.location.href.substring(0,50);
}


/**
 * Shorthand function for creating a new DOM element.
 * @param elementType - string which defines the elements type
 * @param elementattribute - list of attributes which are to be assign to the element.
 * @param value - list over the value to be assigned to the attributes.
 * @returns {HTMLElement}
 */
function createDOMElement(elementType, elementattribute, value) {
    let element = document.createElement("" + elementType + "");
    elementattribute.forEach(function(currentVal, index) {
        element.setAttribute(currentVal, value[index]);
    });

    return element;
}


/**
 * Shorthand function for retrieving a DOM element.
 * @param retrievalMethod - string which defines the elements type who's to be retrieved.
 * @param identificator - the id, class- or tag-name of the element.
 * @param index - index of the HTML-collection element which is to be retrieved.
 * @returns {Element}
 */
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


/**
 * Checks if the current YouTube-page is a video.
 * @returns {boolean}
 */
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


/**
 * Updates a localStorage value, if the value is either true/false the opppsite value is being stored.
 * @param storageIndex
 * @param value
 */
function setLocalStorageValue(storageIndex, value) {
    let localData = localStorage.getItem(storageIndex);
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


/**
 * Increases the countervalue stored in a localStorage by one,
 * as long as the localStorage hasn't been locked to incrementation.
 */
function reportError() {
    if (parseInt(localStorage.getItem("occurredErrors")) >= 0) {
        let occurredErrors = parseInt(localStorage.getItem("occurredErrors")) + 1;
        localStorage.setItem("occurredErrors", occurredErrors.toString());
    }
}


/**
 * Communicates with the background in order to retrieve data form the extension database.
 * @param id - id of the database entry who's data is to be retrieved.
 * @returns {Promise<unknown>}
 */
function getDataFromBackground(id) {
    return new Promise(
        function(resolve) {
            let port = chrome.runtime.connect({name: "getFromDB"});
            port.postMessage({getFromDB: "" + id + ""});
            port.onMessage.addListener(function(response) {
                resolve(response.data);
            });
        }
    );
}


function createMutator(callbackFunction, objectToObserve) {
    const observer = new MutationObserver(callbackFunction);
    observer.observe(objectToObserve, {attributes: true, childList: true});
    return observer;
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