const path = require('path');
const { assert } = require('console');
const workspaceDir = path.join(__dirname, '../..');
let mt = require(path.join(workspaceDir, 'src/sync/model_type.js'));
let pbMessages = require(path.join(workspaceDir, 'google/protocol/sync_pb'));

assert(44 == Object.entries(mt.ModelType).length, `ModelType length is ${Object.entries(mt.ModelType).length}`)
// assert(Object.entries(mt.getModelTypeName()).length == Object.entries(mt.ModelType).length)  // 키-값 switch 관계. length == 44
assert(43 == mt.ModelType.MODEL_TYPE_COUNT, "kModelTypeInfoMap should have MODEL_TYPE_COUNT elements");

// console.log('infomap:', mt.getModelTypeInfoMap().get(41))
assert(mt.getModelTypeInfoMap().get(41).modelType == mt.ModelType.NIGORI);
assert(mt.getModelTypeInfoMap().get(41).getSpecificsFieldName() == 'nigori')
assert(mt.getModelTypeNameFromModelType(mt.ModelType.BOOKMARKS) == 'BOOKMARKS')
assert(mt.getModelTypeNameFromModelType(mt.ModelType.NIGORI) == 'NIGORI')

/* Protobuf Issue Check */
let pbEntitySpecifics = new proto.sync_pb.EntitySpecifics();
pbEntitySpecifics.setExtension$(new proto.sync_pb.ExtensionSpecifics()) // TODO: Protobuf Static Generate Issue: '$' is added.
assert(pbEntitySpecifics.hasExtension$());
pbEntitySpecifics.clearExtension$();
assert(pbEntitySpecifics.getExtension$() == undefined);

let pbSyncEntity = new proto.sync_pb.SyncEntity();
pbSyncEntity.setSpecifics(pbEntitySpecifics);
// TODO: 절대 아래줄처럼 사용X! Local Func 벗어날 때 설정값이 지워지는 문제 있음
// new proto.sync_pb.EntitySpecifics(pbEntitySpecifics))
assert(pbSyncEntity.hasSpecifics())
pbEntitySpecifics.setExtension$(new proto.sync_pb.ExtensionSpecifics())
assert(pbSyncEntity.getSpecifics().hasExtension$())
mt.addDefaultFieldValue(mt.ModelType.BOOKMARKS, pbSyncEntity.getSpecifics());
assert(mt.getModelType(pbSyncEntity) == mt.ModelType.BOOKMARKS);
mt.addDefaultFieldValue(mt.ModelType.NIGORI, pbSyncEntity.getSpecifics());
assert(mt.getModelType(pbSyncEntity) != mt.ModelType.BOOKMARKS);
assert(mt.getModelType(pbSyncEntity) == mt.ModelType.NIGORI);

assert(mt.isUserSelectableType(mt.ModelType.BOOKMARKS) == true);
assert(mt.isUserSelectableType(mt.ModelType.NIGORI) == false);
assert(mt.isControlType(mt.ModelType.NIGORI) == true);
assert(mt.isControlType(mt.ModelType.EXPERIMENTS) == true);
assert(mt.isControlType(mt.ModelType.BOOKMARKS) == false);

assert(mt.getModelTypeFromSpecificsFieldNumber(32904) == mt.ModelType.BOOKMARKS);
assert(mt.getModelTypeFromSpecificsFieldNumber(32904) != mt.ModelType.NIGORI);
assert(mt.getSpecificsFieldNumberFromModelType(mt.getModelTypeFromSpecificsFieldNumber(32904)) == 32904);

// console.log('histogram suffix:', mt.modelTypeToHistogramSuffix(mt.ModelType.BOOKMARKS))
assert(mt.modelTypeToHistogramSuffix(mt.ModelType.BOOKMARKS) == mt.getModelTypeInfoMap().get(mt.ModelType.BOOKMARKS).notificationType);
// console.log('stable identifier:', mt.modelTypeToStableIdentifier(mt.ModelType.BOOKMARKS))
assert(mt.modelTypeToStableIdentifier(mt.ModelType.BOOKMARKS) == mt.getModelTypeInfoMap().get(mt.ModelType.BOOKMARKS).modelTypeHistogramVal + 1);

// console.log('modelTypeString to modelType:', '\'Bookmarks\' =>', mt.modelTypeFromString('Bookmarks'))
assert(mt.modelTypeFromString(mt.getModelTypeInfoMap().get(mt.ModelType.BOOKMARKS).modelTypeString) == mt.ModelType.BOOKMARKS);
assert(mt.modelTypeFromString('Encryption Keys') == mt.ModelType.NIGORI);
//assert(mt.modelTypeFromString('Top Level Folder') == mt.ModelType.UNSPECIFIED);
//assert(mt.modelTypeFromString('Unknown Data String') == mt.ModelType.UNSPECIFIED);
assert(mt.modelTypeToString(mt.ModelType.BOOKMARKS) == mt.getModelTypeInfoMap().get(mt.ModelType.BOOKMARKS).modelTypeString)

assert('google_chrome_bookmarks' == mt.modelTypeToRootTag(mt.getModelTypeInfoMap().get(2).modelType))
assert('google_chrome_user_consent' == mt.modelTypeToRootTag(mt.getModelTypeInfoMap().get(38).modelType))
assert('google_chrome_nigori' == mt.modelTypeToRootTag(mt.getModelTypeInfoMap().get(41).modelType))
assert('google_chrome_experiments' == mt.modelTypeToRootTag(mt.getModelTypeInfoMap().get(42).modelType))
//assert('Invalid' == mt.modelTypeToRootTag(mt.getModelTypeInfoMap().get(1).modelType))

assert('bookmarks' == mt.getModelTypeRootTag(mt.ModelType.BOOKMARKS), `BOOKMARKS's RootTag is 'bookmarks'`);
assert('themes' == mt.getModelTypeRootTag(mt.ModelType.THEMES), `THEMES's RootTag is 'themes'`);

assert('BOOKMARK' == mt.getRealModelTypeToNotificationType(mt.ModelType.BOOKMARKS), 'Check: this type is real model type');
assert('' == mt.getRealModelTypeToNotificationType(43), 'Check: this model type is not real model type');
assert(mt.ModelType.BOOKMARKS == mt.getNotificationTypeToRealModelType('BOOKMARK'), 'Check: this notification type is exists')
assert(mt.ModelType.UNSPECIFIED == mt.getNotificationTypeToRealModelType('Invalid Type'), 'Check: This notification type is not exists')

assert(mt.isProxyType(mt.ModelType.PROXY_TABS));
assert(mt.isActOnceDataType(mt.ModelType.HISTORY_DELETE_DIRECTIVES))
assert(mt.isTypeWithServerGeneratedRoot(mt.ModelType.BOOKMARKS), 'bookmarks is generated server')
assert(mt.isTypeWithServerGeneratedRoot(mt.ModelType.NIGORI), 'nigori is generated server')
assert(mt.isTypeWithClientGeneratedRoot(mt.ModelType.THEMES), 'other real model type is generated client')
assert(mt.typeSupportsHierarchy(mt.ModelType.BOOKMARKS))
assert(mt.typeSupportsOrdering(mt.ModelType.BOOKMARKS))

/* 미구현 */
mt.getUserSelectableTypeNameMap(/*void*/)
mt.encryptableUserTypes(/*void*/)
mt.toFullModelTypeSet(/*modelTypeSet*/)
mt.modelTypeToValue()
mt.modelTypeSetToString();
mt.modelTypeSetFromString();
mt.modelTypeSetToValue();
