const { assert } = require('console');
const path = require('path');
const workspaceDir = path.join(__dirname, '../../..');
let mt = require(path.join(workspaceDir, 'src/sync/model_type.js'));
const se = require(path.join(workspaceDir, 'src/sync/server_entity.js'));
const util = require(path.join(workspaceDir, 'src/sync/loopback/server_entity_static_api.js'));
let pbMessages = require(path.join(workspaceDir, 'google/protocol/loopback_server_pb'));

let pbSyncEntity = new proto.sync_pb.SyncEntity();
pbSyncEntity.setIdString('aaa');
pbSyncEntity.setParentIdString('bbb');
pbSyncEntity.setVersion(111);
pbSyncEntity.setCtime(100);
pbSyncEntity.setMtime(101);
pbSyncEntity.setName('entity name');
pbSyncEntity.setServerDefinedUniqueTag('server tag');  // Specifics의 Entity Type이 북마크일 경우 없어져야 되는 필드!
pbSyncEntity.setSpecifics(new proto.sync_pb.EntitySpecifics());

pbSyncEntity.getSpecifics().setBookmark(new proto.sync_pb.BookmarkSpecifics());

pbSyncEntity.getSpecifics().getBookmark().setTitle("북마크");
pbSyncEntity.getSpecifics().getBookmark().setUrl("http://111.111.11.11");

let pbLoopbackServerEntity = new proto.sync_pb.LoopbackServerEntity();
pbLoopbackServerEntity.setType(proto.sync_pb.LoopbackServerEntity.Type.BOOKMARK);
pbLoopbackServerEntity.setEntity(pbSyncEntity);
pbLoopbackServerEntity.setModelType(mt.ModelType.BOOKMARKS);
let entity = util.createEntityFromProto(pbLoopbackServerEntity);
// console.log(entity);

function checkSetValidEntity(bookmark) {  // for Persistent Bookmark Entity.
  assert(bookmark.id == pbSyncEntity.getIdString());
  assert(bookmark.modelType == mt.ModelType.BOOKMARKS);
  assert(bookmark.version == pbSyncEntity.getVersion());
  assert(bookmark.name == pbSyncEntity.getName())
  assert(bookmark.originatorCacheGuid == pbSyncEntity.getOriginatorCacheGuid());
  assert(bookmark.originatorClientItemId == pbSyncEntity.getOriginatorClientItemId());
  assert(bookmark.uniquePosition == pbSyncEntity.getUniquePosition());
  assert(bookmark.folder == pbSyncEntity.getFolder()); // default == false
  assert(bookmark.parentId == pbSyncEntity.getParentIdString());
  assert(bookmark.creationTime == pbSyncEntity.getCtime());
  assert(bookmark.lastModifiedTime == pbSyncEntity.getMtime());
  assert(bookmark.specifics.getBookmark().getTitle() == pbSyncEntity.getSpecifics().getBookmark().getTitle());
  assert(bookmark.specifics.getBookmark().getUrl() == pbSyncEntity.getSpecifics().getBookmark().getUrl());
  assert(bookmark.serverDefinedUniqueTag != pbSyncEntity.getServerDefinedUniqueTag());  // 북마크에 없는 필드값은 Loopback Server Entity변환될 때 추가하지 않음
};
checkSetValidEntity(entity);

let pbNewSyncEntity = new proto.sync_pb.SyncEntity();
pbNewSyncEntity = entity.serializeAsProto(pbNewSyncEntity);