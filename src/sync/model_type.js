const assert = require('assert');

const path = require('path');
const workspaceDir = path.join(__dirname, '../..');
let sync_pb = require(path.join(workspaceDir, 'src/google/protobufjs/proto_process.js'));
let pb = new sync_pb();
let proto = pb.getSyncProto();  //sync.proto파일 Load
let entityMsg = proto.root.lookupType('sync_pb.EntitySpecifics');
let syncEntityMsg = proto.root.lookupType('sync_pb.SyncEntity');

// 동기화 지원하는 하위 항목의 열거형.
// 각 동기화 객체에는 불변 객체 타입을 가질 수 있고, 객체의 타입은 보유한 데이터의 타입에서 유추됨
// ModelType 열거형과 kModelTypeInfoMap구조체는 순서가 동일해야 함!!!
const ModelType = {
  UNSPECIFIED: 0,
  TOP_LEVEL_FOLDER: 1,
  // ------------------------------------ Start of "real" model types.
  // The model types declared before here are somewhat special, as they
  // they do not correspond to any browser data model.  The remaining types
  // are bona fide model types; all have a related browser data model and
  // can be represented in the protocol using a specific Message type in the
  // EntitySpecifics protocol buffer.
  //
  // A bookmark folder or a bookmark URL object.
  BOOKMARKS: 2,
  // FIRST_USER_MODEL_TYPE = BOOKMARKS,  // Declared 2nd, for debugger prettiness.
  // IRST_REAL_MODEL_TYPE = FIRST_USER_MODEL_TYPE,
  PREFERENCES: 3,
  PASSWORDS: 4,
  AUTOFILL_PROFILE: 5,
  AUTOFILL: 6,
  AUTOFILL_WALLET_DATA: 7,
  AUTOFILL_WALLET_METADATA: 8,
  THEMES: 9,
  TYPED_URLS: 10,
  EXTENSIONS: 11,
  SEARCH_ENGINES: 12,
  SESSIONS: 13,
  APPS: 14,
  APP_SETTINGS: 15,
  EXTENSION_SETTINGS: 16,
  APP_NOTIFICATIONS: 17,
  HISTORY_DELETE_DIRECTIVES: 18,
  SYNCED_NOTIFICATIONS: 19,
  SYNCED_NOTIFICATION_APP_INFO: 20,
  DICTIONARY: 21,
  FAVICON_IMAGES: 22,
  FAVICON_TRACKING: 23,
  DEVICE_INFO: 24,
  PRIORITY_PREFERENCES: 25,
  SUPERVISED_USER_SETTINGS: 26,
  DEPRECATED_SUPERVISED_USERS: 27,
  DEPRECATED_SUPERVISED_USER_SHARED_SETTINGS: 28,
  DEPRECATED_ARTICLES: 29,
  APP_LIST: 30,
  DEPRECATED_WIFI_CREDENTIALS: 31,
  SUPERVISED_USER_WHITELISTS: 32,
  ARC_PACKAGE: 33,
  PRINTERS: 34,
  READING_LIST: 35,
  USER_EVENTS: 36,
  MOUNTAIN_SHARES: 37,
  USER_CONSENTS: 38,
  SEND_TAB_TO_SELF: 39,

  // ---- Proxy types ----
  // Proxy types are excluded from the sync protocol, but are still considered
  // real user types. By convention, we prefix them with 'PROXY_' to distinguish
  // them from normal protocol types.
  // Tab sync. This is a placeholder type, so that Sessions can be implicitly
  // enabled for history sync and tabs sync.
  PROXY_TABS: 40,
  // ---- Control Types ----
  // An object representing a set of Nigori keys.
  NIGORI: 41,
  // FIRST_CONTROL_MODEL_TYPE: NIGORI,
  // LAST_PROXY_TYPE = PROXY_TABS,
  // LAST_USER_MODEL_TYPE = PROXY_TABS,
  // Flags to enable experimental features.
  EXPERIMENTS: 42,
  // LAST_CONTROL_MODEL_TYPE: EXPERIMENTS,
  // LAST_REAL_MODEL_TYPE: LAST_CONTROL_MODEL_TYPE,

  MODEL_TYPE_COUNT: 43,
};
const FIRST_USER_MODEL_TYPE = ModelType.BOOKMARKS;  // Declared 2nd, for debugger prettiness.
const FIRST_REAL_MODEL_TYPE = FIRST_USER_MODEL_TYPE;
const FIRST_CONTROL_MODEL_TYPE = ModelType.NIGORI;
const FIRST_PROXY_TYPE = ModelType.PROXY_TABS;
const LAST_PROXY_TYPE = ModelType.PROXY_TABS;
const LAST_USER_MODEL_TYPE = ModelType.PROXY_TABS;
const LAST_CONTROL_MODEL_TYPE = ModelType.EXPERIMENTS;
const LAST_REAL_MODEL_TYPE = LAST_CONTROL_MODEL_TYPE;

// const ModelTypeName = {};//new Map();
// Object.entries(ModelType).map((it) => { ModelTypeName[it[1]] = it[0] });//ModelTypeName.set(it[1], it[0]);});
// //console.log(ModelTypeName);
// console.log("modelTypeName 41:", ModelTypeName[41])

