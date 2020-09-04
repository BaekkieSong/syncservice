/* global proto */
const path = require("path");
const workspaceDir = path.join(__dirname, "../../..");
let mt = require(path.join(workspaceDir, "src/sync/base/model_type.js"));
const se = require(path.join(
  workspaceDir,
  "src/sync/loopback/server_entity.js"
));
require(path.join(workspaceDir, "src/google/protocol/loopback_server_pb"));
const { v4: uuidv4 } = require("uuid");

/* local namespace */
function isBookmark(pbClientEntity) {
  // sync_pb::SyncEntity
  return mt.getModelType(pbClientEntity) == mt.ModelType.BOOKMARKS;
}

/* Tombstone 처리
삭제되는 북마크는 다음과 같이 리턴됨(9개)
id_string: '고유값'
ctime:
mtime:
deleted: true
name: tombstone
originator_cache_guid:
originator_client_item_id:
position_in_parent: 0
version
*/

/* PersistentBookmarkEntity */
class PersistentBookmarkEntity extends se.LoopbackServerEntity {
  constructor(
    id, // string
    version, // int64_t
    name, // string
    // ordinal_in_parent,
    originatorCacheGuid, // string
    originatorClientItemId, // string
    pbUniquePosition, // sync_pb::UniquePostion
    pbEntitySpecifics, // sync_pb::EntitySpecifics
    folder, // bool
    parentId, // string
    creationTime, // int64_t
    lastModifiedTime // int64_t
  ) {
    super(id, mt.ModelType.BOOKMARKS, version, name);
    this.originatorCacheGuid = originatorCacheGuid;
    this.originatorClientItemId = originatorClientItemId;
    this.uniquePosition = pbUniquePosition;
    this.folder = folder;
    this.parentId = parentId;
    this.creationTime = creationTime;

    this.lastModifiedTime = lastModifiedTime;
    this.lastModifiedTime = +new Date(); /* lastModifiedTime */
    this.setSpecifics(pbEntitySpecifics);
  }

  setParentId(parentId) {
    // string
    this.parentId = parentId;
  }

  /* override */
  requiresParentId() {
    // 북마크는 계층구조이므로 항상 부모 필요!
    return true;
  }

  /* override */
  getParentId() {
    return this.parentId;
  }

  /* override */
  serializeAsProto(pbSyncEntity) {
    // sync_pb::SyncEntity
    this.serializeBaseProtoFields(pbSyncEntity);
    pbSyncEntity.setOriginatorCacheGuid(this.originatorCacheGuid);
    pbSyncEntity.setOriginatorClientItemId(this.originatorClientItemId);
    pbSyncEntity.setCtime(this.creationTime);
    pbSyncEntity.setMtime(this.lastModifiedTime);
    pbSyncEntity.setUniquePosition(
      this.uniquePosition
        ? new proto.sync_pb.UniquePosition(this.uniquePosition)
        : undefined
    );
    return pbSyncEntity;
  }

  /* override */
  isFolder() {
    return this.folder;
  }

  /* override */
  getLoopbackServerEntityType() {
    return proto.sync_pb.LoopbackServerEntity.Type.BOOKMARK;
  }
}

/* static */
/* Factory function. 북마크 Specifics가 처음 서버에서 사용되려 할 때만 호출됨 */
// input type: sync_pb::SyncEntity, string, string
function createNew(pbClientEntity, parentId, clientGuid) {
  if (!isBookmark(pbClientEntity)) {
    return undefined;
  }
  // const id = se.createId(mt.ModelType.BOOKMARKS,/*TODO: base::GenerateGUID()*/);
  const id = se.createId(mt.ModelType.BOOKMARKS, uuidv4());
  const originatorCacheGuid = clientGuid;
  const originatorClientItemId = pbClientEntity.getIdString();
  return new PersistentBookmarkEntity(
    id,
    0,
    pbClientEntity.getName(),
    originatorCacheGuid,
    originatorClientItemId,
    pbClientEntity.getUniquePosition(),
    pbClientEntity.getSpecifics(),
    pbClientEntity.getFolder(),
    parentId,
    pbClientEntity.getCtime(),
    pbClientEntity.getMtime()
  );
}

/* Factory function. 현재 ID에 해당하는 serverEntity는 PASS,
클라이언트가 항상 완전한 Entity를 전송하지 않으므로, 
새 Entity를 만들 때 기존의 Entity의 일부를 복사하여 생성하게 됨 */
// input type: sync_pb::SyncEntity, LoopbackServerEntity, string
function createUpdateVersion(pbClientEntity, currentServerEntity, parentId) {
  if (pbClientEntity.getVersion() == 0) {
    return undefined;
  }
  if (!isBookmark(pbClientEntity)) {
    return undefined;
  }
  const currentBookmarkEntity = currentServerEntity; // static_cast
  const originatorCacheGuid = currentBookmarkEntity.originatorCacheGuid;
  const originatorClientItemId = currentBookmarkEntity.originatorClientItemId;
  return new PersistentBookmarkEntity(
    pbClientEntity.getIdString(),
    0,
    pbClientEntity.getName(),
    originatorCacheGuid,
    originatorClientItemId,
    pbClientEntity.getUniquePosition(),
    pbClientEntity.getSpecifics(),
    pbClientEntity.getFolder(),
    parentId,
    pbClientEntity.getCtime(),
    pbClientEntity.getMtime()
  );
}

/* Factory function. Persistent Storage에 저장된 정보를 deserialize할 때 사용 */
function createFromEntity(pbClientEntity) {
  // sync_pb::SyncEntity
  if (!isBookmark(pbClientEntity)) {
    return undefined;
  }
  return new PersistentBookmarkEntity(
    pbClientEntity.getIdString(),
    pbClientEntity.getVersion(),
    pbClientEntity.getName(),
    pbClientEntity.getOriginatorCacheGuid(),
    pbClientEntity.getOriginatorClientItemId(),
    pbClientEntity.getUniquePosition(),
    pbClientEntity.getSpecifics(),
    pbClientEntity.getFolder(),
    pbClientEntity.getParentIdString(),
    pbClientEntity.getCtime(),
    pbClientEntity.getMtime()
  );
}

exports.PersistentBookmarkEntity = PersistentBookmarkEntity;

exports.createNew = createNew;
exports.createUpdateVersion = createUpdateVersion;
exports.createFromEntity = createFromEntity;
