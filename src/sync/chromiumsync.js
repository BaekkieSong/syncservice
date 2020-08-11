const { FieldBase } = require("protobufjs");
const { find, findSeries } = require("async");
const assert = require('assert');
let crypto = require('crypto');
const { realpathSync } = require("fs");
const { ALL } = require("dns");

const path = require('path');
const workspaceDir = path.join(__dirname, '../..');
let sync_pb = require(path.join(workspaceDir, 'src/google/protobufjs/proto_process.js'));

/* 주의
  dataType은 AllTypesObject에서 해당 타입에 대한 값(0~36).
  syncType은 해당 동기화타입값에 대한 메시지
*/

/* 공용 Proto 메시지 정의 */
let pb = new sync_pb();
let proto = pb.getSyncProto();  //sync.proto파일 Load
let entityMsg = proto.root.lookupType('sync_pb.EntitySpecifics');
let csResponseMsg = proto.root.lookupType('sync_pb.ClientToServerResponse');
let errorMsg = csResponseMsg.lookupType('Error');
let syncEntityMsg = proto.root.lookupType('sync_pb.SyncEntity');

/* 공용 상수 */
// dataType(Key) : dataType(Value)
// dataType이라고 하면 Key를 의미하는 것으로 함
// value는 dataValue
const AllTypesObject = {  // == ALL_TYPES. //AllTypesObject is not iterable
  TOP_LEVEL_FOLDER: 'TOP_LEVEL_FOLDER',  // Top level folder name. 'Google Chrome' => 'ToGate'
  APPS: 'APPS',
  APP_LIST: 'APP_LIST',
  APP_NOTIFICATION: 'APP_NOTIFICATION',
  APP_SETTINGS: 'APP_SETTINGS',
  ARC_PACKAGE: 'ARC_PACKAGE',
  ARTICLE: 'ARTICLE',
  AUTOFILL: 'AUTOFILL',
  AUTOFILL_PROFILE: 'AUTOFILL_PROFILE',
  AUTOFILL_WALLET_DATA: 'AUTOFILL_WALLET_DATA',
  AUTOFILL_WALLET_METADATA: 'AUTOFILL_WALLET_METADATA',
  BOOKMARKS: 'BOOKMARKS',
  DEVICE_INFO: 'DEVICE_INFO',
  DICTIONARY: 'DICTIONARY',
  EXPERIMENTS: 'EXPERIMENTS',
  EXTENSIONS: 'EXTENSIONS',
  HISTORY_DELETE_DIRECTIVES: 'HISTORY_DELETE_DIRECTIVES',
  MANAGED_USER_SETTINGS: 'MANAGED_USER_SETTINGS',
  MANAGED_USER_SHARED_SETTING: 'MANAGED_USER_SHARED_SETTING',
  SUPERVISED_USER_WHITELISTS: 'SUPERVISED_USER_WHITELISTS',
  MANAGED_USER: 'MANAGED_USER',
  NIGORI: 'NIGORI',
  PASSWORDS: 'PASSWORDS',
  PREFERENCES: 'PREFERENCES',
  PRINTERS: 'PRINTERS',
  PRIORITY_PREFERENCES: 'PRIORITY_PREFERENCES',
  READING_LIST: 'READING_LIST',
  SEARCH_ENGINES: 'SEARCH_ENGINES',
  SESSIONS: 'SESSIONS',
  SYNCED_NOTIFICATIONS: 'SYNCED_NOTIFICATIONS',
  SYNCED_NOTIFICATION_APP_INFO: 'SYNCED_NOTIFICATION_APP_INFO',
  THEMES: 'THEMES',
  TYPED_URLS: 'TYPED_URLS',
  EXTENSION_SETTINGS: 'EXTENSION_SETTINGS',
  FAVICON_IMAGES: 'FAVICON_IMAGES',
  FAVICON_TRACKING: 'FAVICON_TRACKING',
  WIFI_CREDENTIAL: 'WIFI_CREDENTIAL',
};

const TOP_LEVEL_FOLDER_TAG = 'ToGate' // 'google_chrome'
/* 서버가 클라이언트에 보내야 되는 오류의 빈도값에 대한 열거.
오류를 유발하는 URL에 의해 지정됨
sync_test.h의 열거값과 동일한 순거로 유지되야 함
*/
const SyncErrorFrequency = {
  ERROR_FREQUENCY_NONE: 0,
  ERROR_FREQUENCY_ALWAYS: 1,
  ERROR_FREQUENCY_TWO_THIRDS: 2
}

// syncType(Key) : syncType(Value)
// syncType이라고 하면 Key를 의미하는 것으로 함. 
// value는 syncValue
const SyncTypeName = {    // == SYNC_TYPE_TO_DESCRIPTOR
  APPS: entityMsg.lookup('app'),
  APP_LIST: entityMsg.lookup('appList'),
  APP_NOTIFICATION: entityMsg.lookup('appNotification'),
  APP_SETTINGS: entityMsg.lookup('appSetting'),
  ARC_PACKAGE: entityMsg.lookup('arcPackage'),
  ARTICLE: entityMsg.lookup('article'),
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
  MANAGED_USER_SETTINGS: entityMsg.lookup('managedUserSetting'),
  MANAGED_USER_SHARED_SETTING: entityMsg.lookup('managedUserSharedSetting'),
  SUPERVISED_USER_WHITELISTS: entityMsg.lookup('managedUserWhitelist'),
  MANAGED_USER: entityMsg.lookup('managedUser'),
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
  WIFI_CREDENTIAL: entityMsg.lookup('wifiCredential'),
};

const ROOT_ID = 0 //TOP_LEVEL node

