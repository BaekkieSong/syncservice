const assert = require('assert');

let test = require('./chromiumsync.js');
let sync_pb = require('./google/protobufjs/proto_process');
let pb = new sync_pb();
let proto = pb.getSyncProto();
//
//console.log(test.AllTypesObject);

/* 테스트: Constants */
function constantsTest() {
  console.log('\x1b[33m%s\x1b[0m', '\n\nContants Test\n');

  console.log('\x1b[36m%s\x1b[0m', 'AllTypesObject');
  let dataTypeCount = 0;
  for (let id in test.AllTypesObject) {
    //console.log(`id: ${id}, value: ${test.AllTypesObject[id]}`);
    dataTypeCount++;
    assert(dataTypeCount < 38); //총 37개
  };
  let syncTypeCount = 0;
  for (let id in test.SyncTypeName) {
    syncTypeCount++;
    assert(syncTypeCount < 37); //총 36개 (TOP_LEVEL 제외됨)
  }

  console.log('\x1b[36m%s\x1b[0m', 'Match Properties');
  for (var x in test.AllTypesObject) {
    let flag = false;
    for (var y in test.SyncTypeName) {
      if (x == y) {
        assert(x == y);
        flag = true;
      } else if (x == 'TOP_LEVEL_FOLDER') {
        assert(x == 'TOP_LEVEL_FOLDER');
        flag = true;
      }
    }
    if (flag == true) {  // next
      flag = false;
    } else {
      console.error('안같네');  // 테스트 실패
      return 0;
    }
    if (x == 'WIFI_CREDENTIAL') console.log("test complete");  // 테스트 성공
  };
};

/* 테스트: 공용 API */
function commonAPITest() {
  console.log('\x1b[33m%s\x1b[0m', '\n\nCommon API Test\n');

  console.log('\x1b[36m%s\x1b[0m', 'Generate New Keysotre Key');
  const storeKey = test.makeNewKeystoreKey()
  assert(storeKey.length == 16);
  console.log(`genetate keystore key test: ${storeKey}`);

  console.log('\x1b[36m%s\x1b[0m', 'DataTypeId to/from SyncType');
  let syncType = test.protocolDataTypeIdToSyncType(48364);
  assert(syncType == 'APP');
  assert(test.syncTypeToProtocolDataTypeId(syncType) == 48364);
  let errTypes = [test.AllTypesObject.APPS, test.AllTypesObject.APP_LIST, test.AllTypesObject.APP_SETTINGS];
  console.log('from:', errTypes);
  let dataTypeIds = errTypes.map((cur) => test.syncTypeToProtocolDataTypeId(cur));
  console.log('to:', dataTypeIds);
  assert(dataTypeIds[0] == 48364 && dataTypeIds[1] == 229170 && dataTypeIds[2] == 103656);

  let errTypes2 = [test.AllTypesObject.TOP_LEVEL_FOLDER, test.AllTypesObject.APPS, test.AllTypesObject.APP_LIST, test.AllTypesObject.APP_SETTINGS];
  console.log(test.shortDataTypeListSummary(errTypes2));
};

/* 테스트: class */
function syncDataModelTest() {
  console.log('\x1b[33m%s\x1b[0m', '\n\nSyncDataModel Test\n');

  console.log('\x1b[36m%s\x1b[0m', 'SyncDataModel');
  let model = new test.SyncDataModel();
  model.init();
  assert(model.getStoreBirthday().length == 32);  //0. + 소수점 이하 30자리
  console.log("store birthday:", model.getStoreBirthday());   // store birthday
  // console.log('permanent items:');                         // permanent items
  // for (let i in model.PermanentItemSpec) {
  //   console.log(model.PermanentItemSpec[i].print_data());
  // }
  // for (let x of model.PermanentItemSpec) {
  //   //x.print_data();
  // };
  let entry = {};
  model.saveEntry(entry);                                     // save entry
  console.log('entry:', entry);
  let type_keys = Object.keys(test.AllTypesObject);           // 'AllTypesObject Object' to 'key Array'
  console.log('first type key:', type_keys[1]);
  //type_keys.forEach(value => {console.log(value)});
  let item_keys = Object.keys(test.PermanentItem);
  console.log(model.typeToTypeRootId(item_keys));
  let entries = {                                             // entiries test
    'app_tag': 1,
    'bookmark_tag': 2,
    'password_tag': 3,
  };
  let id_string = 'app_tag';
  assert(id_string in entries);
  console.log('item exists test:', id_string in entries);
  model.createDefaultPermanentItems(test.AllTypesObject); //MigrationHistory 동작 확인, Entry메시지생성 동작 확인
};

