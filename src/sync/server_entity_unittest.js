const { assert } = require('console');
const path = require('path');
const workspaceDir = path.join(__dirname, '../..');
const se = require(path.join(workspaceDir, 'src/sync/server_entity.js'));
let mt = require(path.join(workspaceDir, 'src/sync/model_type.js'));
let pbMessages = require(path.join(workspaceDir, 'google/protocol/loopback_server_pb'));

/* LoopbackServerEntity Test */
let lsEntity = new se.LoopbackServerEntity('lsid', mt.ModelType.BOOKMARKS);
const testInnerId = 'testInnderIdString';
let id = se.createId(mt.ModelType.BOOKMARKS, testInnerId);
assert(id == `${mt.getSpecificsFieldNumberFromModelType(mt.ModelType.BOOKMARKS)}_${testInnerId}`, 'Check: id generate method is changed');
assert(mt.ModelType.BOOKMARKS == se.getModelTypeFromId(id), 'Check: fieldNumber is different');
assert('32904_google_chrome_bookmarks' == se.getTopLevelId(mt.ModelType.BOOKMARKS));
lsEntity.setVersion(64);
lsEntity.setName('lsname');
lsEntity.setSpecifics(new proto.sync_pb.EntitySpecifics());

/* pure virtual methods
// lsEntity.requiresParentId();
// lsEntity.getParentId();
let syncEntity = syncEntityMsg.create();
//lsEntity.serializeAsProto(syncEntity);
//lsEntity.serializeAsLoopbackServerEntity(lsEntity2)
*/
assert(proto.sync_pb.LoopbackServerEntity.Type.UNKNOWN == lsEntity.getLoopbackServerEntityType());
assert(false == lsEntity.isDeleted());
assert(false == lsEntity.isFolder());
assert(false == lsEntity.isPermanent());

/* static */
// se.createEntityFromProto

