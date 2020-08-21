const assert = require('assert');
const path = require('path');
const workspaceDir = path.join(__dirname, '../../..');
let mt = require(path.join(workspaceDir, 'src/sync/model_type.js'));
let pbMessages = require(path.join(workspaceDir, 'google/protocol/loopback_server_pb'));
const bookmark = require(path.join(workspaceDir, 'src/sync/loopback/persistent_bookmark_entity.js'));
const permanent = require(path.join(workspaceDir, 'src/sync/loopback/persistent_permanent_entity.js'));
const tombstone = require(path.join(workspaceDir, 'src/sync/loopback/persistent_tombstone_entity.js'));
const uniqueClient = require(path.join(workspaceDir, 'src/sync/loopback/persistent_unique_client_entity.js'));

/* static */
function createEntityFromProto(pbLoopbackServerEntity) { //sync_pb::LoopbackServerEntity
  switch (pbLoopbackServerEntity.getType()) {
    case proto.sync_pb.LoopbackServerEntity.Type.TOMBSTONE:
      return tombstone.createFromEntity(pbLoopbackServerEntity.getEntity());
    case proto.sync_pb.LoopbackServerEntity.Type.PERMANENT:
      return new permanent.PersistentPermanentEntity(
        pbLoopbackServerEntity.getEntity().getIdString(), pbLoopbackServerEntity.getEntity().getVersion(),
        mt.getModelType(pbLoopbackServerEntity.getEntity()), pbLoopbackServerEntity.getEntity().getName(),
        pbLoopbackServerEntity.getEntity().getParentIdString(),
        pbLoopbackServerEntity.getEntity().getServerDefinedUniqueTag(),
        pbLoopbackServerEntity.getEntity().getSpecifics());
    case proto.sync_pb.LoopbackServerEntity.Type.BOOKMARK:
      return bookmark.createFromEntity(pbLoopbackServerEntity.getEntity());
    case proto.sync_pb.LoopbackServerEntity.Type.UNIQUE:
      return uniqueClient.createFromEntity(pbLoopbackServerEntity.getEntity());
    case proto.sync_pb.LoopbackServerEntity.Type.UNKNOWN:
      // assert(false, "Unknown type encountered");//NOT REACHED
      return "";
  }
  return "";
  // return LoopbackServerEntity
}
//let en = new LoopbackServerEntity();

exports.createEntityFromProto = createEntityFromProto;