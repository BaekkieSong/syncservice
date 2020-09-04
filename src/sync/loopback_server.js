/* global proto */
const assert = require("assert");
const path = require("path");
const workspaceDir = path.join(__dirname, "../..");
const mt = require(path.join(workspaceDir, "src/sync/base/model_type.js"));
require(path.join(workspaceDir, "src/google/protocol/loopback_server_pb"));
const persistentBookmark = require(path.join(
  workspaceDir,
  "src/sync/loopback/persistent_bookmark_entity.js"
));
const persistentPermanent = require(path.join(
  workspaceDir,
  "src/sync/loopback/persistent_permanent_entity.js"
));
const persistentTombstone = require(path.join(
  workspaceDir,
  "src/sync/loopback/persistent_tombstone_entity.js"
));
const persistentUniqueClient = require(path.join(
  workspaceDir,
  "src/sync/loopback/persistent_unique_client_entity.js"
));

const HTTP_OK = 200;
const HTTP_BAD_REQUEST = 400; // net::HTTP_BAD_REQUEST
const HTTP_INTERNAL_SERVER_ERROR = 500;

const KEYSTORE_KEY_LENGTH = 16;
const kBookmarkBarFolderServerTag = "bookmark_bar";
const kBookmarkBarFolderName = "Bookmark Bar";
const kOtherBookmarksFolderServerTag = "other_bookmarks";
const kOtherBookmarksFolderName = "Other Bookmarks";
const kSyncedBookmarksFolderServerTag = "synced_bookmarks";
const kSyncedBookmarksFolderName = "Synced Bookmarks";

/* public API */
// python 테스트 서버에서 가져옴
function makeNewKeystoreKey() {
  let charRegix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomKey = "";
  for (var i = 0; i < KEYSTORE_KEY_LENGTH; ++i) {
    randomKey += charRegix.charAt(Math.floor(Math.random() * charRegix.length));
  }
  console.log("\x1b[35m%s\x1b[0m", "Generate random keystore key: ", randomKey);
  return randomKey;
}

/* 업데이트 할 ModelType을 거르는 '체' 역할 */
class UpdateSieve {
  constructor(pbGetUpdatesMessage) {
    const requestMap = this.messageToVersionMap(pbGetUpdatesMessage);
    let responseMap = requestMap;
    this.requestVersionMap = requestMap; //<modelType, int64_t>
    this.responseVersionMap = responseMap;
  }

  /* GetUpdates 결과 Response로 ProgressMarker를 Set.
  이 때 값은 Request의 ProgressMarker와 Response Entity들 중에
  가장 큰 version값이 됨 */
  setProgressMarkers(pbGetUpdatesResponse) {
    /* Map에서 modelType & version 값을 읽어옴 */
    console.log("Set Response ProgressMarker:", this.responseVersionMap);
    for (const typeAndVersion of this.responseVersionMap) {
      let pbNewProgressMarker = new proto.sync_pb.DataTypeProgressMarker();
      pbNewProgressMarker.setDataTypeId(
        mt.getSpecificsFieldNumberFromModelType(typeAndVersion[0])
      );
      pbNewProgressMarker.setToken(typeAndVersion[1].toString());
      pbGetUpdatesResponse.addNewProgressMarker(pbNewProgressMarker);
    }
    //return pbGetUpdatesResponse //자동으로 Set됐는지 확인
  }

  /* Response Entity를 보낼지 말지 결정 */
  clientWantsItem(serverEntity) {
    // LoopbackServerEntity
    let modelType = serverEntity.modelType;
    if (!this.requestVersionMap.has(modelType)) {
      console.log(
        "\x1b[36m%s\x1b[0m",
        "Client doesn't want to sync this item:",
        serverEntity.id
      );
      return false;
    }
    /* Only for tests */
    if (this.requestVersionMap.get(modelType) < serverEntity.version) {
      console.log("\x1b[35m%s\x1b[0m", `Respond to client: ${serverEntity.id}`);
    } else {
      console.log(
        "\x1b[36m%s\x1b[0m",
        `Don't respond to client: ${serverEntity.id} -`,
        `map's version: ${this.requestVersionMap.get(modelType)} >=`,
        `lsEntity's version: ${serverEntity.version}`
      );
    }
    return this.requestVersionMap.get(modelType) < serverEntity.version;
  }

