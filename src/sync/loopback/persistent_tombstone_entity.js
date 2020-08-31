const assert = require('assert');
const path = require('path');
const workspaceDir = path.join(__dirname, '../../..');
let mt = require(path.join(workspaceDir, 'src/sync/base/model_type.js'));
const se =
  require(path.join(workspaceDir, "src/sync/loopback/server_entity.js"));
require(path.join(workspaceDir, 'src/google/protocol/loopback_server_pb'));

const kRootParentTag = "0";

/* PersistentTombstoneEntity */
class PersistentTombstoneEntity extends se.LoopbackServerEntity {
  constructor(
    id,                     // string
    version,                // int64_t
    modelType,              // ModelType
    clientDefinedUniqueTag  // string
  ) {
    super(id, modelType, version, "");
    this.clientDefinedUniqueTag = clientDefinedUniqueTag;
  }

  /* override */
  requiresParentId() {
    return false;
  }

  /* override */
  getParentId() {
    return "";
  }

  /* override */
  serializeAsProto(pbSyncEntity) {  // sync_pb::SyncEntity
    this.serializeBaseProtoFields(pbSyncEntity);
    if (this.clientDefinedUniqueTag != "") {
      pbSyncEntity.setClientDefinedUniqueTag(this.clientDefinedUniqueTag);
    };
  }

  /* override */
  isDeleted() {
    return true;
  }

  /* override */
  getLoopbackServerEntityType() {
    return proto.sync_pb.LoopbackServerEntity.Type.TOMBSTONE;
  }
};

/* static & private */
// input type: string, int64_t, string
function createNewInternal(id, version, clientDefinedUniqueTag) {
  const modelType = se.getModelTypeFromId(id);
  if (modelType == mt.ModelType.UNSPECIFIED) {
    console.error('\x1b[31m%s\x1b[0m', "Invalid ID was given:", id);
    return undefined;
  };
  return new PersistentTombstoneEntity(
    id, version, modelType, clientDefinedUniqueTag);
};

/* static */
/* Factory function. ServerTag는 전역적으로 유일해야 함 */
function createNew(id, clientDefinedUniqueTag) {  // string, string
  return createNewInternal(id, 0, clientDefinedUniqueTag);
};

/* Top Level PersistentTombstoneEntity 생성. 즉, 이 Entity의 부모가 root Entity.
(root에 대한 PersistentTombstoneEntity는 존재하지 않음) */
function createFromEntity(pbSyncEntity) {  // sync_pb::SyncEntity
  return createNewInternal(
    pbSyncEntity.getIdString(), pbSyncEntity.getVersion(),
    pbSyncEntity.getClientDefinedUniqueTag());
};

exports.PersistentTombstoneEntity = PersistentTombstoneEntity;

exports.createNew = createNew;
exports.createFromEntity = createFromEntity;