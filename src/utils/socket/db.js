var request = window.indexedDB.open('sino', 2);
request.onsuccess = function (event) {
    window.db = request.result;
    console.log('数据库打开成功');
};

request.onupgradeneeded = function(event) {
    window.db = event.target.result;
    var objectStore = db.createObjectStore(
        'message',
        { autoIncrement: true }
    );
}

function appendMsg(msg) {
    if(!window.db) return;
    let time = new Date().toLocaleString();
    var request = window.db.transaction(['message'], 'readwrite').objectStore('message').add({...msg, time: time});
    request.onsuccess = function (event) {
        console.log('数据写入成功');
    };
}

export default {
    appendMsg
}