  /* 나중에 Response의 ProgressMarker를 Set할 때 사용하기 위해
  가장 높은 버전값의 내부 추적값을 업데이트 */
  updateProgressMarker(serverEntity) {
    // LoopbackServerEntity
    // console.log(this.clientWantsItem(serverEntity));

    let modelType = serverEntity.modelType;
    this.responseVersionMap.set(
      modelType,
      Math.max(this.responseVersionMap.get(modelType), serverEntity.version)
    );
  }

  /* ModelType에 대한 버전값을 알려주는 Map을 반환하는 API */
  messageToVersionMap(pbGetUpdatesMessage) {
    assert(
      pbGetUpdatesMessage.getFromProgressMarkerList().length > 0,
      `\x1b[31m A GetUpdates request must have at least one progress marker.
       \x1b[0m`
    );
    let modelTypeToVersionMapForRequest = new Map(); // 요청에 포함된 ModelType에 대한 버전값을 나타내는 Map
    for (let i in pbGetUpdatesMessage.getFromProgressMarkerList()) {
      let marker = pbGetUpdatesMessage.getFromProgressMarkerList()[i];
      let version = 0;
      // 최초 Request인 경우, token값이 없거나 비어있을 경우, version은 0을 유지함
      if (marker.hasToken() && marker.getToken() != "") {
        // Token에서 버전값을 얻어내네!!!!????
        // TODO: 실제 오는 값은 Encoding된 값으로 보임. 확인 필요.
        // origin: base::StringToInt64
        console.log(
          `${marker.getDataTypeId()}'s token value is:`,
          `${String.fromCharCode.apply(null, marker.getToken())}`
        );
        console.log(marker.getToken_asB64());
        console.log(String.fromCharCode.apply(null, marker.getToken_asU8()));
        version = parseInt(String.fromCharCode.apply(null, marker.getToken()));
        if (!version) {
          console.error(
            "\x1b[31m%s\x1b[0m",
            "Unable to parse progress marker token."
          );
        }
      }
      let modelType = mt.getModelTypeFromSpecificsFieldNumber(
        marker.getDataTypeId()
      );
      assert(
        false == modelTypeToVersionMapForRequest.has(modelType),
        `\x1b[31m Request already has the marker's ModelType: ${modelType}
         \x1b[0m`
      );
      if (modelType != mt.ModelType.UNSPECIFIED) {
        modelTypeToVersionMapForRequest.set(modelType, version);
      } else {
        console.error(
          "\x1b[31m%s\x1b[0m",
          "Unexpected modelType specifics field number."
        );
      }
    }
    return modelTypeToVersionMapForRequest;
  }
}

/* 동기화 처리 백엔드 */
class LoopbackServer {
  constructor(persistentFile) {
    this.strongConsistencyModelEnabled = false;
    this.version = +new Date(); //new Date().getTime();
    this.storeBirthday = 0;
    this.persistentFile = persistentFile;
    //this.observerForTests = null;
    this.maxGetUpdatesBatchSize = 100000;
    //this.entities
    //this.topLevelpermanentItemIds = map()
    //this.keystoreKeys = [](vector)
    this.init();
  }

  /* LoopbackServer Init */
  init() {
    // if (this.LoadStateFromFile(this.persistentFile)) {
    //   return undefined;
    // }

    // 일단 임시로 storeBirthday 정의함
    // 원래 LoadStateFromFile하면서 읽어오는 듯...
    this.storeBirthday = "d73d1631b1802438df3b0346cdbd8ba9704f5f12";
    this.keystoreKeys = [];
    this.keystoreKeys.push(this.generateNewKeystoreKey());
    // ex) id: 32904_bookmark_bar
    this.entities = new Map(); // id, unique<serverEntity>
    this.topLevelPermanentItemIds = new Map();
    this.createDefaultPermanentItems();
  }

