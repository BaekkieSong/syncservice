/* 라이브러리 */
const http = require('http'); // for HTTP Req/Res
let url = require('url');
const asynced = require('async');
const express = require('express');
var bodyParser = require('body-parser')
var rawParser = bodyParser.json();
let zlib = require('zlib');
const assert = require('assert');

const path = require('path');
const { response } = require('express');
const workspaceDir = path.join(__dirname, '..');
//var messages = require(path.join(workspaceDir, 'google/protocol/sync_pb'));  // google-protobuf
let mydb = require(path.join(workspaceDir, 'src/storage/api'));
let sync_pb = require(path.join(workspaceDir, 'src/google/protobufjs/proto_process'));  // protobufjs
let pb = new sync_pb();
let protojs = pb.getSyncProto();
let sync = require(path.join(workspaceDir, 'src/sync/chromiumsync'));


let clientCommandMsg = protojs.root.lookupType('ClientCommand');
let clientCommand = clientCommandMsg.create();

const app = express();
const port = process.env.PORT || 1337;

/* 서버 초기화 */
function initSetting(request, response) {
  console.log('initialize settings');
};

function isFaviconURL(request, response) {
  if (request.url == '/favicon.ico') {
    return true;
  }
  return false;
};

function parseRequestURL(request) { // parse ?[key=value]&[key2=value2]
  let parsedData = url.parse(request.url, true);
  //  console.log(parsedData.auth); //null
  //  console.log(parsedData.host); //null
  //  console.log("path: " +  parsedData.pathname);
  console.log(parsedData.query);
  return parsedData;
};

function lastSetting() {
  console.log('last settings');
}

// /* 서버 ON */
let server = http.createServer(app);
server.listen(port);

app.get('/', (request, response) => {
  let parsedData = parseRequestURL(request);
  response.writeHead(200);
  response.end('aaaa');
})

//"https://clients4.google.com/chrome-sync/dev/command/?client=Chromium&client_id=1w%2B/uHkBePHPIbTXHTW/Mg%3D%3D"
app.post('/chrome-sync/dev/command/', (req, res) => {
  console.log('wow......')
  response.end('wow');
});

app.post('/', rawParser, (request, response) => {
  console.log('Undefined POST:', request.body);

  if (isFaviconURL(request, response)) {
    response.writeHead(404);
    response.end();
    return;
  }

  initSetting(request, response);

  /* parse query */
  let parsedData = parseRequestURL(request);
  console.log('parsedData:', parsedData.query);

  /* parse body */
  let body = '';
  request.on('data', chunk => {
    body += chunk;//.toString(); // convert Buffer to string
  });
  request.on('end', () => { // 얘 자체가 비동기 이벤트기 때문에 내부에서 처리되어야 함
    console.log("request body:", body);
    console.log('request length:', body.length);
    if (request.get('content-encoding') == 'gzip') {
      if (typeof (body) == 'string') {
        body = Buffer.from(body);
      }
      body = uncompressRequestBody(body, request);  // request Content-Encoding: 'gzip'일 경우
    }

    let bodyJson = '';
    if (request.get('content-type') == 'application/octet-stream') { //== 'plain/text') { //TODO: `== 'application/octet-stream') {`로 변경 필요
      if (typeof (body) == 'string') {
        body = Buffer.from(body);
      }
      let csMessageMsg = protojs.root.lookupType('sync_pb.ClientToServerMessage');
      let bodyData = csMessageMsg.decode(body);
      //let bodyData = decodeRequestBody(body);  // request Content-Type: 'application/octet-stream'일 경우
      bodyJson = bodyData.toJSON();
    } else {
      console.log('content-type:', request.get('content-type'));
      bodyJson = JSON.parse(body);  // Content-Type: 'application/json' or 'plain/text'
    }
    console.log('\x1b[33m%s\x1b[0m', 'parse to json:', bodyJson);

    // processDB(function (db) {
    //   //console.log(db);
    //   console.log('processDB end');
    //   closeDB();
    // });

    const result = handle(bodyJson, response, parsedData);

    //response.status(200).set('Content-Type', 'text/plain').send('body datadsafsdfsdf');
    //response.setHeader('Content-Type', 'text/plain');//'application/octet-stream');
    //response.setHeader('Content-Length', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'.length);
    //response.writeHead(200);
    //response.send('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    //response.end('body');

    let csMessageMsg = protojs.root.lookupType('sync_pb.ClientToServerMessage');
    let csMessageData = csMessageMsg.create(bodyJson);
    //let pbMessage = convertToGoogleProtobufMessage(csMessageData);
    const resbody = makeResponseBody();

    response.end(resbody);//JSON.stringify(resbody));

    lastSetting();
    return 200;
  });
});