let modelTypeSet = {};
let fullModelTypeSet = {};
let modelTypeNameMap = new Map();
for (const i in ModelType) {
  if (ModelType[i] >= ModelType.UNSPECIFIED && ModelType[i] <= LAST_REAL_MODEL_TYPE) {
    fullModelTypeSet[i] = ModelType[i];//.push(ModelType[i]);
  }
  if (ModelType[i] >= FIRST_REAL_MODEL_TYPE && ModelType[i] <= LAST_REAL_MODEL_TYPE) {
    // 주의!! 클라이언트에서 modelTypeSet(== EnumSet<modelType, Bookmarks, Experiments>)의 EnumBitSet값인 enums_는 인덱스로 조정되어 들어감.
    // modelTypeSet은 'BOOKMARKS'(2)부터시작.
    // REAL모델타입 범위에 따라 Min: 2, Max: 42로 표시되지만, enums_의 값은 Min값에 따라 조정(i - Min)되어 0부터 시작함.
    // 즉, enums_의 bitset의 값은 -2씩되어 표시되게 됨. (enums_=std::bitset={[39]=1, [40]=1}은 각각 NIGORI, EXPERIMENTS를 의미하게 됨)
    // 서버쪽엔 영향이 없을 것 같지만, 혹시 모르니까 주의 필요함!!!!!
    modelTypeSet[i] = ModelType[i];
  };
};
//console.log("modelTypeSet:", modelTypeSet);

const SpecificsFieldName = {
  APPS: 'app',
  APP_LIST: 'appList',
  APP_NOTIFICATIONS: 'appNotification',
  APP_SETTINGS: 'appSetting',
  ARC_PACKAGE: 'arcPackage',
  DEPRECATED_ARTICLES: 'article',
  AUTOFILL: 'autofill',
  AUTOFILL_PROFILE: 'autofillProfile',
  AUTOFILL_WALLET_DATA: 'autofillWallet',
  AUTOFILL_WALLET_METADATA: 'walletMetadata',
  BOOKMARKS: 'bookmark',
  DEVICE_INFO: 'deviceInfo',
  DICTIONARY: 'dictionary',
  EXPERIMENTS: 'experiments',
  EXTENSIONS: 'extension',
  HISTORY_DELETE_DIRECTIVES: 'historyDeleteDirective',
  SUPERVISED_USER_SETTINGS: 'managedUserSetting',
  DEPRECATED_SUPERVISED_USER_SHARED_SETTINGS: 'managedUserSharedSetting',
  SUPERVISED_USER_WHITELISTS: 'managedUserWhitelist',
  DEPRECATED_SUPERVISED_USERS: 'managedUser',
  NIGORI: 'nigori',
  PASSWORDS: 'password',
  PREFERENCES: 'preference',
  PRINTERS: 'printer',
  PRIORITY_PREFERENCES: 'priorityPreference',
  READING_LIST: 'readingList',
  SEARCH_ENGINES: 'searchEngine',
  SESSIONS: 'session',
  SYNCED_NOTIFICATIONS: 'syncedNotification',
  SYNCED_NOTIFICATION_APP_INFO: 'syncedNotificationAppInfo',
  THEMES: 'theme',
  TYPED_URLS: 'typedUrl',
  EXTENSION_SETTINGS: 'extensionSetting',
  FAVICON_IMAGES: 'faviconImage',
  FAVICON_TRACKING: 'faviconTracking',
  DEPRECATED_WIFI_CREDENTIALS: 'wifiCredential',
  USER_EVENTS: 'userEvent',
  MOUNTAIN_SHARES: 'mountainShare',
  USER_CONSENTS: 'userConsent',
  SEND_TAB_TO_SELF: 'sendTabToSelf',
};

const SyncTypeName = {    // == SYNC_TYPE_TO_DESCRIPTOR
  APPS: entityMsg.lookup('app'),
  APP_LIST: entityMsg.lookup('appList'),
  APP_NOTIFICATIONS: entityMsg.lookup('appNotification'),
  APP_SETTINGS: entityMsg.lookup('appSetting'),
  ARC_PACKAGE: entityMsg.lookup('arcPackage'),
  DEPRECATED_ARTICLES: entityMsg.lookup('article'),
  AUTOFILL: entityMsg.lookup('autofill'),
  AUTOFILL_PROFILE: entityMsg.lookup('autofillProfile'),
  AUTOFILL_WALLET_DATA: entityMsg.lookup('autofillWallet'),
  AUTOFILL_WALLET_METADATA: entityMsg.lookup('walletMetadata'),
  BOOKMARKS: entityMsg.lookup('bookmark'),
  DEVICE_INFO: entityMsg.lookup('deviceInfo'),
  DICTIONARY: entityMsg.lookup('dictionary'),
  EXPERIMENTS: entityMsg.lookup('experiments'),
  EXTENSIONS: entityMsg.lookup('extension'),
  HISTORY_DELETE_DIRECTIVES: entityMsg.lookup('historyDeleteDirective'),
  SUPERVISED_USER_SETTINGS: entityMsg.lookup('managedUserSetting'),
  DEPRECATED_SUPERVISED_USER_SHARED_SETTINGS: entityMsg.lookup('managedUserSharedSetting'),
  SUPERVISED_USER_WHITELISTS: entityMsg.lookup('managedUserWhitelist'),
  DEPRECATED_SUPERVISED_USERS: entityMsg.lookup('managedUser'),
  NIGORI: entityMsg.lookup('nigori'),
  PASSWORDS: entityMsg.lookup('password'),
  PREFERENCES: entityMsg.lookup('preference'),
  PRINTERS: entityMsg.lookup('printer'),
  PRIORITY_PREFERENCES: entityMsg.lookup('priorityPreference'),
  READING_LIST: entityMsg.lookup('readingList'),
  SEARCH_ENGINES: entityMsg.lookup('searchEngine'),
  SESSIONS: entityMsg.lookup('session'),
  SYNCED_NOTIFICATIONS: entityMsg.lookup('syncedNotification'),
  SYNCED_NOTIFICATION_APP_INFO: entityMsg.lookup('syncedNotificationAppInfo'),
  THEMES: entityMsg.lookup('theme'),
  TYPED_URLS: entityMsg.lookup('typedUrl'),
  EXTENSION_SETTINGS: entityMsg.lookup('extensionSetting'),
  FAVICON_IMAGES: entityMsg.lookup('faviconImage'),
  FAVICON_TRACKING: entityMsg.lookup('faviconTracking'),
  DEPRECATED_WIFI_CREDENTIALS: entityMsg.lookup('wifiCredential'),
  USER_EVENTS: entityMsg.lookup('userEvent'),
  MOUNTAIN_SHARES: entityMsg.lookup('mountainShare'),
  USER_CONSENTS: entityMsg.lookup('userConsent'),
  SEND_TAB_TO_SELF: entityMsg.lookup('sendTabToSelf'),
  //PROXY_TABS는 sync.proto에 없음
};
function syncTypeToProtocolDataTypeId(syncType) { //키 값에 해당하는 실제 proto dataType Id. e.g. (BOOKMARKS) -> 32904
  /* SyncTypeName to DataType Id. */
  return SyncTypeName[syncType].id;
};