  generateNewKeystoreKey() {
    return makeNewKeystoreKey();
    //return base::RandBytesAsString(KEYSTORE_KEY_LENGTH);
  }

  createPermanentBookmarkFolder(serverTag, name) {
    // string, string
    let serverEntity = persistentPermanent.createNew(
      mt.ModelType.BOOKMARKS,
      serverTag,
      name,
      mt.modelTypeToRootTag(mt.ModelType.BOOKMARKS)
    );
    if (!serverEntity) {
      return false;
    }
    // console.log(serverEntity);
    this.saveEntity(serverEntity);
    return true;
  }

  createDefaultPermanentItems() {
    /* 북마크는 항상 영구 폴더 필요. Nigori 타입도 영구 Root 폴더 필요. */
    const permanentFolderTypes = new Set(
      Object.values(mt.modelTypeSet).filter((it) => {
        if (it == mt.ModelType.BOOKMARKS || it == mt.ModelType.NIGORI) {
          return it;
        }
      })
    );
    // console.log(permanentFolderTypes);
    for (const modelType of permanentFolderTypes) {
      // console.log(modelType);
      let topLevelEntity = persistentPermanent.createTopLevel(modelType);
      if (!topLevelEntity) {
        return false;
      }
      this.topLevelPermanentItemIds.set(modelType, topLevelEntity.id);
      this.saveEntity(topLevelEntity);
      if (modelType == mt.ModelType.BOOKMARKS) {
        if (
          !this.createPermanentBookmarkFolder(
            kBookmarkBarFolderServerTag,
            kBookmarkBarFolderName
          )
        ) {
          return false;
        }
        if (
          !this.createPermanentBookmarkFolder(
            kOtherBookmarksFolderServerTag,
            kOtherBookmarksFolderName
          )
        ) {
          return false;
        }
      }
    }
    console.log(
      "\x1b[35m%s\x1b[0m",
      "Permanent items created: ",
      this.topLevelPermanentItemIds
    );
    return true;
  }

  getTopLevelPermanentItemId(modelType) {
    //mt.ModelType
    if (!this.topLevelPermanentItemIds.has(modelType)) {
      return undefined;
    } else {
      return this.topLevelPermanentItemIds.get(modelType);
    }
  }

  updateEntityVersion(serverEntity) {
    serverEntity.setVersion(+new Date());
  }

  saveEntity(serverEntity) {
    // unique<serverEntity>
    if (!this.entities.has(serverEntity.id)) {
      console.log("\x1b[35m%s\x1b[0m", "New entity:", serverEntity.id);
    } else {
      console.log("\x1b[36m%s\x1b[0m", "Update entity:", serverEntity.id);
    }
    this.updateEntityVersion(serverEntity);
    this.entities.set(serverEntity.id, serverEntity);
  }

