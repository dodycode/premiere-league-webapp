function initDB() {
    let dbPromise = idb.open('premiere-league', 1, db => {
        if (!db.objectStoreNames.contains('favorites')) {
            let table = db.createObjectStore('favorites', { keyPath: 'teamId' });
        }
    });
    return dbPromise;
}

function getAllDataFromDB(key) {
    let dbPromise = initDB();
    let data = dbPromise.then(function(db) {
        var tx = db.transaction('favorites', 'readonly');
        var store = tx.objectStore('favorites');
        return store.getAll();
    }).then(function(items) {
        console.log('Data yang diambil: ');
        console.log(items);
        return items;
    }).catch(err => console.error(err));

    return data;
}

async function countDataInDB(key) {
    let dbPromise = initDB();
    let count = await dbPromise.then(function(db) {
            let tx = db.transaction('favorites', 'readonly');
            let store = tx.objectStore('favorites');
            return store.count(key);
        })
        .then(result => {
            return result;
        })
        .catch(err => console.err(err));

    return count;
}

function createDataToDB(val) {
    let dbPromise = initDB();
    dbPromise.then(function(db) {
        var tx = db.transaction('favorites', 'readwrite');
        var store = tx.objectStore('favorites');
        store.add(val);
        return tx.complete;
    }).then(function() {
        console.log('team added to fav.');
    }).catch(function(err) {
        console.error(err);
    })
}

function deleteDataFromDB(key) {
    let dbPromise = initDB();
    dbPromise.then(function(db) {
        var tx = db.transaction('favorites', 'readwrite');
        var store = tx.objectStore('favorites');
        store.delete(key);
        return tx.complete;
    }).then(function() {
        console.log('team deleted from fav.');
    }).catch(function(err) {
        console.error(err);
    })
}