function handle(request, response, parsedData) {
  //console.log(request);
  const query = parsedData.query;

  // TODO: csMessageMsg.MergeFromString(request); //request에서 protobuf를 읽어 csMessageMsg에 Set
  // 일단 encoding된 버퍼 데이터 형식으로 온다고 가정함
  let csMessageMsg = protojs.root.lookupType('sync_pb.ClientToServerMessage');
  const Contents = csMessageMsg.getEnum('Contents');
  let csMessageData = csMessageMsg.create(request);
  console.log('\x1b[33m%s\x1b[0m', 'created csMessage:', csMessageData);
  const contents = csMessageData.messageContents;

  /* wallet 전처리
  wallet은 internal대신 메인 서버에서 처리 
  internal은 progress tokens 구성에 대한 처리
  이를 방해하지 않기 위해 request에서 WalletProgressMarker 정보를 제거하여 internal로 전달. 
  response날리기전에 처리해서 다시 추가 */
  let walletMarker;
  if (csMessageData && csMessageData.getUpdates && csMessageData.getUpdates.fromProgressMarker) {
    for (let index in csMessageData.getUpdates.fromProgressMarker) {
      if (csMessageData.getUpdates.fromProgressMarker[index].dataTypeId == sync.SyncTypeName.AUTOFILL_WALLET_DATA.id) {
        walletMarker = csMessageData.getUpdates.fromProgressMarker[index];
        csMessageData.getUpdates.fromProgressMarker.pop(index);
        console.log('\x1b[33m%s\x1b[0m', 'remove wallet marker:', walletMarker);
        break;
      }
    }
    console.log('\x1b[33m%s\x1b[0m', 'Can`t find wallet marker:', walletMarker);
  }
  //let progressMarkerMsg = csMessageMsg.lookupType('')

  const httpStatusCode = sync.internalServer.handleCommand(csMessageData, query);
  console.log('\x1b[33m%s\x1b[0m', 'Http Status Code:', httpStatusCode);

  /* wallet 후처리 
  request에 wallet정보를 다시 추가하여 처리 후, response에 결과값 반영 */
  if (walletMarker) {
    csMessageData.getUpdates.fromProgressMarker.push(walletMarker);
    console.log('\x1b[33m%s\x1b[0m', 'add wallet marker');
    if (httpStatusCode == 200) {
      handleWalletRequest(csMessageData, walletMarker, response);
    }
  }

  if (httpStatusCode == 200) {
    injectClientCommand(response);
  }
  console.log('success');
  //response.writeHead(200, {"Content-Type":"text/plain; charset=utf-8"});  // 얘네는 실제론 process 내에서 처리되야 함
  // response.writeHead(200, {"Content-Type":"application/protobuf; charset=utf-8"});  // 얘네는 실제론 process 내에서 처리되야 함
  return 200;
};

function handleWalletRequest(req, walletMarker, response) {  // CToSMessage, DataTypeProgressMarker, raw_response
  if (req.messageContents != Contents.GET_UPDATES) {
    return;
  };
  let csResponseMsg = protojs.root.lookupType('sync_pb.ClientToServerResponse');
  res = csResponseMsg.create(response);
  populateWalletResults(walletEntities = [], walletMarker, res.getUpdates);
  //response = res.toJSON();  // 이 코드 없어도 response에 값 적용됨.
};

function populateWalletResults(walletEntities, walletMarker, getUpdates) {  //vector<sync_pb.SyncEntity>, DataTypeProgressMarker, sync_pb.GetUpdatesResponse
  verifyNoWalletDataProgressMarkerExists(getUpdates);
  let marker = protojs.root.lookupType('DataTypeProgressMarker').create();
  marker.dataTypeId = sync.SyncTypeName.AUTOFILL_WALLET_DATA.id;
  getUpdates.newProgressMarker.push(marker);
  console.log('getUpdates:', getUpdates);
  // TODO: 실제 Entities에 대한 Wallet처리 로직 구현
};

