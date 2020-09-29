
function setUpDB() {
    let request = indexedDB.open("ytUninterruptedDB", 2);

    request.onupgradeneeded = function (event) {
        let db = event.target.result;
        let objectStore = db.createObjectStore('functionalityStatus', {keyPath: "function"});
        objectStore.createIndex('replayButton', 'status', {unique: false});

        objectStore.add("replayButton", "true");
    }
}

