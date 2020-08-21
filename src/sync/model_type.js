const assert = require('assert');
const path = require('path');
const workspaceDir = path.join(__dirname, '../..');
let pbMessages = require(path.join(workspaceDir, 'google/protocol/sync_pb'));

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
  proto.sync_pb.EntitySpecifics.SpecificsVariantCase.BOOKMARK, 2],//
  [ModelType.PREFERENCES, "PREFERENCE", "preferences", "Preferences",
  proto.sync_pb.EntitySpecifics.SpecificsVariantCase.PREFERENCE, 3],
  [ModelType.PASSWORDS, "PASSWORD", "passwords", "Passwords",
  proto.sync_pb.EntitySpecifics.SpecificsVariantCase.PASSWORD, 4],
  [ModelType.AUTOFILL_PROFILE, "AUTOFILL_PROFILE", "autofill_profiles", "Autofill Profiles",
  proto.sync_pb.EntitySpecifics.SpecificsVariantCase.AUTOFILL_PROFILE, 5],
  [ModelType.AUTOFILL, "AUTOFILL", "autofill", "Autofill",
  proto.sync_pb.EntitySpecifics.SpecificsVariantCase.AUTOFILL, 6],
  [ModelType.AUTOFILL_WALLET_DATA, "AUTOFILL_WALLET", "autofill_wallet", "Autofill Wallet",
  proto.sync_pb.EntitySpecifics.SpecificsVariantCase.AUTOFILL_WALLET, 34],
  [ModelType.AUTOFILL_WALLET_METADATA, "WALLET_METADATA", "autofill_wallet_metadata", "Autofill Wallet Metadata",
  proto.sync_pb.EntitySpecifics.SpecificsVariantCase.WALLET_METADATA, 35],
  [ModelType.THEMES, "THEME", "themes", "Themes",
  proto.sync_pb.EntitySpecifics.SpecificsVariantCase.THEME, 7],
  [ModelType.TYPED_URLS, "TYPED_URL", "typed_urls", "Typed URLs",
  proto.sync_pb.EntitySpecifics.SpecificsVariantCase.TYPED_URL, 8],
  [ModelType.EXTENSIONS, "EXTENSION", "extensions", "Extensions",
  proto.sync_pb.EntitySpecifics.SpecificsVariantCase.EXTENSION, 9],
  [ModelType.SEARCH_ENGINES, "SEARCH_ENGINE", "search_engines", "Search Engines",
  proto.sync_pb.EntitySpecifics.SpecificsVariantCase.SEARCH_ENGINE, 10],
  [ModelType.SESSIONS, "SESSION", "sessions", "Sessions",
  proto.sync_pb.EntitySpecifics.SpecificsVariantCase.SESSION, 11],
  [ModelType.APPS, "APP", "apps", "Apps",
  proto.sync_pb.EntitySpecifics.SpecificsVariantCase.APP, 12],
  [ModelType.APP_SETTINGS, "APP_SETTING", "app_settings", "App settings",
  proto.sync_pb.EntitySpecifics.SpecificsVariantCase.APP_SETTING, 13],
  [ModelType.EXTENSION_SETTINGS, "EXTENSION_SETTING", "extension_settings", "Extension settings",
  proto.sync_pb.EntitySpecifics.SpecificsVariantCase.EXTENSION_SETTING, 14],
  [ModelType.APP_NOTIFICATIONS, "APP_NOTIFICATION", "app_notifications", "App Notifications",
  proto.sync_pb.EntitySpecifics.SpecificsVariantCase.APP_NOTIFICATION, 15],
  [ModelType.HISTORY_DELETE_DIRECTIVES, "HISTORY_DELETE_DIRECTIVE", "history_delete_directives", "History Delete Directives",
  proto.sync_pb.EntitySpecifics.SpecificsVariantCase.HISTORY_DELETE_DIRECTIVE, 16],
  [ModelType.SYNCED_NOTIFICATIONS, "SYNCED_NOTIFICATION", "synced_notifications", "Synced Notifications",
  proto.sync_pb.EntitySpecifics.SpecificsVariantCase.SYNCED_NOTIFICATION, 20],
  [ModelType.SYNCED_NOTIFICATION_APP_INFO, "SYNCED_NOTIFICATION_APP_INFO", "synced_notification_app_info", "Synced Notification App Info",
  proto.sync_pb.EntitySpecifics.SpecificsVariantCase.SYNCED_NOTIFICATION_APP_INFO, 31],
  [ModelType.DICTIONARY, "DICTIONARY", "dictionary", "Dictionary",
  proto.sync_pb.EntitySpecifics.SpecificsVariantCase.DICTIONARY, 22],
  [ModelType.FAVICON_IMAGES, "FAVICON_IMAGE", "favicon_images", "Favicon Images",
  proto.sync_pb.EntitySpecifics.SpecificsVariantCase.FAVICON_IMAGE, 23],
  [ModelType.FAVICON_TRACKING, "FAVICON_TRACKING", "favicon_tracking", "Favicon Tracking",
  proto.sync_pb.EntitySpecifics.SpecificsVariantCase.FAVICON_TRACKING, 24],
  [ModelType.DEVICE_INFO, "DEVICE_INFO", "device_info", "Device Info",
  proto.sync_pb.EntitySpecifics.SpecificsVariantCase.DEVICE_INFO, 18],
  [ModelType.PRIORITY_PREFERENCES, "PRIORITY_PREFERENCE", "priority_preferences", "Priority Preferences",
  proto.sync_pb.EntitySpecifics.SpecificsVariantCase.PRIORITY_PREFERENCE, 21],
  [ModelType.SUPERVISED_USER_SETTINGS, "MANAGED_USER_SETTING", "managed_user_settings", "Managed User Settings",
  proto.sync_pb.EntitySpecifics.SpecificsVariantCase.MANAGED_USER_SETTING, 26],
  [ModelType.DEPRECATED_SUPERVISED_USERS, "MANAGED_USER", "managed_users", "Managed Users",
  proto.sync_pb.EntitySpecifics.SpecificsVariantCase.MANAGED_USER, 27],
  [ModelType.DEPRECATED_SUPERVISED_USER_SHARED_SETTINGS, "MANAGED_USER_SHARED_SETTING", "managed_user_shared_settings", "Managed User Shared Settings",
  proto.sync_pb.EntitySpecifics.SpecificsVariantCase.MANAGED_USER_SHARED_SETTING, 30],
  [ModelType.DEPRECATED_ARTICLES, "ARTICLE", "deprecated_articles", "Deprecated Articles",
  proto.sync_pb.EntitySpecifics.SpecificsVariantCase.ARTICLE, 28],
  [ModelType.APP_LIST, "APP_LIST", "app_list", "App List",
  proto.sync_pb.EntitySpecifics.SpecificsVariantCase.APP_LIST, 29],
  [ModelType.DEPRECATED_WIFI_CREDENTIALS, "WIFI_CREDENTIAL", "wifi_credentials", "WiFi Credentials",
  proto.sync_pb.EntitySpecifics.SpecificsVariantCase.WIFI_CREDENTIAL, 32],
  [ModelType.SUPERVISED_USER_WHITELISTS, "MANAGED_USER_WHITELIST", "managed_user_whitelists", "Managed User Whitelists",
  proto.sync_pb.EntitySpecifics.SpecificsVariantCase.MANAGED_USER_WHITELIST, 33],
  [ModelType.ARC_PACKAGE, "ARC_PACKAGE", "arc_package", "Arc Package",
  proto.sync_pb.EntitySpecifics.SpecificsVariantCase.ARC_PACKAGE, 36],
  [ModelType.PRINTERS, "PRINTER", "printers", "Printers",
  proto.sync_pb.EntitySpecifics.SpecificsVariantCase.PRINTER, 37],
  [ModelType.READING_LIST, "READING_LIST", "reading_list", "Reading List",
  proto.sync_pb.EntitySpecifics.SpecificsVariantCase.READING_LIST, 38],
  [ModelType.USER_EVENTS, "USER_EVENT", "user_events", "User Events",
  proto.sync_pb.EntitySpecifics.SpecificsVariantCase.USER_EVENT, 39],
  [ModelType.MOUNTAIN_SHARES, "MOUNTAIN_SHARE", "mountain_shares", "Mountain Shares",
  proto.sync_pb.EntitySpecifics.SpecificsVariantCase.MOUNTAIN_SHARE, 40],
  [ModelType.USER_CONSENTS, "USER_CONSENT", "user_consent", "User Consents",
  proto.sync_pb.EntitySpecifics.SpecificsVariantCase.USER_CONSENT, 41],
  [ModelType.SEND_TAB_TO_SELF, "SEND_TAB_TO_SELF", "send_tab_to_self", "Send Tab To Self",
  proto.sync_pb.EntitySpecifics.SpecificsVariantCase.SEND_TAB_TO_SELF, 42],
  // ---- Proxy types ----
  [ModelType.PROXY_TABS, "", "", "Tabs", -1, 25],
  // ---- Control Types ----
  [ModelType.NIGORI, "NIGORI", "nigori", "Encryption Keys",
  proto.sync_pb.EntitySpecifics.SpecificsVariantCase.NIGORI, 17],
  [ModelType.EXPERIMENTS, "EXPERIMENTS", "experiments", "Experiments",
  proto.sync_pb.EntitySpecifics.SpecificsVariantCase.EXPERIMENTS, 19],
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
    assert(kModelTypeInfoMap.get(ModelTypeInfoMap[i][0]).getSpecificsFieldName() == SpecificsFieldName[getModelTypeNameFromModelType(ModelTypeInfoMap[i][0])]);
  }
};
//console.log("kModelTypeInfoMap:", kModelTypeInfoMap.entries())
assert(kModelTypeInfoMap.size == ModelType.MODEL_TYPE_COUNT, "kModelTypeInfoMap should have MODEL_TYPE_COUNT elements");
assert(43 == ModelType.MODEL_TYPE_COUNT, "When adding a new type, update enum SyncModelTypes in enums.xml", "and suffix SyncModelType in histograms.xml.");
assert(43 == ModelType.MODEL_TYPE_COUNT, "When adding a new type, update kAllocatorDumpNameWhitelist in ", "base/trace_event/memory_infra_background_whitelist.cc.");

