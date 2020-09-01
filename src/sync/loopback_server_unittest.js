/* global proto */
const assert = require("assert");
const path = require("path");
const workspaceDir = path.join(__dirname, "../..");
const mt = require(path.join(workspaceDir, "src/sync/base/model_type.js"));
let sync = require(path.join(workspaceDir, "src/sync/loopback_server.js"));
require(path.join(workspaceDir, "src/google/protocol/loopback_server_pb"));

// for (const entityId of sync.loopbackServer.entities.keys()) {
//   console.log(entityId);
// }

// for (const serverEntity of sync.loopbackServer.entities.values()) {
//   console.log(serverEntity);
// }
assert(sync.loopbackServer.strongConsistencyModelEnabled == false);
assert(sync.loopbackServer.strongConsistencyModelEnabled == false);
assert(sync.loopbackServer.storeBirthday != 0);
// assert(sync.loopbackServer.persistentFile != undefined || '');
assert(sync.loopbackServer.maxGetUpdatesBatchSize == 100000);
assert(sync.loopbackServer.keystoreKeys.length != 0);
assert(sync.loopbackServer.entities.size == 4);
assert(sync.loopbackServer.entities.has("32904_google_chrome_bookmarks"));
assert(sync.loopbackServer.entities.has("32904_bookmark_bar"));
assert(sync.loopbackServer.entities.has("32904_other_bookmarks"));
assert(sync.loopbackServer.entities.has("47745_google_chrome_nigori"));
assert(
  sync.loopbackServer.topLevelPermanentItemIds.get(mt.ModelType.BOOKMARKS) ==
    "32904_google_chrome_bookmarks"
);
assert(
  sync.loopbackServer.topLevelPermanentItemIds.get(mt.ModelType.NIGORI) ==
    "47745_google_chrome_nigori"
);
/* version update check */
const initVersion = sync.loopbackServer.entities.get("32904_bookmark_bar")
  .version;
sync.loopbackServer.saveEntity(
  sync.loopbackServer.entities.get("32904_bookmark_bar")
);
assert(
  initVersion < sync.loopbackServer.entities.get("32904_bookmark_bar").version
);

/* handleGetUpdates */
let pbMessage = new proto.sync_pb.ClientToServerMessage();

pbMessage.setShare("111111"); // required
pbMessage.setProtocolVersion(52); // defaulte = 52
// pbMessage.setDeprecatedField9();
pbMessage.setStoreBirthday("d73d1631b1802438df3b0346cdbd8ba9704f5f12");
pbMessage.setSyncProblemDetected(false); // default = false
// pbMessage.setDebugInfo(new proto.sync_pb.DebugInfo());
// pbMessage.setBagOfChips(new proto.sync_pb.ChipBag());
// pbMessage.setApiKey('Google API Key');
// pbMessage.setClientStatus(new proto.sync_pb.ClientStatus());
pbMessage.setInvalidatorClientId("user@gmail.com"); // no noti 대상(자신)
/* COMMIT, GET_UPDATSE, AUTHENTICATE, CLEAR_SERVER_DATA 택1 */
pbMessage.setMessageContents(
  proto.sync_pb.ClientToServerMessage.Contents.GET_UPDATES
);
/* 선택값 생성 */
// pbMessage.setCommit(new proto.sync_pb.CommitMessage());
pbMessage.setGetUpdates(new proto.sync_pb.GetUpdatesMessage());
// pbMessage.setAuthenticate(new proto.sync_pb.AuthenticateMessage());
// pbMessage.setClearServerData(new proto.sync_pb.ClearServerDataMessage());

