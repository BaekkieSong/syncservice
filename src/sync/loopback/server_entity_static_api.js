/* global proto */
const path = require("path");
const workspaceDir = path.join(__dirname, "../../..");
let mt = require(path.join(workspaceDir, "src/sync/base/model_type.js"));
require(path.join(workspaceDir, "src/google/protocol/loopback_server_pb"));
const bookmark = require(path.join(
  workspaceDir,
  "src/sync/loopback/persistent_bookmark_entity.js"
));
const permanent = require(path.join(
  workspaceDir,
  "src/sync/loopback/persistent_permanent_entity.js"
));
const tombstone = require(path.join(
  workspaceDir,
  "src/sync/loopback/persistent_tombstone_entity.js"
));
const uniqueClient = require(path.join(
  workspaceDir,
  "src/sync/loopback/persistent_unique_client_entity.js"
));

/* static */
//sync_pb::LoopbackServerEntity
function createEntityFromProto(pbLoopbackServerEntity) {
  switch (pbLoopbackServerEntity.getType()) {
    case proto.sync_pb.LoopbackServerEntity.Type.TOMBSTONE:
      return tombstone.createFromEntity(pbLoopbackServerEntity.getEntity());
    case proto.sync_pb.LoopbackServerEntity.Type.PERMANENT:
      return new permanent.PersistentPermanentEntity(
        pbLoopbackServerEntity.getEntity().getIdString(),
        pbLoopbackServerEntity.getEntity().getVersion(),
        mt.getModelType(pbLoopbackServerEntity.getEntity()),
        pbLoopbackServerEntity.getEntity().getName(),
        pbLoopbackServerEntity.getEntity().getParentIdString(),
        pbLoopbackServerEntity.getEntity().getServerDefinedUniqueTag(),
        pbLoopbackServerEntity.getEntity().getSpecifics()
      );
    case proto.sync_pb.LoopbackServerEntity.Type.BOOKMARK:
      return bookmark.createFromEntity(pbLoopbackServerEntity.getEntity());
    case proto.sync_pb.LoopbackServerEntity.Type.UNIQUE:
      return uniqueClient.createFromEntity(pbLoopbackServerEntity.getEntity());
    case proto.sync_pb.LoopbackServerEntity.Type.UNKNOWN:
      console.error("\x1b[35m%s\x1b[0m", "Not Reached: Unknown type");
      return "";
  }
  return "";
}

exports.createEntityFromProto = createEntityFromProto;
