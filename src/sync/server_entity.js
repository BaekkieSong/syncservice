//Loopback Server Entity.h
const assert = require('assert');
const path = require('path');
const workspaceDir = path.join(__dirname, '../..');
let mt = require(path.join(workspaceDir, 'src/sync/model_type.js'));
let pbMessages = require(path.join(workspaceDir, 'google/protocol/loopback_server_pb'));

class LoopbackServerEntity {
  constructor(id, modelType, version, name) {
    this.id = id;//entity's ID
    this.modelType = modelType;//entity's mt.ModelType
    this.version = version;//entity's version
    this.name = name;//entity's name
  }

  setVersion(version) { //int64_t
    this.version = version;
  }
  setName(name) { //string
    this.name = name;
  }
  setSpecifics(specifics) { //sync_pb::EntitySpecifics
    assert(typeof (specifics) == typeof (new proto.sync_pb.EntitySpecifics()));
    this.specifics = specifics;
  }
  requiresParentId() {
    assert(false, "Pure Virtual Method");
    //return bool
  }
  getParentId() {
    assert(false, "Pure Virtual Method");
    //return string
  }
  serializeAsProto(pbSyncEntity) {
    assert(false, "Pure Virtual Method");
    //return void;
  }
  getLoopbackServerEntityType() {
    //assert(false, "NOT REACHED");
    return proto.sync_pb.LoopbackServerEntity.Type.UNKNOWN;
    // return sync_pb::LoopbackServerEntity.Type
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
  serializeAsLoopbackServerEntity(pbLoopbackServerEntity) { //sync_pb::LoopbackServerEntity
    pbLoopbackServerEntity.setType(this.getLoopbackServerEntityType()); //상속받은애꺼 잘 호출하는지 확인!
    pbLoopbackServerEntity.setModelType(this.modelType);
    pbLoopbackServerEntity.setEntity(new proto.sync_pb.Entity());
    this.serializeAsProto(pbLoopbackServerEntity.entity); //entity->mutable_entity()
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
    pbSyncEntity.setDeleted(this.isDeleted());  // Tombstone의 경우 자신의 isDeleted, 즉 true값을 리턴해야 됨. 잘 리턴하는지 확인 필요
    pbSyncEntity.setFolder(this.isFolder());    // 역시 상속받은 애의 API가 잘 호출되는지 확인 필요
    if (this.requiresParentId()) {
      pbSyncEntity.setParentIdString(this.getParentId());
    }
  }
};

/* static */
function createId(modelType, innerId) {
  let fieldNumber = mt.getSpecificsFieldNumberFromModelType(modelType);
  return fieldNumber + '_' + innerId; //아마도 테스트니까 나중에 바꿔야 될 듯
  //return string //
}

/* static */
function getTopLevelId(modelType) {
  return this.createId(modelType, mt.modelTypeToRootTag(modelType)); // NIGORI의 경우 41_google_chrome_nigori를 리턴함
  //return string //return top level node id
}

/* static */
function getModelTypeFromId(id) {//string //createId로 생성된 Id인 듯
  //let tokens = [];//base::SplitStringPiece(id, '_', KEEP_WHITESPACE, SPLIT_WANT_NONEMPTY);
  let tokens = id.split('_');  // TODO: 이렇게만 쪼개면 되는게 맞는지 확인은 필요함... 아마 맞을 듯
  let fieldNumber = parseInt(tokens[0]);
  //assert(tokens.length != 2, `tokens[0]: ${tokens[0]}, tokens[1]: ${tokens[1]}`);
  if (tokens.length != 2 || isNaN(fieldNumber)) {
    return mt.ModelType.UNSPECIFIED;
  }
  return mt.getModelTypeFromSpecificsFieldNumber(fieldNumber);
};

//let en = new LoopbackServerEntity();




exports.LoopbackServerEntity = LoopbackServerEntity;

exports.createId = createId;
exports.getTopLevelId = getTopLevelId;
exports.getModelTypeFromId = getModelTypeFromId;