pbMessage.getGetUpdates().setCreateMobileBookmarksFolder(true);
let marker = new proto.sync_pb.DataTypeProgressMarker();
marker.setDataTypeId(
  mt.getSpecificsFieldNumberFromModelType(mt.ModelType.BOOKMARKS)
);
marker.setToken(Buffer.from("77777"));
pbMessage.getGetUpdates().addFromProgressMarker(marker);
let marker2 = new proto.sync_pb.DataTypeProgressMarker();
marker2.setDataTypeId(
  mt.getSpecificsFieldNumberFromModelType(mt.ModelType.PREFERENCES)
);
marker2.setToken(Buffer.from("88888"));
pbMessage.getGetUpdates().addFromProgressMarker(marker2);
// console.log(pbMessage.getGetUpdates().getFromProgressMarkerList())
let pbResponse = new proto.sync_pb.ClientToServerResponse();
assert(200 == sync.loopbackServer.handleCommand(pbMessage, pbResponse));
// console.log(pbResponse.toObject())

/* Implemented */
assert(pbResponse.hasCommit() == false);
assert(pbResponse.hasGetUpdates() == true);
assert(pbResponse.hasAuthenticate() == false);
assert(pbResponse.hasClearServerData() == false);
assert(pbResponse.getErrorCode() == proto.sync_pb.SyncEnums.ErrorType.SUCCESS);
assert(pbResponse.getStoreBirthday() == pbMessage.getStoreBirthday());
/* Not Implemented */
assert(pbResponse.hasErrorMessage() == false);
assert(pbResponse.hasClientCommand() == false);
assert(pbResponse.hasProfilingData() == false);
assert(pbResponse.hasStreamMetadata() == false);
assert(pbResponse.hasStreamData() == false);
assert(pbResponse.getMigratedDataTypeIdList() == false);
assert(pbResponse.hasError() == false);
assert(pbResponse.hasNewBagOfChips() == false);
/* Implemented */
assert(pbResponse.getGetUpdates().getEntriesList().length == 4);
assert(pbResponse.getGetUpdates().getNewProgressMarkerList().length == 2);
assert(pbResponse.getGetUpdates().getChangesRemaining() == 0);
/* Not Implemented */
assert(pbResponse.getGetUpdates().hasNewTimestamp() == false);
assert(pbResponse.getGetUpdates().getEncryptionKeysList() == false);
assert(pbResponse.getGetUpdates().getContextMutationsList() == false);
// console.log(pbResponse.getGetUpdates().getEntriesList()[0].toObject())
// console.log(pbResponse.getGetUpdates().getEntriesList()[1].toObject())
// console.log(pbResponse.getGetUpdates().getEntriesList()[2].toObject())
// console.log(pbResponse.getGetUpdates().getEntriesList()[3].toObject())

/* handleCommit */
let pbMessageCommit = new proto.sync_pb.ClientToServerMessage();

pbMessageCommit.setShare("111111"); // required
pbMessageCommit.setProtocolVersion(52); // defaulte = 52
// pbMessageCommit.setDeprecatedField9();
pbMessageCommit.setStoreBirthday("d73d1631b1802438df3b0346cdbd8ba9704f5f12");
pbMessageCommit.setSyncProblemDetected(false); // default = false
// pbMessageCommit.setDebugInfo(new proto.sync_pb.DebugInfo());
// pbMessageCommit.setBagOfChips(new proto.sync_pb.ChipBag());
// pbMessageCommit.setApiKey('Google API Key');
// pbMessageCommit.setClientStatus(new proto.sync_pb.ClientStatus());
pbMessageCommit.setInvalidatorClientId("user@gmail.com"); // no noti 대상(자신)
/* COMMIT, GET_UPDATSE, AUTHENTICATE, CLEAR_SERVER_DATA 택1 */
pbMessageCommit.setMessageContents(
  proto.sync_pb.ClientToServerMessage.Contents.COMMIT
);
/* 선택값 생성 */
pbMessageCommit.setCommit(new proto.sync_pb.CommitMessage());
// pbMessageCommit.setGetUpdates(new proto.sync_pb.GetUpdatesMessage());
// pbMessageCommit.setAuthenticate(new proto.sync_pb.AuthenticateMessage());
// pbMessageCommit.setClearServerData(new proto.sync_pb.ClearServerDataMessage());

