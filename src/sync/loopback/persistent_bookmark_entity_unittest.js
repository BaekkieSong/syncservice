const { assert } = require('console');
const path = require('path');
const workspaceDir = path.join(__dirname, '../../..');
let mt = require(path.join(workspaceDir, 'src/sync/base/model_type.js'));
const se =
  require(path.join(workspaceDir, 'src/sync/loopback/server_entity.js'));
const util = require(path.join(
  workspaceDir, 'src/sync/loopback/server_entity_static_api.js'));
require(path.join(workspaceDir, 'src/google/protocol/loopback_server_pb'));

let pbSyncEntity = new proto.sync_pb.SyncEntity();
pbSyncEntity.setIdString('aaa');
pbSyncEntity.setParentIdString('bbb');
pbSyncEntity.setVersion(111);
pbSyncEntity.setCtime(100);
pbSyncEntity.setMtime(101);
pbSyncEntity.setName('entity name');
pbSyncEntity.setSpecifics(new proto.sync_pb.EntitySpecifics());
// Specifics의 Entity Type이 북마크일 경우 없어져야 되는 필드!
pbSyncEntity.setServerDefinedUniqueTag('server tag');

pbSyncEntity.getSpecifics().setBookmark(new proto.sync_pb.BookmarkSpecifics());

pbSyncEntity.getSpecifics().getBookmark().setTitle("북마크");
pbSyncEntity.getSpecifics().getBookmark().setUrl("http://111.111.11.11");
// pbSyncEntity.setFolder(true);

let pbLoopbackServerEntity = new proto.sync_pb.LoopbackServerEntity();
pbLoopbackServerEntity.setType(
  proto.sync_pb.LoopbackServerEntity.Type.BOOKMARK);
pbLoopbackServerEntity.setEntity(pbSyncEntity);
pbLoopbackServerEntity.setModelType(mt.ModelType.BOOKMARKS);
let entity = util.createEntityFromProto(pbLoopbackServerEntity);
// console.log(entity);

// Check for Persistent Bookmark Entity.
function checkSetValidEntity(lsEntity, pbEntity) {
  assert(lsEntity.id == pbSyncEntity.getIdString());
  assert(lsEntity.modelType == mt.ModelType.BOOKMARKS);
  assert(lsEntity.version == pbSyncEntity.getVersion());
  assert(lsEntity.name == pbSyncEntity.getName());
  assert(lsEntity.originatorCacheGuid == pbSyncEntity.getOriginatorCacheGuid());
  assert(lsEntity.originatorClientItemId ==
    pbSyncEntity.getOriginatorClientItemId());
  assert(lsEntity.uniquePosition == pbSyncEntity.getUniquePosition());
  assert(lsEntity.folder == pbSyncEntity.getFolder());  // default == false
  assert(lsEntity.parentId == pbSyncEntity.getParentIdString());
  assert(lsEntity.creationTime == pbSyncEntity.getCtime());
  assert(lsEntity.lastModifiedTime == pbSyncEntity.getMtime());
  assert(lsEntity.specifics.getBookmark().getTitle() ==
    pbSyncEntity.getSpecifics().getBookmark().getTitle());
  assert(lsEntity.specifics.getBookmark().getUrl() ==
    pbSyncEntity.getSpecifics().getBookmark().getUrl());
  // 북마크에 없는 필드값은 Loopback Server Entity변환될 때 추가하지 않음
  assert(lsEntity.serverDefinedUniqueTag !=
    pbSyncEntity.getServerDefinedUniqueTag());
};
checkSetValidEntity(entity, pbSyncEntity);
let pbNewSyncEntity = new proto.sync_pb.SyncEntity();
entity.serializeAsProto(pbNewSyncEntity);
checkSetValidEntity(entity, pbNewSyncEntity);

let pbNewLoopbackServerEntity = new proto.sync_pb.LoopbackServerEntity();
entity.serializeAsLoopbackServerEntity(pbNewLoopbackServerEntity);
assert(pbNewLoopbackServerEntity.getType() ==
  proto.sync_pb.LoopbackServerEntity.Type.BOOKMARK);
assert(pbNewLoopbackServerEntity.getModelType() == mt.ModelType.BOOKMARKS);
assert(pbNewLoopbackServerEntity.getEntity().getSpecifics().hasBookmark());