const FIRST_DAY_UNIX_TIME_EPOCH = [1970, 1, 2, 0, 0, 0, 4, 2, 0];
const ONE_DAY_SECONDS = 60 * 60 * 24;

const KEY_STORE_KEY_LENGTH = 16; //server에서 만든 암호화 키 Char Size

// 실험 노드들을 위한 해싱된 클라이언트 태그 값
const KEY_STORE_ENCRYPTION_EXPERIMENT_TAG = "temp";
const PRE_COMMIT_GU_AVOIDANCE_EXPERIMENT_TAG = "totemp";

const MAX_GET_UPDATES_BATCH_SIZE = 1000000; // loopback_server.h에 정의

const HTTP_OK = 200;
const HTTP_BAD_REQUEST = 400; // net::HTTP_BAD_REQUEST
const HTTP_INTERNAL_SERVER_ERROR = 500;

/* 공용 API */
function makeNewKeystoreKey() {
  let charRegix = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomKey = '';
  for (var i = 0; i < KEY_STORE_KEY_LENGTH; ++i) {
    randomKey += charRegix.charAt(Math.floor(Math.random() * charRegix.length));
  }
  console.log("LOG: random keystore key", randomKey);
  return randomKey;
};

function shortDataTypeListSummary(dataTypes) {
  /* Test코드. SyncType의 리스트를 컴팩트하게 보여줌.
  모든 타입값이 dataTypes에 포함된 경우 빈 타입 반환 */

  let included = dataTypes.filter((cur) => cur != AllTypesObject.TOP_LEVEL_FOLDER);
  if (!included) {
    return 'nothing';
  }
  let excluded = Object.entries(AllTypesObject).filter((cur) => cur[0] != AllTypesObject.TOP_LEVEL_FOLDER || cur[0] != included);
  if (!excluded) {
    return 'everything';
  }
  let simpleText = 'Summary: ' + included.reduce((acc, cur) => acc + ', ' + cur); // 첫번째 값은 묵음이네 ㅅㅂ...
  let excludedText = 'Excluded Summary: ' + excluded.reduce((acc, cur) => acc + ', ' + cur);
  if (simpleText.length <= excludedText.length) {
    return simpleText;
  } else {
    return excludedText;
  }
}

function getDefaultEntitySpecifics(syncType) {
  /* 동기화 타입의 기본 필드값을 가진 EntitySpecifics를 가져옴 */
  //let specifics = entityMsg; 
  /* 
  EntitySpecifics Message에 아래 DataType에 해당하는 메시지 필드를 'HasField'로 인식하도록 할 것임
  단, 기본 protobufjs에서는 Set되지 않은 필드를 구분할 수 없음
  그래서 일단, 그냥 생 JSON으로 넘겨줌
  */
  let default_spec = {};
  if (syncType in SyncTypeName) {
    let typeName = SyncTypeName[syncType];
    default_spec.datatype = typeName;
  }
  return default_spec;  // 원래 해당 DataType 메시지 필드가 HasField == True 처리된 EntitySpeicifics 메시지가 반환되어야 함 
};

/*   for debug assert check
getType('');         // String
getType(1);          // Number
getType(true);       // Boolean
getType(undefined);  // Undefined
getType(null);       // Null
getType({});         // Object
getType([]);         // Array
getType(/test/i);    // RegExp
getType(Math);       // Math
getType(new Date()); // Date
getType(function () {}); // Function
*/
function getType(target) {  //키 값에 해당하는 value의 타입
  return Object.prototype.toString.call(target).slice(8, -1);
};

function syncTypeToProtocolDataTypeId(syncType) { //키 값에 해당하는 실제 proto dataType Id. e.g. (BOOKMARK) -> 32904
  /* SyncTypeName to DataType Id. */
  return SyncTypeName[syncType].id;
};

function protocolDataTypeIdToSyncType(protocolDataTypeId) { // 실제 proto dataType Id에 해당하는 syncType 키 값.  e.g. (32904) -> BOOKMARK
  for (let name in SyncTypeName) {
    if (SyncTypeName[name].id == protocolDataTypeId) {
      return name;
    }
  }
  throw new Error('DataTypeIdNotRecognizedError');
};

/* 클래스 정의 */
class MigrationDoneError extends Error {
  constructor(message, dataTypes) {
    super(message);
    this.dataTypes = dataTypes; // 키 값을 받아와 Set
  }
};

class MigrationHistory {
  constructor() {
    this.migration = [];
    //let type_keys = Object.keys(AllTypesObject);
    //for (let datatype of type_keys) {
    for (let dataType in AllTypesObject) {
      assert('Number', getType(AllTypesObject[dataType]));
      this.migration[AllTypesObject[dataType]] = [1];
      //console.log(datatype, this.migration[datatype]);
    }
    this.nextMigrationVersion = 2;
  }

  /* 특정 데이터 타입의 마지막 버전값을 반환 */
  getLatestVersion(dataValue) {
    assert('Number', getType(dataValue));  //==typeValue
    return this.migration[dataValue][this.migration[dataValue].length - 1];   // 
  }

  /* Old버전일 경우 오류가 발생. 
  이 함수를 사용하면 의도적으로 트리거 된 순서대로 마이그레이션 반환
  이로인해 클라이언트는 하나의 row로 두 개의 마이그레이션들을 queue up(대기)시킬 수 있음
  두 번째 마이그레이션은 첫 번째 마이그레이션에 응답하는 동안 수신됨
  versions_map은 {데이터 타입:version} 인 맵
  불일치하는 값이 발견되면 MigrationDoneError 발생 */
  checkAllCurrent(versions_map) {
    // let problems = [];
    // for (let datatype in versions_map) {
    //   for (serverMigration in this.migration[datatype]) {
    //     if (clientMigration < serverMigration) {
    //       problems.
    //     }
    //   }
    // }
  }

