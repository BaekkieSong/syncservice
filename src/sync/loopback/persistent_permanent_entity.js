const assert = require('assert');
const path = require('path');
const workspaceDir = path.join(__dirname, '../../..');
let mt = require(path.join(workspaceDir, 'src/sync/model_type.js'));
const se = require(path.join(workspaceDir, "src/sync/server_entity.js"));
let pbMessages = require(path.join(workspaceDir, 'google/protocol/loopback_server_pb'));

const kRootParentTag = "0";

/* PersistentPermanentEntity */
class PersistentPermanentEntity extends se.LoopbackServerEntity {
  constructor(
    id,                     // string
    version,                // int64_t
    modelType,              // ModelType
    name,                   // string
    parentId,               // string
    serverDefinedUniqueTag, // string
    pbEntitySpecifics,        // entitySpecifics
  ) {
    super(id, modelType, version, name);
    this.parentId = parentId;
    this.serverDefinedUniqueTag = serverDefinedUniqueTag;
    this.setSpecifics(pbEntitySpecifics);
  }

  /* override */
  requiresParentId() {
    return true;
    // return bool;
  }

  /* override */
  getParentId() {
    return this.parentId;
    // return string
  }

  /* override */
  serializeAsProto(pbSyncEntity) { // sync_pb::SyncEntity
    this.serializeBaseProtoFields(pbSyncEntity);
    pbSyncEntity.setServerDefinedUniqueTag(this.serverDefinedUniqueTag);
    // void. but return pbSyncEntity
    return pbSyncEntity;
  }

  /* override */
  isFolder() {
    return true;
    // return bool
  }

  /* override */
  isPermanent() {
    return true;
    // return bool
  }

  /* override */
  getLoopbackServerEntityType() {
    return proto.sync_pb.LoopbackServerEntity.Type.PERMANENT;
    // return sync_pb::loopbackServerEntity's Type
  }
};

/* static */
/* Factory function. ServerTag는 전역적으로 유일해야 함 */
function createNew(modelType, serverTag, name, parentServerTag) {  // ModelType, string, string, string
  if (modelType == mt.ModelType.UNSPECIFIED) {
    console.error('\x1b[35m%s\x1b[0m', "The entity's ModelType is invalid.");
    return undefined;
  };
  if (serverTag == "") {
    console.error('\x1b[35m%s\x1b[0m', "A PersistentPermanentEntity must have a server tag.");
    return undefined;
  };
  if (name == "") {
    console.error('\x1b[35m%s\x1b[0m', "The entity must have a non-empty name.");
    return undefined;
  };
  if (parentServerTag == "") {
    console.error('\x1b[35m%s\x1b[0m', "A PersistentPermanentEntity must have a parent server tag.");
    return undefined;
  };
  if (parentServerTag == kRootParentTag) {
    console.error('\x1b[35m%s\x1b[0m', "Top-level entities should not be created with this factory.");
    return undefined;
  };
  let id = se.createId(modelType, serverTag);
  let parentId = se.createId(modelType, parentServerTag);
  let pbEntitySpecifics = new proto.sync_pb.EntitySpecifics();
  mt.addDefaultFieldValue(modelType, pbEntitySpecifics);
  return new PersistentPermanentEntity(
    id, 0, modelType, name, parentId, serverTag, pbEntitySpecifics);
  // return unique<loopbackServerEntity>
};

/* Top Level PersistentPermanentEntity 생성. 즉, 이 Entity의 부모가 root Entity. 
(root에 대한 PersistentPermanentEntity는 존재하지 않음) */
function createTopLevel(modelType) {  // ModelType
  if (modelType == mt.ModelType.UNSPECIFIED) {
    console.error('\x1b[35m%s\x1b[0m', "The entity's ModelType is invalid.");
    return undefined;
  };
  let serverTag = mt.modelTypeToRootTag(modelType);
  let name = mt.modelTypeToString(modelType);
  let id = se.getTopLevelId(modelType);
  let pbEntitySpecifics = new proto.sync_pb.EntitySpecifics();
  mt.addDefaultFieldValue(modelType, pbEntitySpecifics);
  return new PersistentPermanentEntity(
    id, 0, modelType, name, kRootParentTag, serverTag, pbEntitySpecifics);
  // return unique<loopbackServerEntity>
}

/* Factory function. 현재 ID에 해당하는 serverEntity는 PASS,
클라이언트가 항상 완전한 Entity를 전송하지 않으므로, 새 Entity를 만들 때 기존의 Entity의 일부를 복사하여 생성하게 됨 */
function createUpdatedNigoriEntity(pbClientEntity, currentServerEntity) { // sync_pb::SyncEntity, LoopbackServerEntity
  let modelType = currentServerEntity.getModelType();
  if (modelType != mt.ModelType.NIGORI) {
    console.error('\x1b[35m%s\x1b[0m', "This factory only supports NIGORI entities.");
    return undefined;
  };
  return new PersistentPermanentEntity(
    currentServerEntity.id, currentServerEntity.version, modelType, 
    currentServerEntity.name, currentServerEntity.parentId,
    mt.modelTypeToRootTag(modelType), pbClientEntity.getSpecifics());
  // return unique<loopbackServerEntity>
};

exports.PersistentPermanentEntity = PersistentPermanentEntity;

exports.createNew = createNew;
exports.createTopLevel = createTopLevel;
exports.createUpdatedNigoriEntity = createUpdatedNigoriEntity;