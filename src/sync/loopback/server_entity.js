//Loopback Server Entity.h
const assert = require('assert');
const path = require('path');
const workspaceDir = path.join(__dirname, '../../..');
let mt = require(path.join(workspaceDir, 'src/sync/base/model_type.js'));
require(path.join(workspaceDir, 'src/google/protocol/loopback_server_pb'));

class LoopbackServerEntity {
  constructor(id, modelType, version, name) {
    this.id = id;               //entity's ID
    this.modelType = modelType; //entity's mt.ModelType
    this.version = + new Date();//version;     //entity's version
    this.name = name;           //entity's name
  }

  setVersion(version) {  //int64_t
    this.version = version;
  }

  setName(name) {  //string
    this.name = name;
  }

  setSpecifics(specifics) {  //sync_pb::EntitySpecifics
    assert(typeof (specifics) == typeof (new proto.sync_pb.EntitySpecifics()));
    this.specifics = specifics;
  }

  requiresParentId() {
    assert(false, "Pure Virtual Method");
  }

  getParentId() {
    assert(false, "Pure Virtual Method");
  }

  serializeAsProto(pbSyncEntity) {
    assert(false, "Pure Virtual Method");
  }

  getLoopbackServerEntityType() {
    console.error('\x1b[31m%s\x1b[0m', 'Not Reached');
    return proto.sync_pb.LoopbackServerEntity.Type.UNKNOWN;
  }

  isDeleted() {
    return false;
  }

  isFolder() {
    return false;
  }

  isPermanent() {
    return false;
  }

  /* return value: sync_pb::LoopbackServerEntity */
  serializeAsLoopbackServerEntity(pbLoopbackServerEntity) {
    pbLoopbackServerEntity.setType(this.getLoopbackServerEntityType());
    pbLoopbackServerEntity.setModelType(this.modelType);
    pbLoopbackServerEntity.setEntity(new proto.sync_pb.SyncEntity());
    this.serializeAsProto(pbLoopbackServerEntity.getEntity());
  }

  // protected
  serializeBaseProtoFields(pbSyncEntity) {
    /* Check: new proto.sync_pb.SyncEntity(this.specifics)로 사용X
    Local Function 벗어나면 undefined되는 문제 있음 */
    pbSyncEntity.setSpecifics(this.specifics);
    // Loopback Server Entity Field
    pbSyncEntity.setIdString(this.id);
    pbSyncEntity.setVersion(this.version);
    pbSyncEntity.setName(this.name);
    // Data via accessors
    pbSyncEntity.setDeleted(this.isDeleted());
    pbSyncEntity.setFolder(this.isFolder());
    if (this.requiresParentId()) {
      pbSyncEntity.setParentIdString(this.getParentId());
    }
  }
};

/* static */
function createId(modelType, innerId) {
  let fieldNumber = mt.getSpecificsFieldNumberFromModelType(modelType);
  return fieldNumber + '_' + innerId; //아마도 테스트니까 나중에 바꿔야 될 듯
};

/* static */
function getTopLevelId(modelType) {
  return this.createId(modelType, mt.modelTypeToRootTag(modelType));
};

/* static */
function getModelTypeFromId(id) {//string //createId로 생성된 Id
  //base::SplitStringPiece(id, '_', KEEP_WHITESPACE, SPLIT_WANT_NONEMPTY);
  // TODO: 이렇게만 쪼개면 되는게 맞는지 확인 필요함... 아마 맞을 듯
  let tokens = id.split('_');
  let fieldNumber = parseInt(tokens[0]);
  if (tokens.length != 2 || isNaN(fieldNumber)) {
    return mt.ModelType.UNSPECIFIED;
  }
  return mt.getModelTypeFromSpecificsFieldNumber(fieldNumber);
};

exports.LoopbackServerEntity = LoopbackServerEntity;

exports.createId = createId;
exports.getTopLevelId = getTopLevelId;
exports.getModelTypeFromId = getModelTypeFromId;