function verifyNoWalletDataProgressMarkerExists(getUpdates) {
  for (const marker of getUpdates.newProgressMarker) {
    assert(marker.dataTypeId != sync.SyncTypeName.AUTOFILL_WALLET_DATA.id);
  }
};

function injectClientCommand(response) {
  let csResponseMsg = protojs.root.lookupType('sync_pb.ClientToServerResponse');
  const SyncEnums = csResponseMsg.lookup('SyncEnums');
  const ErrorType = SyncEnums.getEnum('ErrorType');
  res = csResponseMsg.create(response);
  if (res.errorCode == ErrorType.SUCCESS) {  // 따로 처리 안해도 response 파라미터에 clientCommand값 들어감. 확인할 것...
    res.clientCommand = clientCommand;
  }
}

/* protobufjs */
function getSyncedProtobufMessage() {
  let pb = new sync_pb();
  let protojs = pb.getSyncProto();  //sync.proto파일 Load
  if (true) {
    sync_msg = protojs.root.lookupType('sync_pb.GetUpdatesMessage');  //sync.proto에 정의된 메시지 중에 요청에 맞는 메시지 Read
  } else {
    console.error('not reached');
  }
  //console.log('sync_msg: ', sync_msg);
  return sync_msg;
};

/* google-protobuf */
/*
function convertToGoogleProtobufMessage(bodydata) {
  let pbMessage = new messages.ClientToServerMessage();
  pbMessage.setProtocolVersion(33);
  //console.log('object body:', pbMessage.toObject())
  //console.log('json:', bodydata.toJSON())
  for (let key in bodydata.toJSON()) {
    switch (key) {
      case 'share': pbMessage.setShare(bodydata[key]);
        break;
      case 'protocolVersion': pbMessage.setProtocolVersion(bodydata[key]);
        break;
      case 'debugInfo':
        let debugInfo = new messages.DebugInfo();
        if (bodydata[key].hasOwnProperty('events')) {
          for (let i of bodydata[key]['events']) {
            let debugEventInfo = new messages.DebugEventInfo();
            debugEventInfo.setSingletonEvent(bodydata[key].hasOwnProperty('events') && bodydata[key]['events'].hasOwnProperty('singletonEvent') ? bodydata[key]['events']['singletonEvent'] : undefined)
            debugInfo.addEvents(debugEventInfo);
          }
        }
        debugInfo.setCryptographerReady(bodydata[key].hasOwnProperty('cryptographerReady') ? bodydata[key]['cryptographerReady'] : undefined);
        pbMessage.setDebugInfo(debugInfo);
      default:
        break;
    }
  }
  console.log('storeBirthday:', bodydata['storeBirthday']);
  pbMessage.setStoreBirthday(bodydata.hasOwnProperty('storeBirthday') ? bodydata['storeBirthday'] : undefined);
  //console.log(pbMessage.toObject())
  //console.log(JSON.stringify(csMessageMsg.create(pbMessage.toObject()).toJSON()));
  if (pbMessage.hasShare()) {
    console.log('share:', pbMessage.getShare());
  } else {
    console.log('no share:', pbMessage.getShare());
  }
  if (pbMessage.hasProtocolVersion()) {
    console.log('version:', pbMessage.getProtocolVersion());
  }
  if (pbMessage.hasMessageContents()) {
    console.log('messageContents:', pbMessage.getMessageContents());
  }
  if (pbMessage.hasGetUpdates()) {
    console.log('getUpdates:', pbMessage.getGetUpdates());
    if (pbMessage.getGetUpdates().hasFetchFolders()) {
      console.log('fetchFolders:', pbMessage.getFetchFolders());
    }
  }
  return pbMessage;
}
*/

function makeResponseBody() {
  /*
  let pbResponse = new messages.ClientToServerResponse();
  pbResponse.setErrorCode(proto.sync_pb.SyncEnums.ErrorType.SUCCESS);
  pbResponse.setStoreBirthday(sync.internalServer.accountModel.getStoreBirthday());
  let resbody = csResponseMsg.create(pbResponse.toObject());
  */
  let csResponseMsg = protojs.root.lookupType('sync_pb.ClientToServerResponse');
  let csResponseData = csResponseMsg.create();
  csResponseData.storeBirthday = sync.internalServer.accountModel.getStoreBirthday();
  let resbody = csResponseMsg.encode(csResponseData).finish();
  return resbody;
}


