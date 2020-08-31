const { assert } = require('console');
const path = require('path');
const workspaceDir = path.join(__dirname, '../../..');
var messages = require(path.join(workspaceDir, 'src/google/protocol/sync_pb'));

let requestJSON = {
  invalidatorClientId: 'user@gmail.com',
  aa: '2222',
  share: "111111",
  messageContents: 1,
  storeBirthday: "d73d1631b1802438df3b0346cdbd8ba9704f5f12",
  getUpdates: {
    fromProgressMarker: [{ dataTypeId: 1 }]
  }
};

var message = new messages.ClientToServerMessage();
var updates = new messages.GetUpdatesMessage();
var marker = new messages.DataTypeProgressMarker();
var marker2 = new messages.DataTypeProgressMarker();

marker.setDataTypeId(1);
marker.setToken('token value');
console.log(marker.toObject());
updates.addFromProgressMarker(marker);
marker2.setDataTypeId(2);
updates.addFromProgressMarker(marker2);

message.setShare('55555');
message.setGetUpdates(updates);
console.log(message);
console.log(message.toObject());
console.log('share:', message.getShare());
console.log('getupdates:', message.getGetUpdates());
console.log('markerlist:', message.getGetUpdates().getFromProgressMarkerList());
console.log('marker0:',
  message.getGetUpdates().getFromProgressMarkerList()[0].toObject());
message.getGetUpdates().getFromProgressMarkerList().splice(1, 2);
console.log('removedMarkerlist:',
  message.getGetUpdates().getFromProgressMarkerList());
message.setMessageContents(
  proto.sync_pb.ClientToServerMessage.Contents.GET_UPDATES);
console.log('messageContents:', message.getMessageContents());

let sb = message.serializeBinary();
//console.log(sb);
let dsb = proto.sync_pb.ClientToServerMessage.deserializeBinary(sb);
console.log(dsb.getGetUpdates().getFromProgressMarkerList());
console.log(typeof (sb));
let b = dsb.toString();
b = dsb.toObject();
console.log(b);

let pbAppSpec = new proto.sync_pb.AppSpecifics();

let pbResponse = new proto.sync_pb.ClientToServerResponse();
pbResponse.setErrorCode(proto.sync_pb.SyncEnums.ErrorType.SUCCESS);
assert(pbResponse.getErrorCode() == proto.sync_pb.SyncEnums.ErrorType.SUCCESS);