  /* 향후 요청에 Error를 발생시키기 위해 마이그레이션의 기록을 추가 
  현재는 모든 데이터 버전+1 */
  bump(datatypes) {
    for (let datatype of datatypes) {
      this.migration[datatype].push(this.nextMigrationVersion);
      //console.log('bumped', this.migration[datatype]);
    }
    this.nextMigrationVersion += 1;
  }
};

class PermanentItem {
  constructor(obj) {
    this.tag = obj.tag;
    this.name = obj.name;
    this.parentTag = obj.parent_tag;
    this.syncType = obj.sync_type;
    this.createByDefault = obj.create_by_default; //default = True
  }
  print_data() {
    console.log(`LOG: tag: ${this.tag}, name: ${this.name}, parentTag: ${this.parentTag}, TypeName: ${this.syncType.name}, CreateByDefault: ${this.createByDefault}`);
  }
};

/* 각 동기화 계정에 대한 상태를 나타내는 Model */
class SyncDataModel {
  constructor(obj) {
    this.version = 0;  // 단조 증가. Object변경되면 +1 
    this.entries = {};  // 이 클라이언트의 items의 최종 사본. ID string -> SyncEntity protobuf로의 맵
    this.resetStoreBirthday();
    this.migration_history = new MigrationHistory();// 계정 관련 마이그레이션 이벤트 기록
    const Error = csResponseMsg.lookup('Error');
    const SyncEnums = Error.lookup('SyncEnums');
    const ErrorType = SyncEnums.getEnum('ErrorType');
    const Action = SyncEnums.getEnum('Action');
    this.inducedError = Error.create({ errorType: ErrorType.UNKNOWN, action: Action.UNKNOWN_ACTION });
    this.inducedErrorFrequency = 0;
    this.syncCountBeforeErrors = 0;
    this.acknowledgeManagedUsers = false;
    this.keys = [makeNewKeystoreKey()];
  }