function decodeRequestBody(body) {
  console.log('\x1b[33m%s\x1b[0m', '\n\nDecode request body\n');
  // body = new Buffer(body, 'utf-8');
  if (typeof (body) == 'string') {
    body = Buffer.from(body, 'binary');
  };
  let b = new Uint8Array(body.length);
  for (i = 0; i < body.length; i++) {
    b[i] = body[i];
  }
  //body = [10,5,53,53,53,53,53,24,2,42,13,50,11,8,1,18,7,182,137,30,158,246,165,185];
  console.log('arraybody:', b);
  console.log('arraybodylength:', b.length)
  console.log("body:", b);

  //let bodydata = proto.sync_pb.ClientToServerMessage.deserializeBinary(b);
  // console.log("bodydata storebirthday:", bodydata.getStoreBirthday());
  // console.log("bodydata progressMarker:", bodydata.getGetUpdates().getFromProgressMarkerList());
  let csMessageMsg = protojs.root.lookupType('sync_pb.ClientToServerMessage');
  let bodyData = csMessageMsg.decode(b);
  console.log("bodydata:", bodyData);
  return bodyData;
  //response.status(200).set('Content-Type', 'text/plain').send('body datadsafsdfsdf');
}

/* gzip */
function uncompressRequestBody(body, request) {
  if (request.headers['content-encoding'] == 'gzip') {
    console.log('start gunzip...')
    console.log('type:', typeof (body))
    let rawdata;
    // zlib.inflate(body, (err, data) => {
    //   console.log(err);
    //   console.log('inflate');
    //   console.log(data);
    //   let bodydata = proto.sync_pb.ClientToServerMessage.deserializeBinary(data);
    //   console.log("inflatedata:", bodydata);
    // })
    // zlib.inflateRaw(body, (err, data) => {
    //   console.log(err);
    //   console.log('inflateRaw');
    //   console.log(data);
    //   let bodydata = proto.sync_pb.ClientToServerMessage.deserializeBinary(data);
    //   console.log("inflatedata:", bodydata);
    // })
    if (typeof (body) == 'string') {
      console.log('\x1b[33m%s\x1b[0m', '\n\nMain Internal Test111111\n');
      rawdata = Buffer.from(body);
    } else {
      rawdata = body;
    }
    let data = zlib.gunzipSync(rawdata, [zlib.Z_DEFAULT_COMPRESSION]);
    console.log('body:', data);
    let bodydata = proto.sync_pb.ClientToServerMessage.deserializeBinary(data);
    // let csMessageMsg = protojs.root.lookupType('sync_pb.ClientToServerMessage');
    // let bodydata = csMessageMsg.decode(data);
    console.log("bodyeeeddd:", bodydata);
    return bodydata;

    zlib.gunzip(rawdata, (err, data) => {
      console.log(err);
      console.log('unzipped')
      console.log(data);
      console.log(typeof (data));
      if (typeof (data) == 'Buffer' || 'object') {
        console.log('\x1b[33m%s\x1b[0m', '\n\nMain Internal Server Test11111\n');
        console.log("body:", data);
        let bodydata = proto.sync_pb.ClientToServerMessage.deserializeBinary(data);
        // let csMessageMsg = protojs.root.lookupType('sync_pb.ClientToServerMessage');
        // let bodydata = csMessageMsg.decode(data);
        console.log("bodyeeeddd:", bodydata);
        body = bodydata;//csMessageMsg.encode(bodydata).finish();
        //response.end(csMessageMsg.encode(body).finish());
      }
    });
  };
};

/* DB */
function old_processDB() {
  console.log('db1: start');
  asynced.waterfall([
    function (callback) {
      console.log('db2: processing');
      mydb.db_init();
      callback(null, 'db3: end');
    }
  ], function (callback, msg) {
    console.log(msg);
  });
  //mydb.db_init(); // 특정 계정 요청이 있을 때 db를 오픈
  console.log('db4: initialized complete');
  setTimeout(closeDB, 3000, [1, 2, 3]);
}

function closeDB(args) {
  mydb.db_release();
  console.log('db5: released');
  //console.log(args);
}

processDB = function (callback) {
  mydb.db_init(callback);
};