  /* origin input type: const string, string*(buffer_in, buffer_out)
    input type:
      sync_pb::ClientToServerMessage(deserialized)
      sync_pb::ClientToServerResponse(deserialized)
  */
  handleCommand(pbMessage, pbResponse) {
    console.log("\x1b[33m%s\x1b[0m", "Start handle command");
    /* thread check */
    // response.clear();
    /* 이미 deserialized된 메시지를 받았으므로 parse는 따로 하지 않음 */
    try {
      if (
        pbMessage.hasStoreBirthday() &&
        pbMessage.getStoreBirthday() != this.getStoreBirthday()
      ) {
        pbResponse.setErrorCode(
          proto.sync_pb.SyncEnums.ErrorType.NOT_MY_BIRTHDAY
        );
      } else {
        let success = false;
        switch (pbMessage.getMessageContents()) {
          case proto.sync_pb.ClientToServerMessage.Contents.GET_UPDATES:
            pbResponse.setGetUpdates(new proto.sync_pb.GetUpdatesResponse());
            success = this.handleGetUpdates(
              pbMessage.getGetUpdates(),
              pbResponse.getGetUpdates()
            );
            break;
          case proto.sync_pb.ClientToServerMessage.Contents.COMMIT:
            pbResponse.setCommit(new proto.sync_pb.CommitResponse());
            success = this.handleCommit(
              pbMessage.getCommit(),
              pbMessage.getInvalidatorClientId(),
              pbResponse.getCommit()
            );
            break;
          case proto.sync_pb.ClientToServerMessage.Contents.CLEAR_SERVER_DATA:
            this.clearServerData();
            pbResponse.setClearServerData(new proto.sync_pb.ClearServerData());
            success = true;
            break;
          case proto.sync_pb.ClientToServerMessage.Contents.AUTHENTICATE:
            // Not Implemented
            success = true;
            break;
          default:
            return HTTP_BAD_REQUEST;
        }
        if (!success) {
          return HTTP_INTERNAL_SERVER_ERROR;
        }
        let clientCommand = newproto.sync_pb.ClientCommand();
        clientCommand.setMaxCommitBatchSize(90);
        clientCommand.setSessionsCommitDelaySeconds(11);
        clientCommand.setSetSyncLongPollInterval(21600); // 6hours
        clientCommand.setSetSyncPollInterval(14400); // 4hours
        pbResponse.setClientCommand(clientCommand);
        pbResponse.setErrorCode(proto.sync_pb.SyncEnums.ErrorType.SUCCESS);
      }
      pbResponse.setStoreBirthday(this.getStoreBirthday());
      pbResponse = pbResponse.serializeBinary();
    } catch (err) {
      console.error(
        "\x1b[31m%s\x1b[0m",
        `${err.name} - occurred. \n`,
        `${err.stack}`
      );
      return HTTP_INTERNAL_SERVER_ERROR;
    }
    /* Save 동작은 Async하게 되어야 함 */
    //this.saveStateToFile(this.persistentFile);
    return HTTP_OK;
  }

  enableStrongConsistencyWithConflictDetectionModel() {
    this.strongConsistencyModelEnabled = true;
  }

  /* 클라이언트에서 요청한 id_string에 대해 작업 수행.
  예를 들어 북마크의 경우 생성, 삭제 또는 업데이트 등을 수행함.
  작업이 완료되면 서버의 Entries목록에 작업한 serverEntity를 추가 */
  /* input type: sync_pb::SyncEntity, sync_pb::CommitResponse.EntryResponse*,
  string, string */
  commitEntity(pbClientEntity, pbEntryResponse, clientGuid, parentId) {
    if (pbClientEntity.getVersion() == 0 && pbClientEntity.getDeleted()) {
      return "";
    }
    /* strongConsistencyModelEnabled이 true인 경우, 서버에서 version값 체크 수행.
    오류 발생시 CONFICT를 응답으로 보냄
    TODO: 여기선 전역 state로 구현되었으나, 모델타입별로 동작하도록 변경 필요 */
    /* Tip: Version(타임스탬프)을 체크. Commit할 때 Get_Updates Response로 받은
    entity 마지막 버전값을 제대로 Set하고 Commit했는지 확인하는 것으로 보면 됨 */
    if (this.strongConsistencyModelEnabled) {
      /* 못 찾은 경우 undefined, false로 처리됨 */
      if (this.entities.has(pbClientEntity.getIdString())) {
        if (
          this.entities.get(pbClientEntity.getIdString()).version !=
          pbClientEntity.getVersion()
        ) {
          pbEntryResponse.setResponseType(
            proto.sync_pb.CommitResponse.ResponseType.CONFLICT
          );
          return pbClientEntity.getIdString();
        }
      }
    }

    let serverEntity; // serverEntity
    const modelType = mt.getModelType(pbClientEntity);
    if (pbClientEntity.getDeleted()) {
      serverEntity = persistentTombstone.createFromEntity(pbClientEntity);
      if (serverEntity) {
        this.deleteChildren(pbClientEntity.getIdString());
      }
    } else if (modelType == mt.ModelType.NIGORI) {
      /* nigori는 클라이언트가 업데이트 해야하는 유일한 permanent 항목 타입 */
      assert(
        this.entities.has(pbClientEntity.getIdString()),
        `\x1b[31m
      The client should have id_string: ${pbClientEntity.getIdString()} \x1b[0m`
      );
      serverEntity = persistentPermanent.createUpdatedNigoriEntity(
        pbClientEntity,
        this.entities.get(pbClientEntity.getIdString())
      );
    } else if (modelType == mt.ModelType.BOOKMARKS) {
      if (this.entities.has(pbClientEntity.getIdString())) {
        serverEntity = persistentBookmark.createUpdatedVersion(
          pbClientEntity,
          pbClientEntity.this.entities.get(pbClientEntity.getIdString()),
          parentId
        );
      } else {
        serverEntity = persistentBookmark.createNew(
          pbClientEntity,
          parentId,
          clientGuid
        );
      }
    } else {
      serverEntity = persistentUniqueClient.createFromEntity(pbClientEntity);
    }

    if (!serverEntity) {
      return "";
    }
    const id = serverEntity.id;
    this.saveEntity(serverEntity);
    this.buildEntryResponseForSuccessfulCommit(id, pbEntryResponse);
    return id;
  }