function internalServerTest() {
  console.log('\x1b[33m%s\x1b[0m', '\n\nInternal Server Test\n');

  console.log('\x1b[36m%s\x1b[0m', 'Get Client Name');
  let query = {};
  query.client_id = 1;
  let cid1 = test.internalServer.getShortClientName(query);  //client id=1
  let cid1_2 = test.internalServer.getShortClientName(query);  //client id=1 - existing client id
  assert(cid1 == cid1_2);
  query.client_id = 2;
  let cid2 = test.internalServer.getShortClientName(query);  //client id=2 - new client id
  assert(cid1 != cid2);

  let requestMsg = test.proto.lookup('sync_pb.ClientToServerMessage');
  let requestJSON = {
    share: "111",
    messageContents: 1,
    storeBirthday: test.internalServer.accountModel.getStoreBirthday(),
    getUpdates: {
      fromProgressMarker: [{ dataTypeId: 1 }]
    }
  };

  console.log('\x1b[36m%s\x1b[0m', 'Handle Command');
  var errMsg = requestMsg.verify(requestJSON);
  if (errMsg)
    throw Error(errMsg);
  let realRequest = requestMsg.create(requestJSON);
  console.log('realRequest Data:', realRequest);
  let encodedRequest = requestMsg.encode(realRequest).finish();
  let request = requestMsg.decode(encodedRequest);
  test.internalServer.handleCommand(request, query);
};

/* 테스트: protobuf */
function printTypes() {
  console.log('\x1b[33m%s\x1b[0m', '\n\nProtobuf Test\n');

  console.log('\x1b[36m%s\x1b[0m', 'Lookup Message');
  let entity_msg = test.proto.root.lookupType('sync_pb.EntitySpecifics');
  console.log('load message path:', entity_msg.filename);
  let CToSResponse_msg = test.proto.root.lookupType('sync_pb.ClientToServerResponse');
  let error_msg = CToSResponse_msg.lookupType('Error');
  console.log('load sub message path:', error_msg.filename);

  console.log('\x1b[36m%s\x1b[0m', 'Insert Fields');
  for (let id in test.SyncTypeName) {
    //console.log(`id: ${id}, value: ${SyncTypeName[id]}`);
  }
  let autofill_msg = test.proto.root.lookupType('sync_pb.AutofillSpecifics');
  const fields = {
    name: 'aaa',
    value: 'bbb',
    usageTimestamp: [1111],
  }
  var errMsg = autofill_msg.verify(fields);
  if (errMsg)
    throw Error(errMsg);
  let created_msg = autofill_msg.create(fields);
  console.log(created_msg);
};

/* 테스트: 메인 서버 */
function handleWalletRequest(req, walletMarker, response) {  // CToSMessage, DataTypeProgressMarker, raw_response
  let responseMsg = proto.root.lookupType('sync_pb.ClientToServerResponse');
  res = responseMsg.create(response);
  populateWalletResults(walletEntities=[], walletMarker, res.getUpdates);
  //response = res.toJSON();  // 이 코드 없어도 response에 값 적용됨.
};
function populateWalletResults(walletEntities, walletMarker, getUpdates) {  //vector<sync_pb.SyncEntity>, DataTypeProgressMarker, sync_pb.GetUpdatesResponse
  verifyNoWalletDataProgressMarkerExists(getUpdates);
  let marker = proto.root.lookupType('DataTypeProgressMarker').create();
  marker.dataTypeId =  test.SyncTypeName.AUTOFILL_WALLET_DATA.id;
  getUpdates.newProgressMarker.push(marker);
  console.log('getUpdates:', getUpdates);
};
function verifyNoWalletDataProgressMarkerExists(getUpdates) {
  for (const marker of getUpdates.newProgressMarker) {
    console.log(marker.dataTypeId)
    //console.log(marker.dataTypeId);
    assert(marker.dataTypeId != test.SyncTypeName.AUTOFILL_WALLET_DATA.id);
  }
};
function injectClientCommand(response, clientCommand) {
  let responseMsg = proto.root.lookupType('sync_pb.ClientToServerResponse');
  const SyncEnums = responseMsg.lookup('SyncEnums');
  const ErrorType = SyncEnums.getEnum('ErrorType');
  res = responseMsg.create(response);
  if (res.errorCode == ErrorType.SUCCESS) {
    res.clientCommand = clientCommand;
  }
};

