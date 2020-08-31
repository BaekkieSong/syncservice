const assert = require('assert');
const path = require('path');
const workspaceDir = path.join(__dirname, '../../..');
let mt = require(path.join(workspaceDir, 'src/sync/base/model_type.js'));
const se =
  require(path.join(workspaceDir, "src/sync/loopback/server_entity.js"));
require(path.join(workspaceDir, 'src/google/protocol/loopback_server_pb'));

const kRootParentTag = "0";

/* PersistentUniqueClientEntity */
class PersistentUniqueClientEntity extends se.LoopbackServerEntity {
  constructor(
    id,                     // string
    version,                // int64_t
    modelType,              // ModelType
    name,                   // string
    clientDefinedUniqueTag, // string
    pbEntitySpecifics,      // sync_pb::EntitySpecifics
    creationTime,           // int64_t
    lastModifiedTime        // int64_t
  ) {
    super(id, modelType, version, name);
    this.clientDefinedUniqueTag = clientDefinedUniqueTag;
    this.creationTime = creationTime;
    this.lastModifiedTime = lastModifiedTime;
    this.setSpecifics(pbEntitySpecifics);
  }

  /* override */
  requiresParentId() {
    return false;
  }

  /* override */
  getParentId() {
    return se.getTopLevelId(this.modelType);
  }

  /* override */
  serializeAsProto(pbSyncEntity) {  // sync_pb::SyncEntity
    this.serializeBaseProtoFields(pbSyncEntity);
    pbSyncEntity.setClientDefinedUniqueTag(this.clientDefinedUniqueTag);
    pbSyncEntity.setCtime(this.creationTime);
    pbSyncEntity.setMtime(this.lastModifiedTime);
  }

  /* override */
  getLoopbackServerEntityType() {
    return proto.sync_pb.LoopbackServerEntity.Type.UNIQUE;
  }
};

const MIN = 0;
const MAX = 18446744073709551615;

/* static */
/* Factory function. PersistentUniqueClientEntity 생성 */
function createFromEntity(pbClientEntity) {  // sync_pb::SyncEntity
  let modelType = mt.getModelTypeFromSpecifics(pbClientEntity.getSpecifics());
  if (pbClientEntity.hasClientDefinedUniqueTag() ==
    mt.commitOnlyTypes.has(modelType)) {
    console.error('\x1b[31m%s\x1b[0m',
      `A UniqueClientEntity should have a client-defined unique tag
      if it is not a CommitOnly type.`);
    return undefined;
  };
  /* 각 CommitOnly Type에 대한 ModelType Specifics 로직이 없으면
  세부 사항에서 합리적인 태그를 추론 할 수 없음.
  서버가 모든 객체를 유지하는 방식에 대한 고유성이 필요하므로
  임의의 숫자에서 새 태그 만듦. */
  let effectiveTag = pbClientEntity.hasClientDefinedUniqueTag()
    ? pbClientEntity.getClientDefinedUniqueTag()
    : (Math.random() * (MAX - MIN) + MIN);
  let id = se.createId(modelType, effectiveTag);
  return new PersistentUniqueClientEntity(
    id, modelType, pbClientEntity.getVersion(), pbClientEntity.getName(),
    pbClientEntity.getClientDefinedUniqueTag(), pbClientEntity.getSpecifics(),
    pbClientEntity.getCtime(), pbClientEntity.getMtime());
};

/* Factory function. FakeServer injection API에서 사용하기 위한
PersistentUniqueClientEntity 생성 */
// input type: string, sync_pb::EntitySpecifics, int64_t, int64_t
function createFromEntitySpecifics(
  name, pbEntitySpecifics, creationTime, lastModifiedTime) {
  let modelType = mt.getModelTypeFromSpecifics(pbEntitySpecifics);
  let clientDefinedUniqueTag = hashUtil.generateSyncableHash(modelType, name);
  let id = se.createId(modelType, clientDefinedUniqueTag);
  return new PersistentUniqueClientEntity(
    id, modelType, 0, name, clientDefinedUniqueTag,
    pbEntitySpecifics, creationTime, lastModifiedTime);
};

exports.PersistentUniqueClientEntity = PersistentUniqueClientEntity;

exports.createFromEntity = createFromEntity;
exports.createFromEntitySpecifics = createFromEntitySpecifics;