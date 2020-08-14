const sqlite3 = require('sqlite3').verbose();
const async = require('async');

const path = require('path');
const workspaceDir = path.join(__dirname, '../..');
const querys = require(path.join(workspaceDir, 'src/storage/db/init_constants.js'));



let db;

// exports.dbInitSynced = function (callback) {
//   console.log('DB0');
//   db = new sqlite3.Database('./db/mydb.db', (err) => {
//     if (err) throw err;
//     console.log('DB1: Connected to the mydb database.');
//   });
//   callback(db);
// };
// exports.dbCreateSynced = function(db, callback) {
//   db.each(querys.create);
// };
// dbInitSynced(function(db) {
  
// });

function db_init(db_callback) {
  async.waterfall([
    function (callback) {
      console.log('DB0');
      db = new sqlite3.Database(path.join(workspaceDir, 'db/mydb.db'), (err) => {
        if (err) throw err;
        console.log('DB1: Connected to the mydb database.');
        callback(null, db);
        db_callback(db);
      });
    },
    function (db, callback) {
      //db 초기화
      db.serialize(() => {
        console.log('DB2: start');
        //console.log(querys.create);
        db.each(querys.create, (err) => {
          if (err) throw err;
        });
      });
      callback(null, 'DB2: success');
    }
  ], function (callback, msg) {
    if (msg != 'DB2: success') console.log('db initialize failed');
    console.log(`DB2: initialize success`);
  });
};

function db_release() {
  db.close((err) => {
    if (err) throw err;
    console.log('DB3: db close successfully.');
  });
}

function db_insert() {

}

exports.db_init = db_init;
exports.db_release = db_release;