class ModelTypeInfo {
  constructor(info) {
    this.modelType = info[0];
    this.notificationType = info[1];
    this.rootTag = info[2];
    this.modelTypeString = info[3];
    this.specificsFieldNumber = info[4];
    this.modelTypeHistogramVal = info[5];
  }
  setSpecificsFieldName(fieldName) {
    this.specificsFieldName = fieldName;
  }
  getSpecificsFieldName() {
    return this.specificsFieldName;
  }
};

const ModelTypeInfoMap = [
  [ModelType.UNSPECIFIED, "", "", "Unspecified", -1, 0],
  [ModelType.TOP_LEVEL_FOLDER, "", "", "Top Level Folder", -1, 1],
  [ModelType.BOOKMARKS, "BOOKMARK", "bookmarks", "Bookmarks",
  syncTypeToProtocolDataTypeId("BOOKMARKS"), 2],
  [ModelType.PREFERENCES, "PREFERENCE", "preferences", "Preferences",
  syncTypeToProtocolDataTypeId("PREFERENCES"), 3],
  [ModelType.PASSWORDS, "PASSWORD", "passwords", "Passwords",
  syncTypeToProtocolDataTypeId("PASSWORDS"), 4],
  [ModelType.AUTOFILL_PROFILE, "AUTOFILL_PROFILE", "autofill_profiles", "Autofill Profiles",
  syncTypeToProtocolDataTypeId("AUTOFILL_PROFILE"), 5],
  [ModelType.AUTOFILL, "AUTOFILL", "autofill", "Autofill",
  syncTypeToProtocolDataTypeId("AUTOFILL"), 6],
  [ModelType.AUTOFILL_WALLET_DATA, "AUTOFILL_WALLET", "autofill_wallet", "Autofill Wallet",
  syncTypeToProtocolDataTypeId("AUTOFILL_WALLET_DATA"), 34],
  [ModelType.AUTOFILL_WALLET_METADATA, "WALLET_METADATA", "autofill_wallet_metadata", "Autofill Wallet Metadata",
  syncTypeToProtocolDataTypeId("AUTOFILL_WALLET_METADATA"), 35],
  [ModelType.THEMES, "THEME", "themes", "Themes",
  syncTypeToProtocolDataTypeId("THEMES"), 7],
  [ModelType.TYPED_URLS, "TYPED_URL", "typed_urls", "Typed URLs",
  syncTypeToProtocolDataTypeId("TYPED_URLS"), 8],
  [ModelType.EXTENSIONS, "EXTENSION", "extensions", "Extensions",
  syncTypeToProtocolDataTypeId("EXTENSIONS"), 9],
  [ModelType.SEARCH_ENGINES, "SEARCH_ENGINE", "search_engines", "Search Engines",
  syncTypeToProtocolDataTypeId("SEARCH_ENGINES"), 10],
  [ModelType.SESSIONS, "SESSION", "sessions", "Sessions",
  syncTypeToProtocolDataTypeId("SESSIONS"), 11],
  [ModelType.APPS, "APP", "apps", "Apps",
  syncTypeToProtocolDataTypeId("APPS"), 12],
  [ModelType.APP_SETTINGS, "APP_SETTING", "app_settings", "App settings",
  syncTypeToProtocolDataTypeId("APP_SETTINGS"), 13],
  [ModelType.EXTENSION_SETTINGS, "EXTENSION_SETTING", "extension_settings", "Extension settings",
  syncTypeToProtocolDataTypeId("EXTENSION_SETTINGS"), 14],
  [ModelType.APP_NOTIFICATIONS, "APP_NOTIFICATION", "app_notifications", "App Notifications",
  syncTypeToProtocolDataTypeId("APP_NOTIFICATIONS"), 15],
  [ModelType.HISTORY_DELETE_DIRECTIVES, "HISTORY_DELETE_DIRECTIVE", "history_delete_directives", "History Delete Directives",
  syncTypeToProtocolDataTypeId("HISTORY_DELETE_DIRECTIVES"), 16],
  [ModelType.SYNCED_NOTIFICATIONS, "SYNCED_NOTIFICATION", "synced_notifications", "Synced Notifications",
  syncTypeToProtocolDataTypeId("SYNCED_NOTIFICATIONS"), 20],
  [ModelType.SYNCED_NOTIFICATION_APP_INFO, "SYNCED_NOTIFICATION_APP_INFO", "synced_notification_app_info", "Synced Notification App Info",
  syncTypeToProtocolDataTypeId("SYNCED_NOTIFICATION_APP_INFO"), 31],
  [ModelType.DICTIONARY, "DICTIONARY", "dictionary", "Dictionary",
  syncTypeToProtocolDataTypeId("DICTIONARY"), 22],
  [ModelType.FAVICON_IMAGES, "FAVICON_IMAGE", "favicon_images", "Favicon Images",
  syncTypeToProtocolDataTypeId("FAVICON_IMAGES"), 23],
  [ModelType.FAVICON_TRACKING, "FAVICON_TRACKING", "favicon_tracking", "Favicon Tracking",
  syncTypeToProtocolDataTypeId("FAVICON_TRACKING"), 24],
  [ModelType.DEVICE_INFO, "DEVICE_INFO", "device_info", "Device Info",
  syncTypeToProtocolDataTypeId("DEVICE_INFO"), 18],
  [ModelType.PRIORITY_PREFERENCES, "PRIORITY_PREFERENCE", "priority_preferences", "Priority Preferences",
  syncTypeToProtocolDataTypeId("PRIORITY_PREFERENCES"), 21],
  [ModelType.SUPERVISED_USER_SETTINGS, "MANAGED_USER_SETTING", "managed_user_settings", "Managed User Settings",
  syncTypeToProtocolDataTypeId("SUPERVISED_USER_SETTINGS"), 26],
  [ModelType.DEPRECATED_SUPERVISED_USERS, "MANAGED_USER", "managed_users", "Managed Users",
  syncTypeToProtocolDataTypeId("DEPRECATED_SUPERVISED_USERS"), 27],
  [ModelType.DEPRECATED_SUPERVISED_USER_SHARED_SETTINGS, "MANAGED_USER_SHARED_SETTING", "managed_user_shared_settings", "Managed User Shared Settings",
  syncTypeToProtocolDataTypeId("DEPRECATED_SUPERVISED_USER_SHARED_SETTINGS"), 30],
  [ModelType.DEPRECATED_ARTICLES, "ARTICLE", "deprecated_articles", "Deprecated Articles",
  syncTypeToProtocolDataTypeId("DEPRECATED_ARTICLES"), 28],
  [ModelType.APP_LIST, "APP_LIST", "app_list", "App List",
  syncTypeToProtocolDataTypeId("APP_LIST"), 29],
  [ModelType.DEPRECATED_WIFI_CREDENTIALS, "WIFI_CREDENTIAL", "wifi_credentials", "WiFi Credentials",
  syncTypeToProtocolDataTypeId("DEPRECATED_WIFI_CREDENTIALS"), 32],
  [ModelType.SUPERVISED_USER_WHITELISTS, "MANAGED_USER_WHITELIST", "managed_user_whitelists", "Managed User Whitelists",
  syncTypeToProtocolDataTypeId("SUPERVISED_USER_WHITELISTS"), 33],
  [ModelType.ARC_PACKAGE, "ARC_PACKAGE", "arc_package", "Arc Package",
  syncTypeToProtocolDataTypeId("ARC_PACKAGE"), 36],
  [ModelType.PRINTERS, "PRINTER", "printers", "Printers",
  syncTypeToProtocolDataTypeId("PRINTERS"), 37],
  [ModelType.READING_LIST, "READING_LIST", "reading_list", "Reading List",
  syncTypeToProtocolDataTypeId("READING_LIST"), 38],
  [ModelType.USER_EVENTS, "USER_EVENT", "user_events", "User Events",
  syncTypeToProtocolDataTypeId("USER_EVENTS"), 39],
  [ModelType.MOUNTAIN_SHARES, "MOUNTAIN_SHARE", "mountain_shares", "Mountain Shares",
  syncTypeToProtocolDataTypeId("MOUNTAIN_SHARES"), 40],
  [ModelType.USER_CONSENTS, "USER_CONSENT", "user_consent", "User Consents",
  syncTypeToProtocolDataTypeId("USER_CONSENTS"), 41],
  [ModelType.SEND_TAB_TO_SELF, "SEND_TAB_TO_SELF", "send_tab_to_self", "Send Tab To Self",
  syncTypeToProtocolDataTypeId("SEND_TAB_TO_SELF"), 42],
  // ---- Proxy types ----
  [ModelType.PROXY_TABS, "", "", "Tabs", -1, 25],
  // ---- Control Types ----
  [ModelType.NIGORI, "NIGORI", "nigori", "Encryption Keys",
  syncTypeToProtocolDataTypeId("NIGORI"), 17],
  [ModelType.EXPERIMENTS, "EXPERIMENTS", "experiments", "Experiments",
  syncTypeToProtocolDataTypeId("EXPERIMENTS"), 19],
];

