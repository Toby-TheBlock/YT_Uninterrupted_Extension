
/**
 * Creates an objectstore and filles it with default data.
 * @param event
 */
function configureDB(event) {
    let db = event.target.result;
    db.createObjectStore("FunctionalityStatus", {keyPath: "id"});

    let transaction = event.target.transaction.objectStore("FunctionalityStatus");
    transaction.add({id: "replayButton", activated: "true"});
    transaction.add({id: "skipAds", activated: "true"});
    transaction.add({id: "speedupAutoplay", activated: "true"});
    transaction.add({id: "preventAutostop", activated: "true"});
    transaction.add({id: "mainDOM", activated: "true"});
}


/**
 * Adds a new DB entry.
 * @param id - the identifier for the current entry.
 * @param state - true/false based on if the current entry is supposed to be active functionality.
 * @returns {Promise<unknown>}
 */
function writeToDB(id, state) {
    return new Promise(
        function(resolve, reject) {
            let request = getDB();

            request.onupgradeneeded = function(event) {
                configureDB(event);
            };

            request.onerror = function() {
                reject();
            }

            request.onsuccess = function(event) {
                let transaction = event.target.result.transaction("FunctionalityStatus", "readwrite").objectStore("FunctionalityStatus");
                transaction.put({id: id, activated: state});
            }
        }
    );
}


/**
 * Gets the data from a DB entry.
 * @param id - the identifier of the DB entry which is to be fetched.
 * @returns {Promise<unknown>}
 */
function getFromDB(id) {
    return new Promise(
        function(resolve, reject) {
            let request = getDB();

            request.onupgradeneeded = function(event) {
                configureDB(event);
            };

            request.onerror = function() {
                reject();
            }

            request.onsuccess = function(event) {
                let transaction = event.target.result.transaction(["FunctionalityStatus"], "readwrite").objectStore("FunctionalityStatus");
                transaction.get(id).onsuccess = function(event) {
                    resolve(event.target.result.activated);
                }
            }
        }
    );
}


function getDB() {
    return window.indexedDB.open("ytUninterruptedDB", 1);
}


async function sendToDB(id, state) {
    await writeToDB(id, state);
}