function mainServerTest() {
  console.log('\x1b[33m%s\x1b[0m', '\n\nMain Server Test\n');
  
  let requestMsg = test.proto.lookup('sync_pb.ClientToServerMessage');
  let responseMsg = proto.root.lookupType('sync_pb.ClientToServerResponse');
  const SyncEnums = responseMsg.lookup('SyncEnums');
  const ErrorType = SyncEnums.getEnum('ErrorType');
  let requestJSON = {
    share: "111",
    messageContents: 1,
    storeBirthday: test.internalServer.accountModel.getStoreBirthday(),
    getUpdates: {
      fromProgressMarker: [{ dataTypeId: 1 }]
    }
  };
  let responseJSON = {
    getUpdates: {
      newProgressMarker: [
        { dataTypeId: test.SyncTypeName.AUTOFILL_WALLET_METADATA.id },
        { dataTypeId: test.SyncTypeName.AUTOFILL.id }
      ]
    },
    errorCode: ErrorType.SUCCESS,
  };

  console.log('\x1b[36m%s\x1b[0m', 'Repeat Message Type Field');
  let progressMarkerMsg = proto.root.lookupType('DataTypeProgressMarker');
  let enty = progressMarkerMsg.create({ dataTypeId: test.SyncTypeName['AUTOFILL_WALLET_DATA'].id });
  let enty2 = progressMarkerMsg.create({ dataTypeId: 3 });
  let req = requestMsg.create(requestJSON);
  console.log(req);
  if (req.getUpdates.fromProgressMarker) {
    req.getUpdates.fromProgressMarker.push(enty);
    req.getUpdates.fromProgressMarker.push(enty2);
    console.log('bbb', req.getUpdates.fromProgressMarker);

    console.log('\x1b[36m%s\x1b[0m', 'Wallet Marker Type Exist');
    for (let index in req.getUpdates.fromProgressMarker) { console.log(index); }
    for (let marker of req.getUpdates.fromProgressMarker) {
      marker.dataTypeId == test.AllTypesObject.AUTOFILL_WALLET_DATA
    }
    let walletMarker;
    if (req.getUpdates.fromProgressMarker) {
      for (let index in req.getUpdates.fromProgressMarker) {
        console.log(req.getUpdates.fromProgressMarker[index])
        if (req.getUpdates.fromProgressMarker[index].dataTypeId == test.SyncTypeName.AUTOFILL_WALLET_DATA.id) {
          walletMarker = req.getUpdates.fromProgressMarker[index];
          req.getUpdates.fromProgressMarker.pop(index);
          break;
        }
      }
      console.log('remove wallet marker:', walletMarker);
    }
    if (walletMarker) {
      req.getUpdates.fromProgressMarker.push(walletMarker);
      console.log('add wallet marker', req.getUpdates.fromProgressMarker);
    }
    handleWalletRequest([], walletMarker, responseJSON);
    console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',responseJSON);
    let en = requestMsg.encode(req).finish();
    let de = requestMsg.decode(en)
    console.log('ccc', de)
    let json = de.toJSON();
    console.log('ddd', de.getUpdates.fromProgressMarker)
    console.log('eee', json.getUpdates.fromProgressMarker)
    delete de.getUpdates.fromProgressMarker
    console.log('fff', de)
  }

  console.log('\x1b[36m%s\x1b[0m', 'Inject Client Command');
  let clientCommand = proto.root.lookupType('ClientCommand').create();
  clientCommand.setSyncPollInterval = 3;
  injectClientCommand(responseJSON, clientCommand);
  console.log('final Response Message:', responseJSON);
  
}

/* Execute Tests */
//constantsTest();
//commonAPITest();
//syncDataModelTest();
//internalServerTest();
mainServerTest();
//setTimeout(printTypes, 1000);

/*
console.log('\x1b[33m%s\x1b[0m', 'FINISH');
var messages = require('../testProtofile/app_specifics_pb');//sync_pb');
var message = new messages.AppSpecifics();
var extension = new messages.ExtensionSpecifics();
extension.setId('name');
extension.setVersion('1111');
extension.setEnabled(true);
extension.setDisableReasons(3);
console.log(extension);
console.log(extension.toObject());
message.setExtension(extension);
console.log(message.hasPageOrdinal());
message.setPageOrdinal('aaaa');
console.log(message.getPageOrdinal());
//console.log(message.hasExtension());
*/