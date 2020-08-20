//Loopback Server Entity.h

const assert = require('assert');
const path = require('path');
const workspaceDir = path.join(__dirname, '../..');
let mt = require(path.join(workspaceDir, 'src/sync/model_type.js'));
let sync_pb = require(path.join(workspaceDir, 'src/google/protobufjs/proto_process.js'));
let pb = new sync_pb();
let loopbackServerProto = pb.getLoopbackServerProto();  //sync.proto파일 Load
let pbLoopbackServerEntityMsg = loopbackServerProto.root.lookupType('sync_pb.LoopbackServerEntity');
let proto = pb.getSyncProto();
let pbEntitySpecificsMsg = proto.root.lookupType('sync_pb.EntitySpecifics');
let pbSyncEntityMsg = proto.root.lookupType('sync_pb.SyncEntity');
const Type = pbLoopbackServerEntityMsg.getEnum('Type');

class LoopbackServerEntity {
  constructor(id, modelType, version, name) {
    this.id = id;//entity's ID
    this.modelType = modelType;//entity's mt.ModelType
    this.version = version;//entity's version
    this.name = name;//entity's name
    //this.specifics // entity's EntitySpecifics
  }

  setVersion(version) { //int64_t
    this.version = version;
  }
  setName(name) { //string
    this.name = name;
  }
  setSpecifics(specifics) { //sync_pb::EntitySpecifics
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
    return Type.UNKNOWN;
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
    pbLoopbackServerEntity.type = this.getLoopbackServerEntityType(); //상속받은애꺼 잘 호출하는지 확인!
    pbLoopbackServerEntity.modelType = this.modelType;
    pbLoopbackServerEntity.entity = pbSyncEntityMsg.create();
    this.serializeAsProto(pbLoopbackServerEntity.entity); //entity->mutable_entity()
  }

  // protected
  serializeBaseProtoFields(pbSyncEntity) {
    let pbEntitySpecifics = pbEntitySpecificsMsg.create(this.specifics.toJSON());
    pbSyncEntity.specifics = pbEntitySpecifics; //CopyFrom
    // Loopback Server Entity Field 
    pbSyncEntity.idString = this.id;
    pbSyncEntity.version = this.version;
    pbSyncEntity.name = this.name;
    // Data via accessors
    pbSyncEntity.deleted = this.isDeleted();  // Tombstone의 경우 자신의 isDeleted, 즉 true값을 리턴해야 됨. 잘 리턴하는지 확인 필요
    pbSyncEntity.folder = this.isFolder();    // 역시 상속받은 애의 API가 잘 호출되는지 확인 필요
    if (this.requiresParentId()) {
      pbSyncEntity.parentIdString = this.getParentId(); //응 얘두
    }
    //reutnr void
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
function createEntityFromProto(pbLoopbackServerEntity) { //sync_pb::LoopbackServerEntity
  switch (pbLoopbackServerEntity.type) {
    case Type.TOMBSTONE:
      return createTombstoneEntityFromEntity(pbLoopbackServerEntity.entity);
    case Type.PERMANENT:
      return new PersistentPermanentEntity(
        pbLoopbackServerEntity.entity.idString, pbLoopbackServerEntity.entity.version,
        mt.getModelType(pbLoopbackServerEntity.entity), pbLoopbackServerEntity.entity.name,
        pbLoopbackServerEntity.entity.parentIdString,
        pbLoopbackServerEntity.entity.serverDefinedUniqueTag,
        pbLoopbackServerEntity.entity.specifics);
    case Type.BOOKMARK:
      return createBookmarkEntityFromEntity(pbLoopbackServerEntity.entity);
    case Type.UNIQUE:
      return createUniqueEntityFromEntity(pbLoopbackServerEntity.entity);
    case Type.UNKNOWN:
      // assert(false, "Unknown type encountered");//NOT REACHED
      return "";
  }
  return "";
  // return LoopbackServerEntity
};
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
//exports.createEntityFromProto = createEntityFromProto;

exports.loopbackServerProto = loopbackServerProto;
exports.proto = proto;