let typesValues = Object.keys(ModelType).reduce(
  (acc, k) => (acc[ModelType[k]] = [...(acc[ModelType[k]] || []), k], acc), {});
function getModelTypeNameFromModelType(index) {
  assert(index > 0);
  assert(index < ModelType.MODEL_TYPE_COUNT);
  return typesValues[index];
};
let modelTypeFromInt = getModelTypeNameFromModelType;  // 이름만 변경함

const kModelTypeInfoMap = new Map();
for (let i in ModelTypeInfoMap) {
  kModelTypeInfoMap.set(ModelTypeInfoMap[i][0], new ModelTypeInfo(ModelTypeInfoMap[i]));
  if (i > 0 && SpecificsFieldName.hasOwnProperty(getModelTypeNameFromModelType(ModelTypeInfoMap[i][0]))) {
    //console.log(ModelTypeInfoMap[i][0])
    kModelTypeInfoMap.get(ModelTypeInfoMap[i][0]).setSpecificsFieldName(SpecificsFieldName[getModelTypeNameFromModelType(ModelTypeInfoMap[i][0])]);
  }
};
//console.log("kModelTypeInfoMap:", kModelTypeInfoMap.entries())
assert(kModelTypeInfoMap.size == ModelType.MODEL_TYPE_COUNT, "kModelTypeInfoMap should have MODEL_TYPE_COUNT elements");
assert(43 == ModelType.MODEL_TYPE_COUNT, "When adding a new type, update enum SyncModelTypes in enums.xml", "and suffix SyncModelType in histograms.xml.");
assert(43 == ModelType.MODEL_TYPE_COUNT, "When adding a new type, update kAllocatorDumpNameWhitelist in ", "base/trace_event/memory_infra_background_whitelist.cc.");



