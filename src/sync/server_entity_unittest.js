const { assert } = require('console');
const path = require('path');
const workspaceDir = path.join(__dirname, '../..');

const se = require(path.join(workspaceDir, 'src/sync/server_entity.js'));
let mt = require(path.join(workspaceDir, 'src/sync/model_type.js'));

let sync_pb = require(path.join(workspaceDir, 'src/google/protobufjs/proto_process.js'));
let pb = new sync_pb();
let loopbackServerProto = pb.getLoopbackServerProto();  //sync.proto파일 Load
let pbLoopbackServerEntityMsg = loopbackServerProto.root.lookupType('sync_pb.LoopbackServerEntity');
let proto = pb.getSyncProto();
let pbEntitySpecificsMsg = proto.root.lookupType('sync_pb.EntitySpecifics');
let pbSyncEntityMsg = proto.root.lookupType('sync_pb.SyncEntity');
const Type = pbLoopbackServerEntityMsg.getEnum('Type');

/* LoopbackServerEntity Test */
let lsEntity = new se.LoopbackServerEntity('lsid', mt.ModelType.BOOKMARKS);
const testInnerId = 'testInnderIdString';
let id = se.createId(mt.ModelType.BOOKMARKS, testInnerId);
assert(id == `${mt.getSpecificsFieldNumberFromModelType(mt.ModelType.BOOKMARKS)}_${testInnerId}`, 'Check: id generate method is changed');
assert(mt.ModelType.BOOKMARKS == lsEntity.getModelTypeFromId(id), 'Check: fieldNumber is different')
assert('32904_google_chrome_bookmarks' == se.getTopLevelId(mt.ModelType.BOOKMARKS));
console.log(lsEntity.id, lsEntity.modelType, lsEntity.version, lsEntity.name, lsEntity.specifics)
lsEntity.setVersion(64);
lsEntity.setName('lsname')
lsEntity.setSpecifics(111)
console.log(lsEntity.id, lsEntity.modelType, lsEntity.version, lsEntity.name, lsEntity.specifics)
/* pure virtual methods
// lsEntity.requiresParentId();
// lsEntity.getParentId();
let syncEntity = syncEntityMsg.create();
//lsEntity.serializeAsProto(syncEntity);
//lsEntity.serializeAsLoopbackServerEntity(lsEntity2)
*/
assert(Type.UNKNOWN == lsEntity.getLoopbackServerEntityType());
assert(false == lsEntity.isDeleted());
assert(false == lsEntity.isFolder());
assert(false == lsEntity.isPermanent());

/* static */
// se.createEntityFromProto