  init() {
    /* Model에서 필요한 모든 영구 항목 등록 */
    /* TODO: sync_type이 문자열이 아니라 AllTypesObject 숫자값 
    현재는 idString로 사용 한정되어 문제는 없음*/
    const items = [
      new PermanentItem({ tag: `${TOP_LEVEL_FOLDER_TAG}_app`, name: 'App', parent_tag: ROOT_ID, sync_type: AllTypesObject.APPS, create_by_default: true }),
      new PermanentItem({ tag: `${TOP_LEVEL_FOLDER_TAG}_app_list`, name: 'App List', parent_tag: ROOT_ID, sync_type: AllTypesObject.APP_LIST, create_by_default: true }),
      new PermanentItem({ tag: `${TOP_LEVEL_FOLDER_TAG}_app_notification`, name: 'App Notification', parent_tag: ROOT_ID, sync_type: AllTypesObject.APP_NOTIFICATION, create_by_default: true }),
      new PermanentItem({ tag: `${TOP_LEVEL_FOLDER_TAG}_app_setting`, name: 'App Setting', parent_tag: ROOT_ID, sync_type: AllTypesObject.APP_SETTINGS, create_by_default: true }),
      new PermanentItem({ tag: `${TOP_LEVEL_FOLDER_TAG}_arc_package`, name: 'Arc Package', parent_tag: ROOT_ID, sync_type: AllTypesObject.ARC_PACKAGE, create_by_default: true }),
      new PermanentItem({ tag: `${TOP_LEVEL_FOLDER_TAG}_bookmark`, name: 'Bookmark', parent_tag: ROOT_ID, sync_type: AllTypesObject.BOOKMARKS, create_by_default: true }),
      new PermanentItem({ tag: `bookmark_bar`, name: 'Bookmark Bar', parent_tag: `${TOP_LEVEL_FOLDER_TAG}_bookmark`, sync_type: AllTypesObject.BOOKMARK, create_by_default: true }),
      new PermanentItem({ tag: `other_bookmarks`, name: 'Other Bookmark', parent_tag: `${TOP_LEVEL_FOLDER_TAG}_bookmark`, sync_type: AllTypesObject.BOOKMARK, create_by_default: true }),
      new PermanentItem({ tag: `synced_bookmarks`, name: 'Synced Bookmark', parent_tag: `${TOP_LEVEL_FOLDER_TAG}_bookmark`, sync_type: AllTypesObject.BOOKMARK, create_by_default: false }),  // false
      new PermanentItem({ tag: `${TOP_LEVEL_FOLDER_TAG}_autofill`, name: 'Autofill', parent_tag: ROOT_ID, sync_type: AllTypesObject.AUTOFILL, create_by_default: true }),
      new PermanentItem({ tag: `${TOP_LEVEL_FOLDER_TAG}_autofill_profile`, name: 'Autofill Profile', parent_tag: ROOT_ID, sync_type: AllTypesObject.AUTOFILL_PROFILE, create_by_default: true }),
      new PermanentItem({ tag: `${TOP_LEVEL_FOLDER_TAG}_autofill_wallet`, name: 'Autofill Wallet', parent_tag: ROOT_ID, sync_type: AllTypesObject.AUTOFILL_WALLET_DATA, create_by_default: true }),
      new PermanentItem({ tag: `${TOP_LEVEL_FOLDER_TAG}_autofill_wallet_metadata`, name: 'Autofill Wallet Metadata', parent_tag: ROOT_ID, sync_type: AllTypesObject.AUTOFILL_WALLET_METADATA, create_by_default: true }),
      new PermanentItem({ tag: `${TOP_LEVEL_FOLDER_TAG}_device_info`, name: 'Device Info', parent_tag: ROOT_ID, sync_type: AllTypesObject.DEVICE_INFO, create_by_default: true }),
      new PermanentItem({ tag: `${TOP_LEVEL_FOLDER_TAG}_experiments`, name: 'Experiments', parent_tag: ROOT_ID, sync_type: AllTypesObject.EXPERIMENTS, create_by_default: true }),
      new PermanentItem({ tag: `${TOP_LEVEL_FOLDER_TAG}_extension_setting`, name: 'Extension Setting', parent_tag: ROOT_ID, sync_type: AllTypesObject.EXTENSION_SETTINGS, create_by_default: true }),
      new PermanentItem({ tag: `${TOP_LEVEL_FOLDER_TAG}_extension`, name: 'Extension', parent_tag: ROOT_ID, sync_type: AllTypesObject.EXTENSIONS, create_by_default: true }),
      new PermanentItem({ tag: `${TOP_LEVEL_FOLDER_TAG}_history_delete_directive`, name: 'History Delete Directive', parent_tag: ROOT_ID, sync_type: AllTypesObject.HISTORY_DELETE_DIRECTIVES, create_by_default: true }),
      new PermanentItem({ tag: `${TOP_LEVEL_FOLDER_TAG}_favicon_image`, name: 'Favicon Image', parent_tag: ROOT_ID, sync_type: AllTypesObject.FAVICON_IMAGES, create_by_default: true }),
      new PermanentItem({ tag: `${TOP_LEVEL_FOLDER_TAG}_favicon_tracking`, name: 'Favicon Tracking', parent_tag: ROOT_ID, sync_type: AllTypesObject.FAVICON_TRACKING, create_by_default: true }),
      new PermanentItem({ tag: `${TOP_LEVEL_FOLDER_TAG}_managed_user_setting`, name: 'Managed User Setting', parent_tag: ROOT_ID, sync_type: AllTypesObject.MANAGED_USER_SETTINGS, create_by_default: true }),
      new PermanentItem({ tag: `${TOP_LEVEL_FOLDER_TAG}_managed_user`, name: 'Managed User', parent_tag: ROOT_ID, sync_type: AllTypesObject.MANAGED_USER, create_by_default: true }),
      new PermanentItem({ tag: `${TOP_LEVEL_FOLDER_TAG}_managed_user_shared_setting`, name: 'Managed User Shared Setting', parent_tag: ROOT_ID, sync_type: AllTypesObject.MANAGED_USER_SHARED_SETTING, create_by_default: true }),
      new PermanentItem({ tag: `${TOP_LEVEL_FOLDER_TAG}_managed_user_whitelist`, name: 'Managed User Whitelist', parent_tag: ROOT_ID, sync_type: AllTypesObject.SUPERVISED_USER_WHITELISTS, create_by_default: true }),
      new PermanentItem({ tag: `${TOP_LEVEL_FOLDER_TAG}_nigori`, name: 'Nigori', parent_tag: ROOT_ID, sync_type: AllTypesObject.NIGORI, create_by_default: true }),
      new PermanentItem({ tag: `${TOP_LEVEL_FOLDER_TAG}_password`, name: 'Password', parent_tag: ROOT_ID, sync_type: AllTypesObject.PASSWORDS, create_by_default: true }),
      new PermanentItem({ tag: `${TOP_LEVEL_FOLDER_TAG}_preference`, name: 'Preference', parent_tag: ROOT_ID, sync_type: AllTypesObject.PREFERENCES, create_by_default: true }),
      new PermanentItem({ tag: `${TOP_LEVEL_FOLDER_TAG}_printer`, name: 'Printer', parent_tag: ROOT_ID, sync_type: AllTypesObject.PRINTERS, create_by_default: false }), // false
      new PermanentItem({ tag: `${TOP_LEVEL_FOLDER_TAG}_priority_preference`, name: 'Priority Preference', parent_tag: ROOT_ID, sync_type: AllTypesObject.PRIORITY_PREFERENCES, create_by_default: true }),
      new PermanentItem({ tag: `${TOP_LEVEL_FOLDER_TAG}_reading_list`, name: 'Reading List', parent_tag: ROOT_ID, sync_type: AllTypesObject.READING_LIST, create_by_default: true }),
      new PermanentItem({ tag: `${TOP_LEVEL_FOLDER_TAG}_synced_notification`, name: 'Synced Notification', parent_tag: ROOT_ID, sync_type: AllTypesObject.SYNCED_NOTIFICATIONS, create_by_default: true }),
      new PermanentItem({ tag: `${TOP_LEVEL_FOLDER_TAG}_synced_notification_app_info`, name: 'Synced Notification App Info', parent_tag: ROOT_ID, sync_type: AllTypesObject.SYNCED_NOTIFICATION_APP_INFO, create_by_default: true }),
      new PermanentItem({ tag: `${TOP_LEVEL_FOLDER_TAG}_search_engine`, name: 'Search Engine', parent_tag: ROOT_ID, sync_type: AllTypesObject.SEARCH_ENGINES, create_by_default: true }),
      new PermanentItem({ tag: `${TOP_LEVEL_FOLDER_TAG}_session`, name: 'Session', parent_tag: ROOT_ID, sync_type: AllTypesObject.SESSIONS, create_by_default: true }),
      new PermanentItem({ tag: `${TOP_LEVEL_FOLDER_TAG}_theme`, name: 'Theme', parent_tag: ROOT_ID, sync_type: AllTypesObject.THEMES, create_by_default: true }),
      new PermanentItem({ tag: `${TOP_LEVEL_FOLDER_TAG}_typed_url`, name: 'Typed URL', parent_tag: ROOT_ID, sync_type: AllTypesObject.TYPED_URLS, create_by_default: true }),
      new PermanentItem({ tag: `${TOP_LEVEL_FOLDER_TAG}_wifi_credential`, name: 'WiFi Credential', parent_tag: ROOT_ID, sync_type: AllTypesObject.WIFI_CREDENTIAL, create_by_default: true }),
      new PermanentItem({ tag: `${TOP_LEVEL_FOLDER_TAG}_dictionary`, name: 'Dictionary', parent_tag: ROOT_ID, sync_type: AllTypesObject.DICTIONARY, create_by_default: true }),
      new PermanentItem({ tag: `${TOP_LEVEL_FOLDER_TAG}_article`, name: 'Article', parent_tag: ROOT_ID, sync_type: AllTypesObject.ARTICLE, create_by_default: true }),
    ]
    console.log("LOG: itemsize:", items.length);
    this.PermanentItemSpec = items;

    this.BatchSize = 100;
  }