  /* Only For Test
  Entities를 위한 응답 타입을 gen하기 위한 콜백!
  다중 클라이언트 대상으론 유용하지 않음
  클라이언트가 수행한 작업이 무엇인지 계속 체크할 수 있게함 */
  /* Don`t Use It Now! */
  overrideResponseType(responseType) {
    this.responseTypeOverride = responseType;
  }

  /* input type: string, sync_pb::CommitResponse.EntryResponse* */
  buildEntryResponseForSuccessfulCommit(entityId, pbEntryResponse) {
    if (false == this.entities.has(entityId)) {
      console.error("\x1b[31m%s\x1b[0m", `Entities should have: ${entityId}.`);
    }
    const serverEntity = this.entities.get(entityId);
    pbEntryResponse.setResponseType(
      this.responseTypeOverride
        ? this.responseTypeOverride.Run(serverEntity) // Not Implemented
        : proto.sync_pb.CommitResponse.ResponseType.SUCCESS
    );
    pbEntryResponse.setIdString(serverEntity.id);
    if (serverEntity.isDeleted()) {
      pbEntryResponse.setVersion(+new Date());
    } else {
      pbEntryResponse.setVersion(serverEntity.version);
      pbEntryResponse.setName(serverEntity.name);
    }
    /* sync-internals보고 임의로 추가한 값임 */
    pbEntryResponse.setMtime(serverEntity.lastModifiedTime);
  }

  /* id가 potentialParentId의 Child ID인지 확인함. 
  북마크 등에서 사용 */
  // input type: string, string
  isChild(id, potentialParentId) {
    if (!this.entities.has(id)) {
      /* 서버에 저장되지 않은 ID(가상의 Root Entity 등)인 경우 */
      return false;
    }
    // parentId는 serverEntity의 다른 멤버 변수와 달리 get API 필요 */
    if (this.entities.get(id).getParentId() == potentialParentId) {
      return true;
    }
    // recursive 체크.
    return this.isChild(this.entities.get(id).getParentId(), potentialParentId);
  }

  deleteChildren(parentId) {
    let tombstones = []; // vector<sync_pb::SyncEntity>
    // parentId의 모든 Child 탐색
    for (let idAndEntity of this.entities) {
      if (this.isChild(idAndEntity[0], parentId)) {
        let pbSyncEntity = new proto.sync_pb.SyncEntity();
        idAndEntity[1].serializeAsProto(pbSyncEntity);
        tombstones.push(pbSyncEntity);
      }
    }
    for (let tombstone of tombstones) {
      this.saveEntity(persistentTombstone.createFromEntity(tombstone));
    }
  }