/* 아래 주석처럼 쓰지 말 것!!!!! */
// pbMessageCommit.getCommit().addEntries(new proto.sync_pb.SyncEntity());
// let pbSyncEntity = pbMessageCommit.getCommit().getEntriesList().slice(-1)[0];

let pbSyncEntity = new proto.sync_pb.SyncEntity();
pbMessageCommit.getCommit().addEntries(pbSyncEntity);
pbSyncEntity.setIdString("aaa"); // Entity의 고유한 이름. 각 북마크마다 다름
for (const pbResponseEntity of pbResponse.getGetUpdates().getEntriesList()) {
  if (pbResponseEntity.getIdString() == "32904_bookmark_bar") {
    pbSyncEntity.setParentIdString(pbResponseEntity.getIdString());
    break;
  }
}
pbSyncEntity.setVersion(111);
pbSyncEntity.setMtime(101);
pbSyncEntity.setCtime(100);
pbSyncEntity.setName("entity name"); // 실제 북마크 이름
// pbSyncEntity.setNonUniqueName();
// pbSyncEntity.setSyncTimestamp();  // 마지막 서버 업데이트 시간. version과 동일
pbSyncEntity.setSpecifics(new proto.sync_pb.EntitySpecifics());
// GetUpdateMessage 결과로 받은 값을 CommitMessage에 담아 전송
/* 북마크는 일단 Tag 노필요! */
// pbSyncEntity.setClientDefinedUniqueTag('client tag');
// pbSyncEntity.setServerDefinedUniqueTag('server tag');// GetUpdatesResponse Only
pbSyncEntity.setOriginatorCacheGuid("user@gmail.com");
// entity를 처음 커밋한 클라이언트의 로컬 항목 ID 일반적으로 음의 정수
// GetUpdatesResponse에서만 추가
// pbSyncEntity.setOriginatorClientItemId('local item id');
pbSyncEntity.getSpecifics().setBookmark(new proto.sync_pb.BookmarkSpecifics());
pbSyncEntity.getSpecifics().getBookmark().setTitle("북마크");
pbSyncEntity.getSpecifics().getBookmark().setUrl("http://111.111.11.11");
// console.log(pbMessageCommit.getCommit().toObject())

let pbResponseCommit = new proto.sync_pb.ClientToServerResponse();
assert(
  200 == sync.loopbackServer.handleCommand(pbMessageCommit, pbResponseCommit)
);

// console.log(pbResponseCommit.toObject())
/* Implemented */
assert(pbResponseCommit.hasCommit() == true);
assert(pbResponseCommit.hasGetUpdates() == false);
assert(pbResponseCommit.hasAuthenticate() == false);
assert(pbResponseCommit.hasClearServerData() == false);
assert(
  pbResponseCommit.getErrorCode() == proto.sync_pb.SyncEnums.ErrorType.SUCCESS
);
assert(pbResponseCommit.getStoreBirthday() == pbMessage.getStoreBirthday());
/* Not Implemented */
assert(pbResponseCommit.hasErrorMessage() == false);
assert(pbResponseCommit.hasClientCommand() == false);
assert(pbResponseCommit.hasProfilingData() == false);
assert(pbResponseCommit.hasStreamMetadata() == false);
assert(pbResponseCommit.hasStreamData() == false);
assert(pbResponseCommit.getMigratedDataTypeIdList() == false);
assert(pbResponseCommit.hasError() == false);
assert(pbResponseCommit.hasNewBagOfChips() == false);
// CommitResponse has the EntryResponse list field only.
for (const pbEntryResponse of pbResponseCommit
  .getCommit()
  .getEntryResponseList()) {
  /* Implemented */
  assert(pbEntryResponse.getIdString() != "");
  assert(
    pbEntryResponse.getResponseType() ==
      proto.sync_pb.CommitResponse.ResponseType.SUCCESS
  );
  // assert(pbEntryResponse.getParentIdString() == '32904_bookmark_bar');
  assert(pbEntryResponse.getVersion() > pbSyncEntity.getVersion());
  assert(pbEntryResponse.getMtime() > pbSyncEntity.getMtime());
}