function addDefaultFieldValue(modelType, specifics) { // ModelType, sync_pb::EntitySpecifics
  assert(modelType <= ModelType.MODEL_TYPE_COUNT);
  if (Object.entries(specifics).length > 0) {//이미 데이터가 존재
    console.error('\x1b[35m%s\x1b[0m', 'Warning: It is already has a oneof specifics_variant:', specifics.toJSON());
    // TODO: 필요시 여기서 리턴...
  }
  switch (modelType) {
    case ModelType.UNSPECIFIED:
    case ModelType.TOP_LEVEL_FOLDER:
    case ModelType.PROXY_TABS:
    case ModelType.MODEL_TYPE_COUNT:
      console.error('\x1b[35m%s\x1b[0m', 'Warning: No default field value for ', getModelTypeNameFromModelType(modelType));
      break;
    default:
      //console.log('defaultFieldValue modelType:', getModelTypeNameFromModelType(kModelTypeInfoMap.get(modelType).modelType));
      specifics[SpecificsFieldName[getModelTypeNameFromModelType(kModelTypeInfoMap.get(modelType).modelType)]] = SyncTypeName[getModelTypeNameFromModelType(modelType)];
      break;
    /*
  case ModelType.BOOKMARKS:
    specifics.bookmark = SyncTypeName[getModelTypeNameFromModelType(modelType)];
    break;
  case ModelType.PREFERENCES:
    specifics.preference = SyncTypeName[getModelTypeNameFromModelType(modelType)];
    break;
  case ModelType.PASSWORDS:
    specifics.password = SyncTypeName[getModelTypeNameFromModelType(modelType)];
    break;
  case ModelType.AUTOFILL_PROFILE:
    specifics.autofillProfile = SyncTypeName[getModelTypeNameFromModelType(modelType)];
    break;
  case ModelType.AUTOFILL:
    specifics.autofill = SyncTypeName[getModelTypeNameFromModelType(modelType)];
    break;
  case ModelType.AUTOFILL_WALLET_DATA:
    specifics.autofillWallet = SyncTypeName[getModelTypeNameFromModelType(modelType)];
    break;
  case ModelType.AUTOFILL_WALLET_METADATA:
    specifics.walletMetadata = SyncTypeName[getModelTypeNameFromModelType(modelType)];
    break;
  case ModelType.THEMES:
    specifics.theme = SyncTypeName[getModelTypeNameFromModelType(modelType)];
    break;
  case ModelType.TYPED_URLS:
    specifics.typedUrl = SyncTypeName[getModelTypeNameFromModelType(modelType)];
    break;
  case ModelType.EXTENSIONS:
    specifics.extension = SyncTypeName[getModelTypeNameFromModelType(modelType)];
    break;
  case ModelType.SEARCH_ENGINES:
    specifics.searchEngine = SyncTypeName[getModelTypeNameFromModelType(modelType)];
    break;
  case ModelType.SESSIONS:
    specifics.session = SyncTypeName[getModelTypeNameFromModelType(modelType)];
    break;
  case ModelType.APPS:
    specifics.app = SyncTypeName[getModelTypeNameFromModelType(modelType)];
    break;
  case ModelType.APP_SETTINGS:
    specifics.appSetting = SyncTypeName[getModelTypeNameFromModelType(modelType)];
    break;
  case ModelType.EXTENSION_SETTINGS:
    specifics.extensionSetting = SyncTypeName[getModelTypeNameFromModelType(modelType)];
    break;
  case ModelType.APP_NOTIFICATIONS:
    specifics.appNotification = SyncTypeName[getModelTypeNameFromModelType(modelType)];
    break;
  case ModelType.HISTORY_DELETE_DIRECTIVES:
    specifics.historyDeleteDirective = SyncTypeName[getModelTypeNameFromModelType(modelType)];
    break;
  case ModelType.SYNCED_NOTIFICATIONS:
    specifics.syncedNotification = SyncTypeName[getModelTypeNameFromModelType(modelType)];
    break;
  case ModelType.SYNCED_NOTIFICATION_APP_INFO:
    specifics.syncedNotificationAppInfo = SyncTypeName[getModelTypeNameFromModelType(modelType)];
    break;
  case ModelType.DICTIONARY:
    specifics.dictionary = SyncTypeName[getModelTypeNameFromModelType(modelType)];
    break;
  case ModelType.FAVICON_IMAGES:
    specifics.faviconImage = SyncTypeName[getModelTypeNameFromModelType(modelType)];
    break;
  case ModelType.FAVICON_TRACKING:
    specifics.faviconTracking = SyncTypeName[getModelTypeNameFromModelType(modelType)];
    break;
  case ModelType.DEVICE_INFO:
    specifics.deviceInfo = SyncTypeName[getModelTypeNameFromModelType(modelType)];
    break;
  case ModelType.PRIORITY_PREFERENCES:
    specifics.priorityPreference = SyncTypeName[getModelTypeNameFromModelType(modelType)];
    break;
  case ModelType.SUPERVISED_USER_SETTINGS:
    specifics.menagedUserSetting = SyncTypeName[getModelTypeNameFromModelType(modelType)];
    break;
  case ModelType.DEPRECATED_SUPERVISED_USERS:
    specifics.managedUser = SyncTypeName[getModelTypeNameFromModelType(modelType)];
    break;
  case ModelType.DEPRECATED_SUPERVISED_USER_SHARED_SETTINGS:
    specifics.managedUserSharedSetting = SyncTypeName[getModelTypeNameFromModelType(modelType)];
    break;
  case ModelType.DEPRECATED_ARTICLES:
    specifics.article = SyncTypeName[getModelTypeNameFromModelType(modelType)];
    break;
  case ModelType.APP_LIST:
    specifics.appList = SyncTypeName[getModelTypeNameFromModelType(modelType)];
    break;
  case ModelType.DEPRECATED_WIFI_CREDENTIALS:
    specifics.wifiCredential = SyncTypeName[getModelTypeNameFromModelType(modelType)];
    break;
  case ModelType.SUPERVISED_USER_WHITELISTS:
    specifics.managedUserWhitelist = SyncTypeName[getModelTypeNameFromModelType(modelType)];
    break;
  case ModelType.ARC_PACKAGE:
    specifics.arcPackage = SyncTypeName[getModelTypeNameFromModelType(modelType)];
    break;
  case ModelType.PRINTERS:
    specifics.printer = SyncTypeName[getModelTypeNameFromModelType(modelType)];
    break;
  case ModelType.READING_LIST:
    specifics.readingList = SyncTypeName[getModelTypeNameFromModelType(modelType)];
    break;
  case ModelType.USER_EVENTS:
    specifics.userEvent = SyncTypeName[getModelTypeNameFromModelType(modelType)];
    break;
  case ModelType.MOUNTAIN_SHARES:
    specifics.mountainShare = SyncTypeName[getModelTypeNameFromModelType(modelType)];
    break;
  case ModelType.USER_CONSENTS:
    specifics.userConsent = SyncTypeName[getModelTypeNameFromModelType(modelType)];
    break;
  case ModelType.SEND_TAB_TO_SELF:
    specifics.sendTabToSelf = SyncTypeName[getModelTypeNameFromModelType(modelType)];
    break;
  case ModelType.NIGORI:
    specifics['nigori'] = SyncTypeName[getModelTypeNameFromModelType(modelType)];
    break;
  case ModelType.EXPERIMENTS:
    specifics.experiments = SyncTypeName[getModelTypeNameFromModelType(modelType)];
    break;
    */
  }
};