  resetStoreBirthday() {
    this.storeBirthday = Math.random().toFixed(30);
  }

  getStoreBirthday() {
    return this.storeBirthday;
  }

  /* 변경사항 로그에 항목(entry) insert or update. 새 버전 제공 필요
  이 항목의 ID 필드들은 유효한 서버 IDs로 가정함.
  이 항목은 새 버전 넘버와 sync_timestamp로 업데이트
  args: entry - 추가되거나 업데이트 될 항목값을 파라미터로 받아 처리 */
  saveEntry(entry) {
    this.version += 1;    //현재 시간값과 동일함!
    /* 항목별x. 전역 시퀀스 넘버를 유지하고, 이를 항목별 버전, 업데이트 진행 TimeStamp로서 사용
    (origin서버 구현 동작) */
    entry.version = this.version;
    entry.syncTimestamp = this.version;
    /* 업데이트 할 때 클라이언트가 전송할 필요가 없는 발신자 정보를 유지하는 역할 */
    let baseEntry = this.entries[entry.idString];  // id_string이 일치하는 항목?
    if (baseEntry) {   // TODO: 현재 사용X
      entry.originatorCacheGuid = baseEntry.originatorCacheGuid;
      entry.originatorClientItemId = baseEntry.originatorClientItemId;
    };
    let copiedEntry = entry;
    this.entries[entry.idString] = copiedEntry;
  }
  /* change log 안에 item이 존재하고 있는지 여부를 리턴 */
  itemExists(idString) {
    return idString in this.entries;
  }
  /* 존재하지 않는 경우에 한해 spec으로부터 하나의 permanent item을 생성
  결과 item값은 change log에 추가됨
  args: spec - 생성할 item의 '속성' 정보를 가진 permanent item 객체 */
  createPermanentItem(spec) {
    let idString = this.serverTagTold(spec.tag);
    if (this.itemExists(idString)) {
      return;
    }
    console.log(`LOG: Create permanent item: ${spec.name}`);
    let entry = {}; // syncEntityMsg.create().toJSON();
    entry.idString = idString;
    entry.nonUniqueName = spec.name;
    entry.serverDefinedUniqueTag = spec.tag;
    entry.folder = true;
    entry.deleted = false;
    entry.specifics = getDefaultEntitySpecifics(spec.syncType);
    this.writePosition(entry, this.serverTagTold(spec.parentTag));  // Tree구조(북마크 등)에서 parentTag가 있는 경우 동작
    var errMsg = syncEntityMsg.verify(entry);
    if (errMsg) {
      console.error('LOG Create Entry Error:', errMsg);
    }
    let entryMsg = syncEntityMsg.create(entry);
    this.saveEntry(entryMsg);
  }

  createDefaultPermanentItems(requestedTypes) {
    /* 제공된 타입들의 집합에 대한 모든 Default Permanent Item들을 생성하도록 함
    args: requestedTypes - ALL_TYPES로 부터 Sync Type들의 리스트. 이러한 타입의 모든 Default Permanent Item 생성 */
    for (let spec of this.PermanentItemSpec) {
      // if (requestedTypes.find((x) => x == spec.syncType)) {//} && spec.createByDefault) {    // 이건 syncType이 문자열 값('APP' 등)이었을 때.
      if (Object.entries(requestedTypes).find((x) => x[1] == spec.syncType)) {                  // 이건 syncType이 숫자값일 때  
        this.createPermanentItem(spec);
      }
    }
  }

