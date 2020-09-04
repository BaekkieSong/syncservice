/* global proto */
const http = require("http");
// const querystring = require("querystring");
require("url");
let zlib = require("zlib");

const path = require("path");
const workspaceDir = path.join(__dirname, "..");
let mt = require(path.join(workspaceDir, "src/sync/base/model_type.js"));
require(path.join(workspaceDir, "src/google/protocol/sync_pb"));

let pbMessage = new proto.sync_pb.ClientToServerMessage();
pbMessage.setInvalidatorClientId("user@gmail.com");
pbMessage.setShare("111111");
pbMessage.setMessageContents(
  proto.sync_pb.ClientToServerMessage.Contents.GET_UPDATES
);
pbMessage.setStoreBirthday("d73d1631b1802438df3b0346cdbd8ba9704f5f12");
pbMessage.setGetUpdates(new proto.sync_pb.GetUpdatesMessage());
pbMessage.getGetUpdates().setCreateMobileBookmarksFolder(true);

let marker = new proto.sync_pb.DataTypeProgressMarker();
marker.setDataTypeId(
  mt.getSpecificsFieldNumberFromModelType(mt.ModelType.BOOKMARKS)
);
marker.setToken("77777"); //Buffer.from("77777"));
pbMessage.getGetUpdates().addFromProgressMarker(marker);

let marker2 = new proto.sync_pb.DataTypeProgressMarker();
marker2.setDataTypeId(
  mt.getSpecificsFieldNumberFromModelType(mt.ModelType.PREFERENCES)
);
marker2.setToken(Buffer.from("88888"));
pbMessage.getGetUpdates().addFromProgressMarker(marker2);
// console.log(pbMessage.getGetUpdates().getFromProgressMarkerList())

pbMessage = pbMessage.serializeBinary();
pbMessage = zlib.gzipSync(pbMessage);

// const options = new URL('http://127.0.0.1:1337');
const options = {
  hostname: "127.0.0.1",
  port: 1337,
  path: "/?a=3%20&b=path%2fone%2ftwo", // == /?a=3 &b=path/one/two
  method: "POST",
  headers: {
    Accept: "application/octet-stream",
    "Accept-Encoding": "application/octet-stream", //['gzip', 'deflate'],
    "Content-Type": "application/octet-stream", // 'application/json',
    "Content-Encoding": "gzip", //'application/octet-stream',
  },
};

//res는 콜백인데... IncomingMessage임...
const req = http.request(options, (response) => {
  let body = [];
  // .on API가 async이벤트이므로 필요한 작업은 내부에서 처리되야 함
  response.on("data", (chunk) => {
    body.push(chunk);
  });
  response.on("end", () => {
    console.log("\x1b[33m%s\x1b[0m", "Response header:\n", response.headers);
    // console.log(response.headers['content-encoding']);  // == gzip
    let pbResponse = Buffer.concat(body); //make one large buffered
    pbResponse = zlib.gunzipSync(pbResponse, [zlib.Z_DEFAULT_COMPRESSION]);
    pbResponse = proto.sync_pb.ClientToServerResponse.deserializeBinary(
      pbResponse
    );
    console.log("\x1b[33m%s\x1b[0m", "Response body:\n", pbResponse.toObject());
  });
});

req.on("error", (e) => {
  console.error(`problem with request: ${e.message}`);
});

/* For Google-Protobuf Test */
req.end(pbMessage);