function getModelType(syncEntity) {  // sync_pb::SyncEntity
  //assert(isRoot(syncEntity));
  let specificsModelType = getModelTypeFromSpecifics(syncEntity.specifics);
  if (specificsModelType != ModelType.UNSPECIFIED) {
    return specificsModelType;
  }
  if (syncEntity.hasOwnProperty('serverDefinedUniqueTag') && syncEntity.serverDefinedUniqueTag != "" && isFolder(syncEntity)) {
    return ModelType.TOP_LEVEL_FOLDER;
  }
  console.error('\x1b[35m%s\x1b[0m', 'NOT REACHED: Unknown datatype in sync proto.');
  return ModelType.UNSPECIFIED;
};

function getModelTypeFromSpecifics(specifics) {  // sync_pb::EntitySpecifics
  assert(43 == ModelType.MODEL_TYPE_COUNT, "When adding new protocol types, the following type lookup", "logic must be updated.");
  for (let i of Object.keys(SyncTypeName)) {
    if (specifics.hasOwnProperty(SpecificsFieldName[i])) {
      return ModelType[i];
    }
  }
  return ModelType.UNSPECIFIED;
};

//console.log("bookmark: ", getModelTypeNameFromModelType(2));
const kUserSelectableDataTypeNames = ["bookmarks", "preferences", "passwords", "autofill", "themes", "typedUrls", "extensions", "apps", "readingList", "tabs"];

// // 값이 하나만 있는 것을 보장하려면 new Set으로 감쌀 것...
const protocolTypes = new Set(Object.values(modelTypeSet).filter((it) => { if (it >= ModelType.BOOKMARKS && it <= ModelType.EXPERIMENTS) return it; }));
const userTypes = new Set(Object.values(modelTypeSet).filter((it) => { if (it >= FIRST_USER_MODEL_TYPE && it <= LAST_USER_MODEL_TYPE) return it; }));
const alwaysPreferredUserTypes = new Set([ModelType.DEVICE_INFO, ModelType.USER_CONSENTS]);
const userSelectableTypes = new Set([ModelType.BOOKMARKS, ModelType.PREFERENCES, ModelType.PASSWORDS, ModelType.AUTOFILL, ModelType.THEMES, ModelType.TYPED_URLS, ModelType.EXTENSIONS, ModelType.APPS, ModelType.READING_LIST, ModelType.PROXY_TABS]);
const priorityUserTypes = new Set([ModelType.DEVICE_INFO, ModelType.PRIORITY_PREFERENCES]);
const proxyTypes = new Set(Object.values(modelTypeSet).filter((it) => { if (it >= FIRST_PROXY_TYPE && it <= LAST_PROXY_TYPE) return it; }));
const controlTypes = new Set(Object.values(modelTypeSet).filter((it) => { if (it >= FIRST_CONTROL_MODEL_TYPE && it <= LAST_CONTROL_MODEL_TYPE) return it; }));

// const protocolTypes = new Set(Object.keys(modelTypeSet).filter((it) => (modelTypeSet[it] >= modelTypeSet.BOOKMARKS && modelTypeSet[it] <= modelTypeSet.EXPERIMENTS)));//new Set(modelTypeSet.filter((it) => { if (it >= ModelType.BOOKMARKS && it <= ModelType.EXPERIMENTS) return it;}));
// const userTypes = new Set(Object.keys(modelTypeSet).filter((it) => (modelTypeSet[it] >= FIRST_USER_MODEL_TYPE && modelTypeSet[it] <= LAST_USER_MODEL_TYPE)));//new Set(modelTypeSet.filter((it) => { if (it >= FIRST_USER_MODEL_TYPE && it <= LAST_USER_MODEL_TYPE) return it;}));
// const alwaysPreferredUserTypes = new Set(['DEVICE_INFO', 'USER_CONSENTS']);
// const userSelectableTypes = new Set(['BOOKMARKS', 'PREFERENCES', 'PASSWORDS', 'AUTOFILL', 'THEMES',
//   'TYPED_URLS', 'EXTENSIONS', 'APPS', 'READING_LIST', 'PROXY_TABS']);
function isUserSelectableType(modelType) {  //얘가... Enum값(Int)인가 설마...?
  return userSelectableTypes.has(modelType);
}