  /* 서버 Unique Tag를 통해 서버 ID 결정
  결과값은 다른 ID 생성 방법과 충돌되지 않는 것이 보증
  args: tag - 서버에서 생성된 항목의 Unique/Well Known 속성을 가진 클라이언트 Tag
  returns: 계산된 서버 ID 문자열 값 (id_string!?) */
  serverTagTold(tag) {
    if (!tag || tag == ROOT_ID) {
      return tag;
    }
    let spec = this.PermanentItemSpec.filter((it) => { return it.tag == tag; })[0];
    return this.makeCurrentId(spec.syncType, `<server tag>${tag}`);
  }
  /* 주어진 타입의 root노드 타입에 대한 서버ID를 리턴 */
  typeToTypeROOT_ID(model_type) {
    let tag = this.PermanentItemSpec.filter((it) => { return it.syncType == model_type[0] });
    return this.serverTagTold(tag);
  }
  /* 클라이언트 로컬 ID Tag에서 Unique서버 ID를 계산.
  결과값은 다른 ID생성방법과 충돌하지 않아야 함
  args: 
    datatype: 식별객체의 SyncType(Enum값)
    client_guid: 이 항목(item)을 만든 클라이언트의 글로벌 Unique ID
    client_item_id: 클라이언트 내에서 이 항목을 Unique하게 식별하는 항목ID 
  returns: 계산된 서버 ID 문자열 */
  clientIdToId(datatype, client_guid, client_item_id) {
    // 테스트를 위해 클라이언트 ID 대신 랜덤 ID 생성하여 반환
    // TODO: 원래 클라이언트 ID정보는 필요없다는 것 같다... 메서드 자체가 테스트 용일수도 있음
    return this.makeCurrentId(datatype, `<server ID originally>${client_guid}/${client_item_id}`);
  }
  makeCurrentId(datatype, innerId) {
    return `${datatype}^${this.migration_history.getLatestVersion(datatype)}^${innerId}`;
  }
  writePosition(entry, parentId) {
    /* entry가 하나의 숫자로된 절대값 position, 그리고 parentId를 가졌는지 확인.
    클라이언트는 insertAfterItemId 필드에서 선행작업 기반 참조를 사용하여 위치를 지정해 왔으며,
    현재는 '절대값 position'을 사용.
    서버는 positionInParent 값을 저장해야만 하며, insertAfterItemId는 유지해선 안됨
    클라이언트는 UniquePosition필드를 전송하고, 후속 GetUpdates에서 이를 저장 및 반환해야 함
    args:
      entry: position이 작성될 항목. 이 entry의 id필드값이 서버ID인 것으로 가정함!
      이 항목은 parentIdString, positionInParent, uniquePosition 필드가 갱신됨
      이 항목은 insertAfterItemId 필드가 삭제됨
      parentId: 새로 지정된 부모 항목의 ID */
    if (parentId != ROOT_ID) {                 //Tree 구조인 경우(북마크 등)에만 확인
      entry.parentIdString = parentId;
      if (!('positionInParent' in entry)) {   //entry.positionInParent 값이 있는지 확인
        entry.positionInParent = 1337;         // TODO: 디버그용 값임!!!!
      }
    }
    //assert(entry.insertAfterItemId);  // TODO: 현재 빈 값 들어옴...
    delete entry.insertAfterItemId;
  }

  setInducedError(error, errorFrequency, syncCountBeforeErrors) {
    this.inducedError = error;
    this.inducedErrorFrequency = errorFrequency;
    this.syncCountBeforeErrors = syncCountBeforeErrors;
  }

  getInducedError() {
    return this.inducedError;
  }
};

/* test server || LoopbackServer(SyncDataModel역할 포함) */
class InternalServer {
  constructor() {
    console.log('internalserver created');
    this.accountModel = new SyncDataModel();
    this.accountModel.init();
    //accountLock - lock 변수
    this.clients = {};
    /* 각 클라이언트의 Name은 Unique해야함. 이를 보장하기 위해 테스트코드에선 아래처럼 리스트 객체를 정의하여 순차적인 Name값을 부여함 */
    //this.clientNameGenerator = ('+' * times + c for (times in range(0, kMaxLength)) for (c in range(ord('A'), ord('Z'))));
    this.clientNameGenerator = [];//this.createRandomString(30);
    //console.log('generator:',this.clientNameGenerator);
    this.clientNameGenerator2 = crypto.randomBytes(20).toString('hex');
    console.log('TEST LOG: generator id:', this.clientNameGenerator2);
    //this.uuid = uuid.v4();
    //console.log('generator uuid:', this.uuid);
    this.transientError = false;
    this.syncCount = 0;
    this.response_code = HTTP_OK;
    this.requesToken = 'rt1';  //서버측 json에 저장된 refresh token값
    this.accessToken = 'at1';  //서버측 json에 저장된 access token값
    this.expiresIn = 3600;
    this.tokenType = 'Bearer';
    /* 각 ServerToClientResponse에서 다시 보낼 ClientCommand. None이면 ClientCommand포함X */
    this.clientCommand = null;
  }
  createRandomString(list, length) {  // client name을 생성하기 위해 임시로 작성된 함수
    let text = ''
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_'
    do {
      Array.from(Array(length)).forEach(() => {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
      })
    } while (list.filter((it) => it == text).length != 0);
    list.push(text);
    return text;
  }
  getShortClientName(query) {
    let clientId;
    console.log('LOG: client_id:', query.client_id);
    if (query.client_id == undefined) {
      console.log('LOG: undefined client_id:', query.client_id);
      return 'LOG: ?';
    } else {
      clientId = query.client_id;
      if (!(clientId in this.clients)) {
        this.createRandomString(this.clientNameGenerator, 30);
        this.clients[clientId] = this.clientNameGenerator[this.clientNameGenerator.length - 1];
        console.log(`LOG: new client ${clientId}: ${this.clients[clientId]}`);
      } else {
        console.log(`LOG: existing client ${clientId}: ${this.clients[clientId]}`);
      }
    }
    return this.clients[clientId];
  }

  checkStoreBirthday(csMessageData) {
    // store birthday는 optional이므로 빈 값일 수 있음.
    if (!csMessageData.storeBirthday) {
      return;
    }
    if (this.accountModel.getStoreBirthday() != csMessageData.storeBirthday) {
      throw new Error('StoreBirthdayError');
    }
  }

  checkTransientError() {
    if (this.transientError) {
      throw new Error('TransientError');
    }
  }

  checkSendError() {
    /* 동기화 중에 발생된(sync induced) 오류 */
    //errorMsg = csResponseMsg.lookupType('Error');
    const Error = csResponseMsg.lookup('Error');
    const SyncEnums = Error.lookup('SyncEnums');
    const ErrorType = SyncEnums.getEnum('ErrorType');
    if (this.accountModel.inducedError.errorType != ErrorType.UNKNOWN) {  // TODO: ?
      /* 모든 요청에 대해 발생된 오류는 항상 반환됨 */
      if (this.accountModel.inducedErrorFrequency == SyncErrorFrequency.ERROR_FREQUENCY_ALWAYS) {
        throw new Error('SyncInducedError');
      } else if (this.accountModel.inducedErrorFrequency == SyncErrorFrequency.ERROR_FREQUENCY_TWO_THIRDS) {
        /* 3번의 요청 중 처음 2번 요청은 오류를 반환함을 의미.(테스트 코드!!!!) */
        if ((this.syncCount - this.accountModel.syncCountBeforeErrors) % 3 != 0) {
          throw new Error('SyncInducedError');
        }
      } else {
        throw new Error('InducedErrorFrequencyNotDefinedError');
      }
    }
  }

