/* © Copyright 2021, Tobias Günther, All rights reserved. */

/**
 * Gets a short version of the page-URL which doesn't include query-parameters and such,
 * as they sometimes change while a video is playing which cause trouble in regards to resetting things.
 * @returns {string}
 */
function getVideoURL() {
    return window.location.href.substring(0,50);
}


/**
 * Shorthand function for creating a new DOM element.
 * @param elementType - string which defines the elements type
 * @param elementAttribute - list of attributes which are to be assign to the element.
 * @param value - list over the value to be assigned to the attributes.
 * @returns {HTMLElement}
 */
function createDOMElement(elementType, elementAttribute, value) {
    let element = document.createElement("" + elementType + "");
    elementAttribute.forEach(function(currentVal, index) {
        element.setAttribute(currentVal, value[index]);
    });

    return element;
}


/**
 * Shorthand function for retrieving a DOM element.
 * @param retrievalMethod - string which defines the elements type who's to be retrieved.
 * @param identifier - the id, class- or tag-name of the element.
 * @param index - index of the HTML-collection element which is to be retrieved.
 * @returns {Element}
 */
function getDOMElement(retrievalMethod, identifier, index = 0) {
    let object;
    switch (retrievalMethod) {
        case "id":
            object = document.getElementById("" + identifier + "");
            break;
        case "class":
            object = document.getElementsByClassName(identifier)[index];
            break;
        case "tag":
            object = document.getElementsByTagName(identifier)[index];
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
 * Updates a localStorage value, if the value is either true/false the opposite value is being stored.
 * @param storageIndex
 * @param value
 */
function setLocalStorageValue(storageIndex, value) {
    return new Promise(
        function(resolve) {
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
            resolve();
        }
    );
}


/**
 * Increases the counter value stored in a localStorage by one,
 * as long as the localStorage hasn't been locked to incrementation.
 * @returns {boolean}
 */
function reportError() {
    let currentErrors = parseInt(localStorage.getItem("occurredErrors"));
    if (currentErrors >= 0 && currentErrors <= 99) {
        let occurredErrors = parseInt(localStorage.getItem("occurredErrors")) + 1;
        localStorage.setItem("occurredErrors", occurredErrors.toString());
        return true;
    }
    return false;
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


/**
 * Checks if the current page URL is different from the last time this function was called.
 * This function works differently based on its caller. If called from the extension code the try part will run.
 * As the extension stores the previous page URL in the local variable "oldURL". This variable is obviously not
 * available for the injected DOM code, and therefore the catch block will run in that case.
 * Here the previous page URL is stored in a localStorage entry.
 * @returns {boolean}
 */
function checkURLForChange() {
    let currentURL = getVideoURL();

    try {
        if (currentURL !== oldURL) {
            oldURL = currentURL;
            return true;
        }

        return false;

    } catch {
        try {
            let currentTabID = getDOMElement("id", "TabID").innerHTML;
            let oldURL = localStorage.getItem("oldURLForTab" + currentTabID)
            if (currentURL !== oldURL) {
                deleteLocalStorage(oldURL);
                localStorage.setItem("oldURLForTab" + currentTabID, currentURL);
                return true;
            }

            return false;

        } catch {
            return false;
        }
    }
}


function createMutator(callbackFunction, objectToObserve) {
    const observer = new MutationObserver(callbackFunction);
    observer.observe(objectToObserve, {attributes: true, childList: true});
    return observer;
}