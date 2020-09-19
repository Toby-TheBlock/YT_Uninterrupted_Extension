
function setUpDB() {
    var database = idb.open("ytUninterruptedDB", 1);

    if (!upgradeDb.objectStoreNames.contains('functionalityStatus')) {
        upgradeDb.createObjectStore('functionalityStatus');
    }
}


