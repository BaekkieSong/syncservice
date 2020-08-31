/* 라이브러리 */
const http = require('http'); // for HTTP Req/Res
let url = require('url');
const asynced = require('async');
const express = require('express');
var bodyParser = require('body-parser')
let zlib = require('zlib');
const assert = require('assert');

const path = require('path');
const { response } = require('express');
const workspaceDir = path.join(__dirname, '..');
/* 전역 proto 포함 */
let mt = require(path.join(workspaceDir, 'src/sync/model_type.js'));
let pbMessages = require(path.join(workspaceDir, 'google/protocol/sync_pb'));
let mydb = require(path.join(workspaceDir, 'src/storage/api'));
let sync = require(path.join(workspaceDir, 'src/sync/loopback_server.js'));

let pbClientCommand = new proto.sync_pb.ClientCommand();

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

function parseRequestURL(request) {  // parse ?[key=value]&[key2=value2]
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

//"https://clients4.google.com/chrome-sync/dev/command/
//?client=Chromium&client_id=1w%2B/uHkBePHPIbTXHTW/Mg%3D%3D"
app.post('/chrome-sync/dev/command/', (req, res) => {
  console.log('wow......')
  response.end('wow');
});

app.post('/', (request, response) => {
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
  let body = [];
  // .on API가 async이벤트이므로 필요한 작업은 내부에서 처리되야 함
  request.on('data', (chunk) => {
    body.push(chunk);
  });
  request.on('end', () => {
    let pbRequest = Buffer.concat(body); //make one large buffered
    if (request.get('content-encoding') == 'gzip') {
      pbRequest = zlib.gunzipSync(pbRequest, [zlib.Z_DEFAULT_COMPRESSION]);
      pbRequest =
        proto.sync_pb.ClientToServerMessage.deserializeBinary(pbRequest);
    } else if (request.get('content-type') == 'application/json') {
      pbRequest = JSON.parse(pbRequest.toString());
    } else if (request.get('content-type') == 'application/octet-stream') {
      pbRequest =
        proto.sync_pb.ClientToServerMessage.deserializeBinary(pbRequest);
    } else {
      console.error('\x1b[35m%s\x1b[0m', "Unexpected Content-Type Data.");
    }
    // console.log("Result Body:", pbRequest)

    // processDB(function (db) {
    //   //console.log(db);
    //   console.log('processDB end');
    //   closeDB();
    // });

    let pbResponse = new proto.sync_pb.ClientToServerResponse();
    /* input type:
      sync_pb::ClientToServerMessage,
      sync_pb::ClientToServerResponse,
      Json
    */
    const result = handle(pbRequest, pbResponse, parsedData);

    //response.status(200).set('Content-Type', 'text/plain').send('body datadsafsdfsdf');
    //response.setHeader('Content-Type', 'text/plain');//'application/octet-stream');
    //response.setHeader('Content-Length', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'.length);
    //response.writeHead(200);
    //response.send('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    //response.end('body');

    let resbody = makeResponseBody(pbResponse);
    resbody = zlib.gzipSync(resbody);

    response.setHeader('Content-Encoding', 'gzip');
    response.writeHead(200);
    response.end(resbody);//JSON.stringify(resbody));
    /* 디코딩 Usage */
    // let deserialize = zlib.gunzipSync(resbody);
    // deserialize =
    //   proto.sync_pb.ClientToServerResponse.deserializeBinary(deserialize);

    lastSetting();
    return 200;
  });
});

function handle(pbRequest, pbResponse, parsedData) {
  //console.log(request);
  const query = parsedData.query;
  const Contents = pbRequest.getMessageContents();

  /* wallet 전처리
  wallet은 internal대신 메인 서버에서 처리 
  internal은 progress tokens 구성에 대한 처리
  이를 방해하지 않기 위해 request에서 WalletProgressMarker 정보를 제거하여
  internal로 전달.
  response날리기전에 처리해서 다시 추가 */
  let walletMarker;
  if (pbRequest && pbRequest.hasGetUpdates() &&
    pbRequest.getGetUpdates().getFromProgressMarkerList().length != 0) {
    for (let index in pbRequest.getGetUpdates().getFromProgressMarkerList()) {
      if (mt.getModelTypeFromSpecificsFieldNumber(
        pbRequest.getGetUpdates().getFromProgressMarkerList()[index]
          .getDataTypeId()) == mt.ModelType.AUTOFILL_WALLET_DATA) {
        walletMarker =
          pbRequest.getGetUpdates().getFromProgressMarkerList()[index];
        pbRequest.getGetUpdates().getFromProgressMarkerList().splice(index, 1);
        console.log('\x1b[33m%s\x1b[0m', 'remove wallet marker:', walletMarker);
        break;
      }
    }
    console.log('\x1b[33m%s\x1b[0m', 'Can`t find wallet marker:', walletMarker);
  }

  const httpStatusCode = sync.loopbackServer.handleCommand(
    pbRequest, pbResponse, query);
  console.log('\x1b[33m%s\x1b[0m', 'Http Status Code:', httpStatusCode);

  /* wallet 후처리
  request에 wallet정보를 다시 추가하여 처리 후, response에 결과값 반영 */
  if (walletMarker) {
    pbRequest.getGetUpdates().addFromProgressMarkerList(walletMarker);
    console.log('\x1b[33m%s\x1b[0m', 'add wallet marker');
    if (httpStatusCode == 200) {
      handleWalletRequest(pbRequest, walletMarker, pbResponse);
    }
  }

  if (httpStatusCode == 200) {
    injectClientCommand(pbResponse);
  }

  console.log('success');
  //response.writeHead(200, {"Content-Type":"text/plain; charset=utf-8"});  // 얘네는 실제론 process 내에서 처리되야 함
  // response.writeHead(200, {"Content-Type":"application/protobuf; charset=utf-8"});  // 얘네는 실제론 process 내에서 처리되야 함
  return 200;
};

// input type: CToSMessage, DataTypeProgressMarker, raw_response
function handleWalletRequest(pbRequest, walletMarker, pbResponse) {
  if (pbRequest.getMessageContents() !=
    proto.sync_pb.ClientToServerMessage.Contents.GET_UPDATES) {
    return;
  };
  populateWalletResults(
    walletEntities = [], walletMarker, pbResponse.getGetUpdates());
  //response = res.toJSON();  // 이 코드 없어도 response에 값 적용됨.
};

// input type: vector<sync_pb.SyncEntity>, marker, sync_pb.GetUpdatesResponse
function populateWalletResults(walletEntities, walletMarker, pbGetUpdates) {
  verifyNoWalletDataProgressMarkerExists(pbGetUpdates);
  let marker = new proto.sync_pb.DataTypeProgressMarker();
  marker.setDataTypeId(sync.SyncTypeName.AUTOFILL_WALLET_DATA.id);
  pbGetUpdates.addNewProgressMarker(marker);
  console.log('getUpdates:', pbGetUpdates);
  // TODO: 실제 Entities에 대한 Wallet처리 로직 구현
};

function verifyNoWalletDataProgressMarkerExists(pbGetUpdates) {
  for (const marker of getUpdates.getNewProgressMarker()) {
    assert(marker.getDataTypeId() != sync.SyncTypeName.AUTOFILL_WALLET_DATA.id);
  }
};

function injectClientCommand(pbResponse) {
  if (pbResponse.getErrorCode() == proto.sync_pb.SyncEnums.ErrorType.SUCCESS) {
    // 따로 처리 안해도 response 파라미터에 clientCommand값 들어가는지 확인할 것...
    pbResponse.setClientCommand(pbClientCommand);
  }
}

function makeResponseBody(pbResponse) {
  pbResponse.setErrorCode(proto.sync_pb.SyncEnums.ErrorType.SUCCESS);
  pbResponse.setStoreBirthday(
    sync.loopbackServer.getStoreBirthday());
  let resbody = pbResponse.serializeBinary();
  return resbody;
}

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