  printContext(direction, query) {
    console.log('\x1b[35m%s\x1b[0m', `LOG: Client ${this.getShortClientName(query)} ${direction} ${__filename}`);
  }

  handleCommand(csMessageData, query) {
    /* 원시 바이트 입력에서 sync명령 디코딩하여 처리.
    멀티 스레드로 이 커맨드를 호출하는 것이 안전함. (async call하라는 듯)
    args: raw_requests - 반복 가능한 byte sequence. 동기화 프로토콜 커맨드로 해석될 값.
    returns: a tuple(responseCode, rawResponse) - 첫번째값은 HTTP결과값, 두번째값은 직렬화 된 응답 커맨드의 바이트 문자열 */
    this.printContext('<-', query);
    this.syncCount += 1;
    try {
      let csMessageMsg = proto.root.lookupType('sync_pb.ClientToServerMessage');
      const Contents = csMessageMsg.getEnum('Contents');
      const contents = csMessageData.messageContents;
      // let csMessageJSON = csMessageData.toJSON();
      // console.log(csMessageJSON);
      //csMessageData.messageContents = Contents.GET_UPDATES; //GET_UPDATES
      let csResponseMsg = proto.root.lookupType('sync_pb.ClientToServerResponse');
      let csResponseData = csResponseMsg.create();
      const SyncEnums = csResponseMsg.lookup('SyncEnums');
      const ErrorType = SyncEnums.getEnum('ErrorType');
      csResponseData.errorCode = ErrorType.SUCCESS;
      console.log('\x1b[33m%s\x1b[0m', 'created csResponse:', csResponseData);

      // if (csMessageData.getUpdates.fromProgressMarker) {
      //   let markers = [...csMessageData.getUpdates.fromProgressMarker];
      //   csMessageData.getUpdates.fromProgressMarker[0].token = 'aaaaaaaaaaaaaaaaaaaaa';
      //   console.log('\x1b[33m%s\x1b[0m', 'markers:', markers);           
      //   console.log('\x1b[33m%s\x1b[0m', 'messages:', csMessageData.getUpdates.fromProgressMarker);        
      // }

      if (this.clientCommand) {
        //csResponseData.clientCommand.CopyFrom(this.clientCommand)를 대체함
        // TODO: 적절한 딥카피 수행필요
        // 근데 딥카피라더니 딥카피 안되네;;;;;;;
        csResponseData.clientCommand = [...this.clientCommand]; //clientCommand가 Array라면 이렇게... 딥카피 가능
      }

      if (csMessageData.hasOwnProperty('storeBirthday')) {
        //this.checkStoreBirthday(csMessageData);
        csResponseData.storeBirthday = csMessageData.storeBirthday;
      } else {
        csResponseData.storeBirthday = this.accountModel.getStoreBirthday();
      }
      console.log('\x1b[33m%s\x1b[0m', 'csResponse store birthday:', csResponseData.storeBirthday);
      this.checkTransientError();
      this.checkSendError();
      this.printContext('->', query);
      if (contents == 'AUTHENTICATE' || contents == Contents.AUTHENTICATE) {
        console.log('Authenticate');
        csResponseData.authenticate = csResponseMsg.lookupType('AuthenticateResponse');
        csResponseData.authenticate.user = csResponseMsg.lookupType('UserIdentification');
        // TODO: Set appropriate user value. use DB.
        csResponseData.authenticate.user.email = 'aaa@naver.com';
        csResponseData.authenticate.user.displayName = 'bbb';
        // console.log(csResponseData.toJSON());
      } else if (contents == 'COMMIT' || contents == Contents.COMMIT) {
        // console.log(`Commit ${csMessageData.commit.entries.length} item(s)`);
        console.log('Commit');
        csMessageData.commit = csMessageMsg.lookup('CommitMessage');
        csResponseData.commit = csResponseMsg.lookup('CommitResponse');
        this.handleCommit(csMessageData.commit, csResponseData.commit);  // CommitMessage, CommitResponse Message
      } else if (contents == 'GET_UPDATES' || contents == Contents.GET_UPDATES) {
        console.log('GetUpdates');
        this.handleGetUpdates(csMessageData.getUpdates, csResponseData.getUpdates);  // GetUpdatesMessage, GetUpdatesResponse Message
        this.printContext('<-', query);
        // console.log(`${csResponseData.getUpdates.entries.length} update(s)`);
      } else if (contents == 'CLEAR_SERVER_DATA' || contents == Content.CLEAR_SERVER_DATA) {
        //clearServerData();
      } else {
        console.log('\x1b[31m%s\x1b[0m', 'ERROR: Unrecognizable Sync Request');
        return (HTTP_BAD_REQUEST, None);
      }
      csResponseData.errorCode = ErrorType.SUCCESS;
      return (HTTP_OK, csResponseMsg.encode(csResponseData).finish());

    } catch (err) {
      let csResponseMsg = proto.root.lookupType('sync_pb.ClientToServerResponse');
      let csResponseData = csResponseMsg.create();
      const SyncEnums = csResponseMsg.lookup('SyncEnums');
      const ErrorType = SyncEnums.getEnum('ErrorType');
      csResponseData.storeBirthday = this.accountModel.getStoreBirthday();
      this.printContext('<-', query);
      if (err.message == 'MigrationDoneError') {
        console.log('\x1b[31m%s\x1b[0m', `ERROR: Mygration Done`);
        //console.log(`ERROR: Mygration Done: <${this.ShortDataTypeListSummary(err.datatypes)}>`);
        csResponseData.errorCode = ErrorType.MIGRATION_DONE;
        csResponseData.migratedDataTypeId = err.dataTypes.map((cur) => syncTypeToProtocolDataTypeId(cur));  //'APP' 같이  키 값으로 넘겨줘야 함
        // TODO: need to check begin serialization. origin code: csResponseData.SerializeToString()
      } else if (err.message == 'StoreBirthdayError') {
        console.log('\x1b[31m%s\x1b[0m', 'ERROR: Not My Birthday');
        csResponseData.errorCode = ErrorType.NOT_MY_BIRTHDAY;
      } else if (err.message == 'TransientError') {
        console.log('\x1b[31m%s\x1b[0m', 'ERROR: Transient Error');
        csResponseData.errorCode = ErrorType.TRANSIENT_ERROR;
      } else if (err.message == 'SyncInducedError') {
        console.log('\x1b[31m%s\x1b[0m', 'ERROR: Induced Error');
        let error = this.accountModel.getInducedError();
        csResponseData.error = csResponseData.$type.lookupType('Error');
        csResponseData.error.errorType = error.errorType; //CToSResponse.Error
        csResponseData.error.url = error.url;
        csResponseData.error.error_description = error.errorDescription;
        csResponseData.error.action = error.action;
      }
      return (HTTP_INTERNAL_SERVER_ERROR, csResponseMsg.encode(csResponseData).finish());
      //if (err) throw err;
    } finally {
      // Lock 해제
    };
  }

