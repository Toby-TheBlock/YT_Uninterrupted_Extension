
function getDB() {
    return window.indexedDB.open("ytUninterruptedDB", 1);
}

function writeToDB(id, state) {
    return new Promise(
        function(resolve, reject) {
            let request = getDB();

            request.onupgradeneeded = function(event) {
                let db = event.target.result;
                db.createObjectStore("FunctionalityStatus", {keyPath: "id"});

                let transaction = event.target.transaction.objectStore("FunctionalityStatus");
                transaction.add({id: "replayButton", activated: "true"});
                transaction.add({id: "skipAd", activated: "true"});
                transaction.add({id: "speedupAutoplay", activated: "true"});
                transaction.add({id: "preventAutoplay", activated: "true"});
            }

            request.onerror = function() {
                reject(Error("Something went wrong under requesting DB."));
            }

            request.onsuccess = function(event) {
                let transaction = event.target.result.transaction("FunctionalityStatus", "readwrite").objectStore("FunctionalityStatus");
                transaction.put({id: id, activated: state});
            }
        }
    );
}

function getFromDB(id) {
    return new Promise(
        function(resolve, reject) {
            let request = getDB();

            request.onerror = function() {
                reject(Error("Something went wrong"));
            }

            request.onsuccess = function(event) {
                let transaction = event.target.result.transaction("FunctionalityStatus", "readwrite").objectStore("FunctionalityStatus");

                transaction.get(id).onsuccess = function(event) {
                    resolve(event.target.result.activated);
                }
            }
        }
    );
}

async function sendToDB(id, state) {
    await writeToDB(id, state);
}