function addDefaultFieldValue(modelType, pbEntitySpecifics) { // ModelType, sync_pb::EntitySpecifics
  assert(modelType <= ModelType.MODEL_TYPE_COUNT);
  switch (modelType) {
    case ModelType.UNSPECIFIED:
    case ModelType.TOP_LEVEL_FOLDER:
    case ModelType.PROXY_TABS:
    case ModelType.MODEL_TYPE_COUNT:
      console.error('\x1b[35m%s\x1b[0m', 'Warning: No default field value for ', getModelTypeNameFromModelType(modelType));
      break;
    case ModelType.BOOKMARKS:
      pbEntitySpecifics.setBookmark(new proto.sync_pb.BookmarkSpecifics());
      break;
    case ModelType.PREFERENCES:
      pbEntitySpecifics.setPreference(new proto.sync_pb.PreferenceSpecifics());
      break;
    case ModelType.PASSWORDS:
      pbEntitySpecifics.setPassword(new proto.sync_pb.PasswordSpecifics());
      break;
    case ModelType.AUTOFILL_PROFILE:
      pbEntitySpecifics.setAutofillProfile(new proto.sync_pb.AutofillProfileSpecifics());
      break;
    case ModelType.AUTOFILL:
      pbEntitySpecifics.setAutofill(new proto.sync_pb.AutofillSpecifics());
      break;
    case ModelType.AUTOFILL_WALLET_DATA:
      pbEntitySpecifics.setAutofillWallet(new proto.sync_pb.AutofillWalletSpecifics());
      break;
    case ModelType.AUTOFILL_WALLET_METADATA:
      pbEntitySpecifics.setWalletMetadata(new proto.sync_pb.WalletMetadataSpecifics());
      break;
    case ModelType.THEMES:
      pbEntitySpecifics.setTheme(new proto.sync_pb.ThemeSpecifics());
      break;
    case ModelType.TYPED_URLS:
      pbEntitySpecifics.setTypedUrl(new proto.sync_pb.TypedUrlSpecifics());
      break;
    case ModelType.EXTENSIONS:
      pbEntitySpecifics.setExtension$(new proto.sync_pb.ExtensionSpecifics());
      break;
    case ModelType.SEARCH_ENGINES:
      pbEntitySpecifics.setSearchEngine(new proto.sync_pb.SearchEngineSpecifics());
      break;
    case ModelType.SESSIONS:
      pbEntitySpecifics.setSession(new proto.sync_pb.SessionSpecifics());
      break;
    case ModelType.APPS:
      pbEntitySpecifics.setApp(new proto.sync_pb.AppSpecifics());
      break;
    case ModelType.APP_SETTINGS:
      pbEntitySpecifics.setAppSetting(new proto.sync_pb.AppSettingSpecifics());
      break;
    case ModelType.EXTENSION_SETTINGS:
      pbEntitySpecifics.setExtensionSetting(new proto.sync_pb.ExtensionSpecifics());
      break;
    case ModelType.APP_NOTIFICATIONS:
      pbEntitySpecifics.setAppNotification(new proto.sync_pb.AppNotification());
      break;
    case ModelType.HISTORY_DELETE_DIRECTIVES:
      pbEntitySpecifics.setHistoryDeleteDirective(new proto.sync_pb.HistoryDeleteDirectiveSpecifics());
      break;
    case ModelType.SYNCED_NOTIFICATIONS:
      pbEntitySpecifics.setSyncedNotification(new proto.sync_pb.SyncedNotificationSpecifics());
      break;
    case ModelType.SYNCED_NOTIFICATION_APP_INFO:
      pbEntitySpecifics.setSyncedNotificationAppInfo(new proto.sync_pb.SyncedNotificationAppInfoSpecifics());
      break;
    case ModelType.DICTIONARY:
      pbEntitySpecifics.setDictionary(new proto.sync_pb.DictionarySpecifics());
      break;
    case ModelType.FAVICON_IMAGES:
      pbEntitySpecifics.setFaviconImage(new proto.sync_pb.FaviconImageSpecifics());
      break;
    case ModelType.FAVICON_TRACKING:
      pbEntitySpecifics.setFaviconTracking(new proto.sync_pb.FaviconTrackingSpecifics());
      break;
    case ModelType.DEVICE_INFO:
      pbEntitySpecifics.setDeviceInfo(new proto.sync_pb.DeviceInfoSpecifics());
      break;
    case ModelType.PRIORITY_PREFERENCES:
      pbEntitySpecifics.setPriorityPreference(new proto.sync_pb.PriorityPreferenceSpecifics());
      break;
    case ModelType.SUPERVISED_USER_SETTINGS:
      pbEntitySpecifics.setManagedUserSetting(new proto.sync_pb.ManagedUserSettingSpecifics());
      break;
    case ModelType.DEPRECATED_SUPERVISED_USERS:
      pbEntitySpecifics.setManagedUser(new proto.sync_pb.ManagedUserSpecifics());
      break;
    case ModelType.DEPRECATED_SUPERVISED_USER_SHARED_SETTINGS:
      pbEntitySpecifics.setManagedUserSharedSetting(new proto.sync_pb.ManagedUserSharedSettingSpecifics());
      break;
    case ModelType.DEPRECATED_ARTICLES:
      pbEntitySpecifics.setArticle(new proto.sync_pb.ArticleSpecifics());
      break;
    case ModelType.APP_LIST:
      pbEntitySpecifics.setAppList(new proto.sync_pb.AppListSpecifics());
      break;
    case ModelType.DEPRECATED_WIFI_CREDENTIALS:
      pbEntitySpecifics.setWifiCredential(new proto.sync_pb.WifiCredentialSpecifics());
      break;
    case ModelType.SUPERVISED_USER_WHITELISTS:
      pbEntitySpecifics.setManagedUserWhitelist(new proto.sync_pb.ManagedUserWhitelistSpecifics());
      break;
    case ModelType.ARC_PACKAGE:
      pbEntitySpecifics.setArcPackage(new proto.sync_pb.ArcPackageSpecifics());
      break;
    case ModelType.PRINTERS:
      pbEntitySpecifics.setPrinter(new proto.sync_pb.PrinterSpecifics());
      break;
    case ModelType.READING_LIST:
      pbEntitySpecifics.setReadingList(new proto.sync_pb.ReadingListSpecifics());
      break;
    case ModelType.USER_EVENTS:
      pbEntitySpecifics.setUserEvent(new proto.sync_pb.UserEventSpecifics());
      break;
    case ModelType.MOUNTAIN_SHARES:
      pbEntitySpecifics.setMountainShare(new proto.sync_pb.MountainShareSpecifics());
      break;
    case ModelType.USER_CONSENTS:
      pbEntitySpecifics.setUserConsent(new proto.sync_pb.UserConsentSpecifics());
      break;
    case ModelType.SEND_TAB_TO_SELF:
      pbEntitySpecifics.setSendTabToSelf(new proto.sync_pb.SendTabToSelfSpecifics());
      break;
    case ModelType.NIGORI:
      pbEntitySpecifics.setNigori(new proto.sync_pb.NigoriSpecifics());
      break;
    case ModelType.EXPERIMENTS:
      pbEntitySpecifics.setExperiments(new proto.sync_pb.ExperimentsSpecifics());
      break;
  }
};

