var sync_pb = require('./proto_process.js');
var pb = new sync_pb();
var func = function(callback) {
  callback.processAsyncProto();
  console.log("start asynced synced");
};
//func(pb);

var proto = pb.getSyncProto();
// console.log("msg: ", proto);
// let sync_msg = proto.root.lookupType('sync_pb.GetUpdatesMessage');
// var fields = {
//   from_timestamp: 1111,
//   fetch_folders: true,
// }
// var errMsg = sync_msg.verify(fields);
// if (errMsg)
//   throw Error(errMsg);
// console.log(fields);
// var proto_msg = sync_msg.create(fields);
// console.log(proto_msg);

let entity_msg = proto.root.lookup('sync_pb.EntitySpecifics');
console.log(entity_msg.filename);
console.log(entity_msg.get('encrypted').name);
if (entity_msg.get('encrypted')) {  // optional로, 아직 값 세팅을 안했지만 get으로 나옴
  console.log('has encrypted');
};
let created_msg = entity_msg.create({ encrypted2: {}});
console.log(created_msg);

let entity_msg_type = proto.root.lookupType('sync_pb.EntitySpecifics');
console.log(entity_msg_type.get('encrypted').name);
if (entity_msg_type.get('encrypted')) {  // optional로, 아직 값 세팅을 안했지만 get으로 나옴
  console.log('has encrypted');
  //if (entity_msg_type.verify())
};
let fields = {
  'encrypted': {},
}
var errMsg = entity_msg_type.verify(fields);
if (errMsg) {
  console.log(errMsg);
}
//console.log(entity_msg_type.toJSON());
console.log(entity_msg_type.fieldsArray.length );
let maped = entity_msg_type.toJSON().fields;
console.log(maped);