// const priorityUserTypes = new Set(['DEVICE_INFO', 'PRIORITY_PREFERENCES']);
// const proxyTypes = new Set(Object.keys(modelTypeSet).filter((it) => (modelTypeSet[it] >= FIRST_PROXY_TYPE && modelTypeSet[it] <= LAST_PROXY_TYPE)));//new Set(modelTypeSet.filter((it) => { if (it >= FIRST_PROXY_TYPE && it <= LAST_PROXY_TYPE) return it;}));
// const controlTypes = new Set(Object.keys(modelTypeSet).filter((it) => (modelTypeSet[it] >= FIRST_CONTROL_MODEL_TYPE && modelTypeSet[it] <= LAST_CONTROL_MODEL_TYPE)));
// //use values: new Set(modelTypeSet.filter((it) => { if (it >= FIRST_CONTROL_MODEL_TYPE && it <= LAST_CONTROL_MODEL_TYPE) return it;}));
function isControlType(modelType) {
  return controlTypes.has(modelType);
};


// 동기화 핵심 기능관련 타입들 (UsetData 타입X)
// 이 타입들은 항상 Enabled이고, controlTypes를 포함
const coreTypes = new Set([ModelType.NIGORI, ModelType.EXPERIMENTS, ModelType.SUPERVISED_USER_SETTINGS,
ModelType.SYNCED_NOTIFICATIONS, ModelType.SYNCED_NOTIFICATION_APP_INFO, ModelType.SUPERVISED_USER_WHITELISTS]);
const priorityCoreTypes = new Set([ModelType.NIGORI, ModelType.EXPERIMENTS, ModelType.SUPERVISED_USER_SETTINGS]);
const commitOnlyTypes = new Set([ModelType.USER_EVENTS, ModelType.USER_CONSENTS]);
// const coreTypes = new Set(['NIGORI', 'EXPERIMENTS', 'SUPERVISED_USER_SETTINGS',
//   'SYNCED_NOTIFICATIONS', 'SYNCED_NOTIFICATION_APP_INFO', 'SUPERVISED_USER_WHITELISTS']);
// const priorityCoreTypes = new Set(['NIGORI', 'EXPERIMENTS', 'SUPERVISED_USER_SETTINGS']);
// const commitOnlyTypes = new Set(['USER_EVENTS', 'USER_CONSENTS']);

function getUserSelectableTypeNameMap() {
  //return ModelTypeNameMap;
};
function encryptableUserTypes() {
  //reutnr ModelTypeSet;
};
function getModelTypeFromSpecificsFieldNumber(fieldNumber) {
  for (let modelType of protocolTypes) {  //Array는 iterable하니까 of사용!
    if (getSpecificsFieldNumberFromModelType(modelType) == fieldNumber) {
      return modelType;
    }
  }
  return ModelType.UNSPECIFIED;
};
function getSpecificsFieldNumberFromModelType(modelType) {
  assert(protocolTypes.has(modelType), "Only protocol types have field values.");
  if (protocolTypes.has(modelType)) {
    return kModelTypeInfoMap.get(modelType).specificsFieldNumber;
  }
  assert(false, "No known extension for model type.");
  return 0;
}
function toFullModelTypeSet(in_typeSet) { // modelTypeSet
  //return fullModelTypeSet;
}
function modelTypeToString(modelType) {
  if (modelType >= ModelType.UNSPECIFIED && modelType < ModelType.MODEL_TYPE_COUNT) {
    return kModelTypeInfoMap.get(modelType).modelTypeString;
  }
  assert(false, "No known extension for model type.");
  return "Invalid";
}
function modelTypeToHistogramSuffix(modelType) {
  if (modelType >= ModelType.UNSPECIFIED && modelType < ModelType.MODEL_TYPE_COUNT) {
    return kModelTypeInfoMap.get(modelType).notificationType;
  }
  assert(false, "No known suffix for model type.");
  return "Invalid";
}
function modelTypeToHistogramInt(modelType) {
  if (modelType >= ModelType.UNSPECIFIED && modelType < ModelType.MODEL_TYPE_COUNT) {
    return kModelTypeInfoMap.get(modelType).modelTypeHistogramVal;
  }
  return 0;
}
function modelTypeToStableIdentifier(modelType) {
  assert(modelType >= ModelType.UNSPECIFIED && modelType < ModelType.MODEL_TYPE_COUNT);
  return modelTypeToHistogramInt(modelType) + 1;    //???????????????
}
function modelTypeToValue(modelType) {
  if (modelType >= FIRST_REAL_MODEL_TYPE) {

  } else if (modelType == ModelType.TOP_LEVEL_FOLDER) {

  } else if (modelType == ModelType.UNSPECIFIED) {

  }
  //assert(false) // NOT REACHED
  //return base::Value(std::string())
}
function modelTypeFromString(modelTypeString) {
  if (modelTypeString != 'Unspecified' &&
    modelTypeString != 'Top Level Folder') {
    for (let info of kModelTypeInfoMap) { //info[0]: key, info[1]: value
      if (info[1].modelTypeString == modelTypeString) {
        return info[1].modelType;
      }
    }
  }
  console.error('\x1b[35m%s\x1b[0m', 'NOT REACHED: Unknown modelTypeString');
  return ModelType.UNSPECIFIED;
}
function modelTypeSetToString(modelTypeSet) {
  //return string
}
function modelTypeSetFromString(modelTypeString) {
  //return modelTypeSet
};
function modelTypeSetToValue(modelTypeSet) {  // ==model_types
  //return unique<base::ListValue>
};
function modelTypeToRootTag(modelType) {
  if (isProxyType(modelType)) {
    return "";
  }
  if (isRealDataType(modelType)) {
    return "google_chrome_" + kModelTypeInfoMap.get(modelType).rootTag;
  }
  console.error('\x1b[35m%s\x1b[0m', 'NOT REACHED: No known extension for model type:', modelType);
  return "Invalid";
};
function getModelTypeRootTag(modelType) {
  return kModelTypeInfoMap.get(modelType).rootTag;
};