  handleCommit(pbCommitMessage, invalidatorClientId, pbCommitResponse) {
    console.log("\x1b[33m%s\x1b[0m", "Handle commit");
    console.log(
      "\x1b[35m%s\x1b[0m",
      "Commit message:",
      JSON.stringify(pbCommitMessage.toObject())
    );
    let clientToServerIds = new Map();
    let guid = pbCommitMessage.getCacheGuid();
    let commitedModelTypes = new Set(); // modelTypeSet
    console.log("guid:", guid);
    console.log("guid as B64", window.atob(guid));
    //let guidString = String.fromCharCode.apply(null, guid);
    //console.log("guidString:", guidString);

    /* Commit Entry항목별로 commitEntity를 수행
    처리된 정보는 pbCommitResponse에 저장되어 리턴됨 */
    // TODO: pbCommitMessage.entires의 유효성 검차 추가 필요
    for (const pbSyncEntity of pbCommitMessage.getEntriesList()) {
      let pbEntryResponse = new proto.sync_pb.CommitResponse.EntryResponse();
      pbCommitResponse.addEntryResponse(pbEntryResponse);
      let parentId = pbSyncEntity.getParentIdString();
      if (clientToServerIds.has(parentId)) {
        parentId = clientToServerIds.get(parentId);
      }
      const entityId = this.commitEntity(
        pbSyncEntity,
        pbEntryResponse,
        guid,
        parentId
      );
      if (!entityId) {
        // ==''
        return false;
      }
      if (entityId != pbSyncEntity.getIdString()) {
        clientToServerIds.set(pbSyncEntity.getIdString(), entityId);
      }

      if (this.entities.has(entityId)) {
        commitedModelTypes.add(this.entities.get(entityId).modelType);
      } else {
        console.error(
          "\x1b[31m%s\x1b[0m",
          `entities should have the entityId: ${entityId}`
        );
      }
    }

    if (this.observerForTests) {
      this.observerForTests.onCommit(invalidatorClientId, commitedModelTypes);
    }
    return true;
  }

  clearServerData() {
    this.entities.clear();
    this.keystoreKeys = [];
    ++this.storeBirthday;
    //base::DeleteFile(persistent_file_, false);
    this.init();
  }

