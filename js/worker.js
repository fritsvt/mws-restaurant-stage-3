importScripts('idb.js');

onmessage = (e) => {

    let objects = e.data.objects;
    let api = e.data.api

    let dbPromise = idb.open(api, 1, (upgradeDB) => {
        let restaurantStore = upgradeDB.createObjectStore(api, {keyPath: 'id'}); // Value: Key
    });

    dbPromise.then( (db) => {
        let tx = db.transaction(api, 'readwrite');
        let store = tx.objectStore(api);

        objects.forEach( object => {
            store.get(object.id).then( idbObject => {
                if(JSON.stringify(object) !== JSON.stringify(idbObject)) {
                    store.put(object)
                }
            });
        });
    });

    postMessage(`Worker IDB: ${api} checked`);
}