/* Comment(BK, 2020-08-14): JS에서는 call-by-reference개념이 없어서 인자로 ref를 넘길 수 없음
따라서 C++과 다르게 리턴값으로 notificationType을 넘기도록 변경 */
// function realModelTypeToNotificationType(modelType, notificationType) { // ModelType, string
// function notificationTypeToRealModelType(notificationType, modelType) {
function getRealModelTypeToNotificationType(modelType) { // ModelType, string
  let notificationType;
  if (protocolTypes.has(modelType)) {
    notificationType = kModelTypeInfoMap.get(modelType).notificationType;
  } else {
    notificationType = ""; // ???? clear없으면 다른 방식으로 초기화
  }
  return notificationType;
};
function getNotificationTypeToRealModelType(notificationType) {
  let modelType = ModelType.UNSPECIFIED;
  if (notificationType != "") {
    for (let info of kModelTypeInfoMap) {
      if (info[1].notificationType == notificationType) {
        modelType = info[1].modelType;
        break;
      }
    }
  }
  return modelType;
};

function isRealDataType(modelType) {
  return (modelType >= FIRST_REAL_MODEL_TYPE && modelType < ModelType.MODEL_TYPE_COUNT);
};
function isProxyType(modelType) {
  return (modelType >= FIRST_PROXY_TYPE && modelType <= LAST_PROXY_TYPE);
};
// 적용된 후에 드롭되는 엔티티 타입들
function isActOnceDataType(modelType) {
  return modelType == ModelType.HISTORY_DELETE_DIRECTIVES;
};
// 최초 동기화시에 서버에서 명시적으로 생성된 Root폴더를 요구하는 타입
function isTypeWithServerGeneratedRoot(modelType) {
  return modelType == ModelType.BOOKMARKS || modelType == ModelType.NIGORI;
};
function isTypeWithClientGeneratedRoot(modelType) {
  return isRealDataType(modelType) && !isTypeWithServerGeneratedRoot(modelType);
};
function typeSupportsHierarchy(modelType) {
  return modelType == ModelType.BOOKMARKS;
};
function typeSupportsOrdering(modelType) {
  return modelType == ModelType.BOOKMARKS;
};

// readingList는 빌드 플래그 ENABLE_READING_LIST 있을 때만

/* exports */
exports.ModelType = ModelType;
exports.syncTypeToProtocolDataTypeId = syncTypeToProtocolDataTypeId;
exports.getModelTypeNameFromModelType = getModelTypeNameFromModelType;
exports.addDefaultFieldValue = addDefaultFieldValue;
//exports.getModelTypeFromSpecifics = getModelTypeFromSpecifics
exports.getModelType = getModelType;  // getModelTypeFromSpecifics은 getModelType을 통해서만 호출될 수 있도록 한다.
exports.isUserSelectableType = isUserSelectableType;
exports.isControlType = isControlType;
exports.getUserSelectableTypeNameMap = getUserSelectableTypeNameMap;
exports.encryptableUserTypes = encryptableUserTypes;
exports.getModelTypeFromSpecificsFieldNumber = getModelTypeFromSpecificsFieldNumber;
exports.getSpecificsFieldNumberFromModelType = getSpecificsFieldNumberFromModelType;
exports.toFullModelTypeSet = toFullModelTypeSet;
exports.modelTypeToString = modelTypeToString;
exports.modelTypeToHistogramSuffix = modelTypeToHistogramSuffix;
exports.modelTypeToStableIdentifier = modelTypeToStableIdentifier;  // modelTypeToHistogramInt가 여기 내부에서만 사용되는 듯 하다.
exports.modelTypeToValue = modelTypeToValue;
exports.modelTypeFromString = modelTypeFromString;
exports.modelTypeSetToString = modelTypeSetToString;
exports.modelTypeSetFromString = modelTypeSetFromString;
exports.modelTypeSetToValue = modelTypeSetToValue;
exports.modelTypeToRootTag = modelTypeToRootTag;
exports.getModelTypeRootTag = getModelTypeRootTag;
exports.getRealModelTypeToNotificationType = getRealModelTypeToNotificationType;  // replaced
exports.getNotificationTypeToRealModelType = getNotificationTypeToRealModelType;  // replaced
//exports.realModelTypeToNotificationType = realModelTypeToNotificationType;  // deprecated
//exports.notificationTypeToRealModelType = notificationTypeToRealModelType;  // deprecated
//exports.isRealDataType = isRealDataType;
exports.isProxyType = isProxyType;
exports.isActOnceDataType = isActOnceDataType;
exports.isTypeWithServerGeneratedRoot = isTypeWithServerGeneratedRoot;
exports.isTypeWithClientGeneratedRoot = isTypeWithClientGeneratedRoot;
exports.typeSupportsHierarchy = typeSupportsHierarchy;
exports.typeSupportsOrdering = typeSupportsOrdering;

/* Only for tests */
exports.getModelTypeName = () => { return ModelTypeName; };
exports.getModelTypeInfoMap = () => { return kModelTypeInfoMap; };
exports.getSyncTypeName = () => { return SyncTypeName; };
