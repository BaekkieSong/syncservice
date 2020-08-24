http = require('http');
const querystring = require('querystring');
const { URL } = require('url');
const { validateHeaderValue } = require('http');
let zlib = require('zlib');

const path = require('path');
const workspaceDir = path.join(__dirname, '..');
let sync_pb = require(
  path.join(workspaceDir, 'src/google/protobufjs/proto_process'));
let pb = new sync_pb();
let protojs = pb.getSyncProto();

// Write data to request body
let requestJSON = {
  invalidatorClientId: 'user@gmail.com',
  aa: '2222',
  share: "111111",
  messageContents: 2,
  storeBirthday: "d73d1631b1802438df3b0346cdbd8ba9704f5f12",
  getUpdates: {
    fromProgressMarker: [{ dataTypeId: 1 }]
  }
};
let requestMsg = protojs.root.lookupType('sync_pb.ClientToServerMessage');
let request = requestMsg.create(requestJSON);

// const options = new URL('http://127.0.0.1:1337');
const options = {
  hostname: '127.0.0.1',
  port: 1337,
  path: '/?a=3%20&b=path%2fone%2ftwo',  // == /?a=3 &b=path/one/two
  method: 'POST',
  headers: {
    //    'Accept': 'application/octet-stream',
    'Accept-Encoding': 'application/octet-stream',//['gzip', 'deflate'],
    'Content-Type': 'application/octet-stream',   // 'application/json',
    'Content-Encoding': 'application/octet-stream',

    //'Content-Type': 'application/protobuf',
    //'Content-Length': Buffer.byteLength(requestMsg.encode(requestJSON).finish())
  },
  //gzip: true,
}

const req = http.request(options, (res) => {  //res는 콜백인데... IncomingMessage네....
  // try {
  //   validateHeaderValue('content-type', undefined); //안되네 슈밤;;;
  // } catch (err) {
  //   console.error(err.message);
  // }
  //console.log(res);
  // console.log(`STATUS: ${res.statusCode}`);
  // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

  //res.setEncoding('utf8');
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  res.on('end', () => {
    console.log("Response: ", body);
    console.log('Response length:', body.length);
    console.log(Buffer.from(body, 'binary'));
    console.log(Buffer.from(body, 'binary').length);
    console.log('No more data in response.');
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

// console.log(requestMsg.encode(requestJSON).finish());
// console.log(requestMsg.decode(requestMsg.encode(requestJSON).finish()));
// console.log(requestJSON);
//req.write();  //얘는 서버에서 어케 보는거지...?

let buf = requestMsg.encode(requestJSON).finish();
console.log('old data encoding:', buf)
console.log(typeof (buf));
console.log('old length', buf.length)
req.end(buf);
// req.end(JSON.stringify(requestJSON));

console.log("Is Buffer?", Buffer.isBuffer(buf));
//console.log(buf.toString())

/*
var messages = require(path.join(workspaceDir, 'google/protocol/sync_pb'));
var message = new proto.sync_pb.ClientToServerMessage();
message.setShare('55555');
message.setMessageContents(proto.sync_pb.ClientToServerMessage.Contents.GET_UPDATES);
message.getStoreBirthday("d73d1631b1802438df3b0346cdbd8ba9704f5f12");
var updates = new messages.GetUpdatesMessage();
var marker = new messages.DataTypeProgressMarker();
marker.setDataTypeId(1);
marker.setToken('token value');
updates.addFromProgressMarker(marker);
message.setGetUpdates(updates);

let data = message.serializeBinary(); //Uint8Array (== object 타입([]리스트 형식)) 
//console.log(data);  // == object
console.log('new data encoding to string:', data.toString()); // 리스트값 나열
console.log(Buffer.from(data)); //각 리스트 값이 16진법으로 변경됨
console.log(typeof(data));  // == object
console.log('length:', data.byteLength)
//req.end(Buffer.from(data)); // 
//req.end(new Buffer(data, 'binary'));
console.log('Proto Message:', message.toObject());
req.end(JSON.stringify(message.toObject()));
*/

zlib.gzip(buf, (err, buffer) => {
  console.log('gzipdata:', buffer);
  console.log('gziplength:', buffer.length);
  zlib.gunzip(buffer, (err, buf) => {
    console.log('gunzipdata:', buf);
    console.log('gunzipdatalength:', buf.length);
    //let db = proto.sync_pb.ClientToServerMessage.deserializeBinary(buf);
    //console.log(db);
  })
  let data = Buffer.from(buffer);
  console.log('gzipnew buffer', data);
  console.log('gziplength2', data.length);
  //req.end(data)
  // zlib.gunzip(buffer, (err, buffer) => {
  //   console.log(buffer);
  //   console.log(requestMsg.decode(buffer));
  // })
  //  req.end(buffer);
});
//req.end(buf);//buf.toString());
//req.end(String(requestJSON));
// req.end(Buffer.from(requestMsg.encode(requestJSON).finish()));//requestMsg.encode(requestJSON).finish()));