  handleGetUpdates(pbGetUpdatesMessage, pbGetUpdatesResponse) {
    console.log("\x1b[33m%s\x1b[0m", "Handle get_updates");
    console.log(
      "\x1b[35m%s\x1b[0m",
      "Updates message:",
      JSON.stringify(pbGetUpdatesMessage.toObject())
    );
    pbGetUpdatesResponse.setChangesRemaining(0);
    let sieve = new UpdateSieve(pbGetUpdatesMessage);

    /* 모바일 북마크 생성.
    client UI에서 'Synced Bookmarks' => 'Mobile Bookmarks'로
    rename생성. 실패할 경우 에러이므로 false 리턴 */
    if (
      pbGetUpdatesMessage.getCreateMobileBookmarksFolder() &&
      !this.createPermanentBookmarkFolder(
        kSyncedBookmarksFolderServerTag,
        kSyncedBookmarksFolderName
      )
    ) {
      return false;
    }

    /* 업데이트가 필요한 항목을 체크하여 리스트 생성 */
    let wantedEntities = []; //std::vector<LoopbackServerEntity*>
    // entities_: EntityMap<string, LoopbackServerEntity>
    for (const idAndEntity of this.entities) {
      if (sieve.clientWantsItem(idAndEntity[1])) {
        wantedEntities.push(idAndEntity[1]);
      }
    }

    /* 한 번에 업데이트 할 Entity 개수를 허용하는 전송량 이하로 조정
    pbGetUpdatesMessage.getBatchSize(): 클라이언트가 요구하는 최대 전송 수
    this.maxGetUpdatesBatchSize: 서버 한계 전송 수 */
    let maxBatchSize = this.maxGetUpdatesBatchSize;
    if (
      pbGetUpdatesMessage.hasBatchSize() &&
      pbGetUpdatesMessage.getBatchSize() > 0
    ) {
      console.log("requested batch size:", pbGetUpdatesMessage.getBatchSize());
      maxBatchSize = Math.min(maxBatchSize, pbGetUpdatesMessage.getBatchSize());
    }
    if (wantedEntities.length > maxBatchSize) {
      pbGetUpdatesResponse.setChangesRemaining(
        wantedEntities.length - maxBatchSize
      );
      /* 원래 부분 정렬(std::partial_sort)로 maxBatchSize 만큼만 정렬하여 처리.
      여기선 일단 전체 정렬 수행 */
      // TODO: 근데 왜 내림차순 정렬하지..? 버전 낮은거부터 처리할 거 아닌가..?
      wantedEntities.sort((a, b) => a.version < b.version);
      // 0번째부터 size번째까지 splice하여 Entities의 크기 조정
      wantedEntities = wantedEntities.splice(0, maxBatchSize);
    }
    let sendEncryptionKeysBasedOnNigori = false;
    console.log("Num of GetUpdates entity size:", wantedEntities.length);
    for (const serverEntity of wantedEntities) {
      sieve.updateProgressMarker(serverEntity);
      let pbSyncEntity = new proto.sync_pb.SyncEntity();
      // serverEntity => sync_pb::SyncEntity Set
      serverEntity.serializeAsProto(pbSyncEntity);
      pbGetUpdatesResponse.addEntries(pbSyncEntity);

      /* NIGORI 암호화 타입 */
      if (serverEntity.modelType == mt.ModelType.NIGORI) {
        sendEncryptionKeysBasedOnNigori =
          pbSyncEntity.getSpecifics().getNigori().getPassphraseType() ==
          proto.sync_pb.NigoriSpecifics.PassphraseType.KEYSTORE_PASSPHRASE;
      }
    }
    if (
      sendEncryptionKeysBasedOnNigori ||
      pbGetUpdatesMessage.getNeedEncryptionKey()
    ) {
      for (const key of this.keystoreKeys) {
        // Array
        // key는 string인데 encryption_keys는 Bytes임... 어떻게 변환되는건지..?
        pbGetUpdatesResponse.addEncryptionKeys(key);
      }
    }
    sieve.setProgressMarkers(pbGetUpdatesResponse);
    return true;
  }

  getStoreBirthday() {
    // return base::Int64ToString(store_birthday_);
    return this.storeBirthday;
  }

  /* Only For Tests
  주어진 모델 타입의 모든 동기화 항목들 리턴.
  단, Permanent 항목들은 제외 */
  getSyncEntitiesByModelType(modelType) {
    let pbSyncEntities = [];
    for (const serverEntity of this.entities.values()) {
      if (
        !(serverEntity.isDeleted() || serverEntity.isPermanent()) &&
        serverEntity.modelType == modelType
      ) {
        let pbSyncEntity = new proto.sync_pb.SyncEntity();
        serverEntity.serializeAsProto(pbSyncEntity);
        pbSyncEntities.push(pbSyncEntity);
      }
    }
    return pbSyncEntities;
  }

  /* Only For Tests
  주어진 모델 타입의 Permanent 항목들만 리턴 */
  getPermanentSyncEntitiesByModelType(modelType) {
    let pbSyncEntities = [];
    for (const serverEntity of this.entities.values()) {
      if (
        !serverEntity.isDeleted() &&
        serverEntity.isPermanent() &&
        serverEntity.modelType == modelType
      ) {
        let pbSyncEntity = new proto.sync_pb.SyncEntity();
        serverEntity.serializeAsProto(pbSyncEntity);
        pbSyncEntities.push(pbSyncEntity);
      }
    }
    return pbSyncEntities;
  }
}

let loopbackServer = new LoopbackServer();
exports.loopbackServer = loopbackServer;