function getModelType(pbSyncEntity) {  // sync_pb::SyncEntity
  //assert(isRoot(pbSyncEntity));
  let specificsModelType = getModelTypeFromSpecifics(pbSyncEntity.getSpecifics());
  if (specificsModelType != ModelType.UNSPECIFIED) {
    return specificsModelType;
  }
  if (pbSyncEntity.getServerDefinedUniqueTag() != undefined && isFolder(pbSyncEntity)) {
    return ModelType.TOP_LEVEL_FOLDER;
  }
  console.error('\x1b[35m%s\x1b[0m', 'NOT REACHED: Unknown datatype in sync proto.');
  return ModelType.UNSPECIFIED;
};

function getModelTypeFromSpecifics(pbEntitySpecifics) {  // sync_pb::EntitySpecifics
  assert(43 == ModelType.MODEL_TYPE_COUNT, "When adding new protocol types, the following type lookup", "logic must be updated.");
  if (pbEntitySpecifics.hasBookmark())
    return ModelType.BOOKMARKS;
  if (pbEntitySpecifics.hasPreference())
    return ModelType.PREFERENCES;
  if (pbEntitySpecifics.hasPassword())
    return ModelType.PASSWORDS;
  if (pbEntitySpecifics.hasAutofillProfile())
    return ModelType.AutofillProfile;
  if (pbEntitySpecifics.hasAutofill())
    return ModelType.AUTOFILL;
  if (pbEntitySpecifics.hasAutofillWallet())
    return ModelType.AUTOFILL_WALLET_DATA;
  if (pbEntitySpecifics.hasWalletMetadata())
    return ModelType.AUTOFILL_WALLET_METADATA;
  if (pbEntitySpecifics.hasTheme())
    return ModelType.THEMES;
  if (pbEntitySpecifics.hasTypedUrl())
    return ModelType.TYPED_URLS;
  if (pbEntitySpecifics.hasExtension$())  // TODO: Generate 버그인 것 같음. 확인 필요
    return ModelType.EXTENSIONS;
  if (pbEntitySpecifics.hasSearchEngine())
    return ModelType.SEARCH_ENGINES;
  if (pbEntitySpecifics.hasSession())
    return ModelType.SESSIONS;
  if (pbEntitySpecifics.hasApp())
    return ModelType.APPS;
  if (pbEntitySpecifics.hasAppSetting())
    return ModelType.APP_SETTINGS;
  if (pbEntitySpecifics.hasExtensionSetting())
    return ModelType.EXTENSION_SETTINGS;
  if (pbEntitySpecifics.hasAppNotification())
    return ModelType.APP_NOTIFICATIONS;
  if (pbEntitySpecifics.hasHistoryDeleteDirective())
    return ModelType.HISTORY_DELETE_DIRECTIVES;
  if (pbEntitySpecifics.hasSyncedNotification())
    return ModelType.SYNCED_NOTIFICATIONS;
  if (pbEntitySpecifics.hasSyncedNotificationAppInfo())
    return ModelType.SYNCED_NOTIFICATION_APP_INFO;
  if (pbEntitySpecifics.hasDictionary())
    return ModelType.DICTIONARY;
  if (pbEntitySpecifics.hasFaviconImage())
    return ModelType.FAVICON_IMAGES;
  if (pbEntitySpecifics.hasFaviconTracking())
    return ModelType.FAVICON_TRACKING;
  if (pbEntitySpecifics.hasDeviceInfo())
    return ModelType.DEVICE_INFO;
  if (pbEntitySpecifics.hasPriorityPreference())
    return ModelType.PRIORITY_PREFERENCES;
  if (pbEntitySpecifics.hasManagedUserSetting())
    return ModelType.SUPERVISED_USER_SETTINGS;
  if (pbEntitySpecifics.hasManagedUser())
    return ModelType.DEPRECATED_SUPERVISED_USERS;
  if (pbEntitySpecifics.hasManagedUserSharedSetting())
    return ModelType.DEPRECATED_SUPERVISED_USER_SHARED_SETTINGS;;
  if (pbEntitySpecifics.hasArticle())
    return ModelType.DEPRECATED_ARTICLES;
  if (pbEntitySpecifics.hasAppList())
    return ModelType.APP_LIST;
  if (pbEntitySpecifics.hasWifiCredential())
    return ModelType.DEPRECATED_WIFI_CREDENTIALS;
  if (pbEntitySpecifics.hasManagedUserWhitelist())
    return ModelType.SUPERVISED_USER_WHITELISTS;
  if (pbEntitySpecifics.hasArcPackage())
    return ModelType.ARC_PACKAGE
  if (pbEntitySpecifics.hasPrinter())
    return ModelType.PRINTERS;
  if (pbEntitySpecifics.hasReadingList())
    return ModelType.READING_LIST;
  if (pbEntitySpecifics.hasUserEvent())
    return ModelType.USER_EVENTS;
  if (pbEntitySpecifics.hasMountainShare())
    return ModelType.MOUNTAIN_SHARES;
  if (pbEntitySpecifics.hasUserConsent())
    return ModelType.USER_CONSENTS;
  if (pbEntitySpecifics.hasNigori())
    return ModelType.NIGORI;
  if (pbEntitySpecifics.hasExperiments())
    return ModelType.EXPERIMENTS;
  if (pbEntitySpecifics.hasSendTabToSelf())
    return ModelType.SEND_TAB_TO_SELF;
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
exports.modelTypeSet = modelTypeSet;
//exports.syncTypeToProtocolDataTypeId = syncTypeToProtocolDataTypeId;
exports.getModelTypeNameFromModelType = getModelTypeNameFromModelType;
exports.addDefaultFieldValue = addDefaultFieldValue;
exports.getModelTypeFromSpecifics = getModelTypeFromSpecifics
exports.getModelType = getModelType;
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

exports.commitOnlyTypes = commitOnlyTypes;