  handleCommit(commitMessage, commitResponse) {
    /* 사용자 계정 변경사항에 의한 커밋 요청에 대한 처리 
    Test에서는 첫번째 오류 후에 커밋 시도가 중지되고, 시도되지 않은 항목에 대해서 CONFLICT 결과값 반환
    args:
      commitMessage: sync_pb.CommitMessage. 클라이언트 요청 정보
      commitResponse: sync_pb.CommitResponse. 요청에 대한 응답을 기록할 변수 */
    //commitResponse.SetInParent() <- 하위 필드들을 설정
    console.log('aaa');
    let batch_failure = false;
    let session = {};  // 커밋 중에 ID변경 추적
    let guid = commitMessage.cacheGuid;
    console.log('bbb');
    //this.accountModel.validateCommitEntries(commitMessage.entries);  // 요청에서 온 항목들의 유효성 검사
    /* 항목별 처리 시작 */
    for (let entry in commitMessage.entries) {
      let serverEntry = null;
      if (!batch_failure) {
        serverEntry = this.accountModel.commitEntry(entry, guid, session);  // 계정 변경사항 커밋 시도
      }
    }
    let commitResponseMsg = csResponseMsg.lookupType('CommitResponse');
    let entryresponseMsg = csResponseMsg.lookupType('EntryResponse');
    const ResponseType = commitResponseMsg.getEnum('ResponseType');
    let entry_list = [];
    let entry1 = { responseType: ResponseType.SUCCESS, idString: 'ccccc' };
    let entry2 = { responseType: ResponseType.CONFLICT, idString: 'dddd' };
    entry_list.push(entry1);
    entry_list.push(entry2);
    console.log(Object.values(entry_list));
    var err = entryresponseMsg.verify(entry1);
    if (err)
      console.log(err);
    let rs = entryresponseMsg.create(entry1);
    let rs2 = entryresponseMsg.create(entry2);
    //rs.$type.add(entry1);
    let response = commitResponse.create();
    console.log(response);
    response.entryResponse.push(rs);
    response.entryResponse.push(rs2);
    console.log(response);
    let response_en = commitResponseMsg.encode(response).finish();
    let response_de = commitResponseMsg.decode(response_en);
    console.log('deres', response_de);

  }

  handleGetUpdates(getUpdatesMessage, getUpdatesResponse) {
    console.log('\x1b[33m%s\x1b[0m', 'handle get_updates');
    getUpdatesResponse.changesRemaining = 0;
    /* 모바일 북마크 생성. client UI에서 'Synced Bookmarks' => 'Mobild Bookmarks'로 rename
    생성 실패할 경우 에러이므로 리턴*/ 
    /*
    let sieve = UpdateSeive(getUpdatesMessage);
    if (getUpdatesMessage.createMobileBookmarksFolder) //&& !createPermanentBookmarkFolder for Mobile
    {
      return false;
    }
    let wantedEntities = []; //std::vector<LoopbackServerEntity*>
    for (const id in entities_) { //EntityMap<string, LoopbackServerEntity>
      if (sieve.clientWantesItem(entities_[id])) {
        wantedEntities.push(entities_[id]);
      }
    }
    */
  }
};

/* internal server 초기화 */
let internalServer = new InternalServer();

/* exports */
exports.internalServer = internalServer;
exports.proto = proto;
/* exports for Test */
exports.AllTypesObject = AllTypesObject;
exports.SyncTypeName = SyncTypeName;
exports.makeNewKeystoreKey = () => makeNewKeystoreKey();
exports.protocolDataTypeIdToSyncType = (id) => protocolDataTypeIdToSyncType(id);
exports.syncTypeToProtocolDataTypeId = (syncType) => syncTypeToProtocolDataTypeId(syncType);
exports.shortDataTypeListSummary = (dataTypes) => shortDataTypeListSummary(dataTypes);
exports.MigrationHistory = MigrationHistory;
exports.PermanentItem = PermanentItem;
exports.SyncDataModel = SyncDataModel;
