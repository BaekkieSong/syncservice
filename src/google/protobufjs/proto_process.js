var protobuf = require('protobufjs');

//json file load
//var jsonDescriptor = require("example.json");
//var root = protobuf.Root.fromJSON(jsonDescriptor);

const path = require('path');
const workspaceDir = path.join(__dirname, '../../..');
PROTO_DIR = path.join(workspaceDir, 'google/protocol');



module.exports = class SyncPb {
  constructor() { }
  processAsyncProto() {
    console.log("process protobuf Async");
    var msg = ""
    var sync_msg = protobuf.load(PROTO_DIR + "/sync.proto", (error, root) => {
      if (error)
        throw error;
      if (true) {//getUpdateMessage 
        msg = this.getUpdatesMessage(root);
        console.log("async protobuf msg: ", msg);  //async라 그냥 내부에서 처리되야 함
      }
    });
    console.log("sync area: ", msg);//여긴 synced영역(load 바깥)이므로, msg값이 undefiend
  }
  getLoopbackServerProto() {
    return protobuf.loadSync(PROTO_DIR + "/loopback_server.proto");
  }
  getSyncProto() {
    // let data = protobuf.loadSync('./protobuf/new_protocol/app_list_specifics.proto');
    // let data1 = protobuf.loadSync('./protobuf/new_protocol/app_notification_specifics.proto');
    // let data2 = protobuf.loadSync('./protobuf/new_protocol/app_setting_specifics.proto');
    // let data3 = protobuf.loadSync('./protobuf/new_protocol/app_specifics.proto');
    // let data4 = protobuf.loadSync('./protobuf/new_protocol/arc_package_specifics.proto');
    // let data5 = protobuf.loadSync('./protobuf/new_protocol/article_specifics.proto');
    // let data6 = protobuf.loadSync('./protobuf/new_protocol/autofill_specifics.proto');
    // let data7 = protobuf.loadSync('./protobuf/new_protocol/bookmark_model_metadata.proto');
    // let data8 = protobuf.loadSync('./protobuf/new_protocol/bookmark_specifics.proto');
    // let data9 = protobuf.loadSync('./protobuf/new_protocol/client_commands.proto');
    // let data10 = protobuf.loadSync('./protobuf/new_protocol/client_debug_info.proto');
    // let data11 = protobuf.loadSync('./protobuf/new_protocol/device_info_specifics.proto');
    // let data12 = protobuf.loadSync('./protobuf/new_protocol/dictionary_specifics.proto');
    // let data13 = protobuf.loadSync('./protobuf/new_protocol/encryption.proto');
    // let data14 = protobuf.loadSync('./protobuf/new_protocol/entity_metadata.proto');
    // let data15 = protobuf.loadSync('./protobuf/new_protocol/experiment_status.proto');
    // let data16 = protobuf.loadSync('./protobuf/new_protocol/experiments_specifics.proto');
    // let data17 = protobuf.loadSync('./protobuf/new_protocol/extension_setting_specifics.proto');
    // let data18 = protobuf.loadSync('./protobuf/new_protocol/extension_specifics.proto');
    // let data19 = protobuf.loadSync('./protobuf/new_protocol/favicon_image_specifics.proto');
    // let data20 = protobuf.loadSync('./protobuf/new_protocol/favicon_tracking_specifics.proto');
    // let data21 = protobuf.loadSync('./protobuf/new_protocol/get_updates_caller_info.proto');
    // let data22 = protobuf.loadSync('./protobuf/new_protocol/history_delete_directive_specifics.proto');
    // let data23 = protobuf.loadSync('./protobuf/new_protocol/history_status.proto');
    // let data24 = protobuf.loadSync('./protobuf/new_protocol/loopback_server.proto');
    // let data25 = protobuf.loadSync('./protobuf/new_protocol/managed_user_setting_specifics.proto');
    // let data26 = protobuf.loadSync('./protobuf/new_protocol/managed_user_shared_setting_specifics.proto');
    // let data27 = protobuf.loadSync('./protobuf/new_protocol/managed_user_specifics.proto');
    // let data28 = protobuf.loadSync('./protobuf/new_protocol/managed_user_whitelist_specifics.proto');
    // let data29 = protobuf.loadSync('./protobuf/new_protocol/model_type_state.proto');
    // let data30 = protobuf.loadSync('./protobuf/new_protocol/model_type_store_schema_descriptor.proto');
    // let data31 = protobuf.loadSync('./protobuf/new_protocol/mountain_share_specifics.proto');
    // let data32 = protobuf.loadSync('./protobuf/new_protocol/nigori_specifics.proto');
    // let data33 = protobuf.loadSync('./protobuf/new_protocol/password_specifics.proto');
    // let data34 = protobuf.loadSync('./protobuf/new_protocol/persisted_entity_data.proto');
    // let data35 = protobuf.loadSync('./protobuf/new_protocol/preference_specifics.proto');
    // let data36 = protobuf.loadSync('./protobuf/new_protocol/printer_specifics.proto');
    // let data37 = protobuf.loadSync('./protobuf/new_protocol/priority_preference_specifics.proto');
    // let data38 = protobuf.loadSync('./protobuf/new_protocol/reading_list_specifics.proto');
    // let data39 = protobuf.loadSync('./protobuf/new_protocol/search_engine_specifics.proto');
    // let data40 = protobuf.loadSync('./protobuf/new_protocol/send_tab_to_self_specifics.proto');
    // let data41 = protobuf.loadSync('./protobuf/new_protocol/session_specifics.proto');
    // let data42 = protobuf.loadSync('./protobuf/new_protocol/sync_enums.proto');
    // let data43 = protobuf.loadSync('./protobuf/new_protocol/synced_notification_app_info_specifics.proto');
    // let data44 = protobuf.loadSync('./protobuf/new_protocol/synced_notification_specifics.proto');
    // let data45 = protobuf.loadSync('./protobuf/new_protocol/test.proto');
    // let data46 = protobuf.loadSync('./protobuf/new_protocol/theme_specifics.proto');
    // let data47 = protobuf.loadSync('./protobuf/new_protocol/typed_url_specifics.proto');
    // let data48 = protobuf.loadSync('./protobuf/new_protocol/unique_position.proto');
    // let data49 = protobuf.loadSync('./protobuf/new_protocol/user_consent_specifics.proto');
    // let data50 = protobuf.loadSync('./protobuf/new_protocol/user_consent_types.proto');
    // let data51 = protobuf.loadSync('./protobuf/new_protocol/user_event_specifics.proto');
    // let data52 = protobuf.loadSync('./protobuf/new_protocol/wifi_credential_specifics.proto');
    // let data53 = protobuf.loadSync('./protobuf/new_protocol/sync.proto');
    
    //console.log("process protobuf Synced");
    return protobuf.loadSync(PROTO_DIR + "/sync.proto");
  }

  getUpdatesMessage(root) {
    root.lookup
    let sync_msg = root.lookupType('sync_pb.GetUpdatesMessage');
      var fields = {
        from_timestamp: 2222,
        fetch_folders: false,
      }
      var errMsg = sync_msg.verify(fields);
      if (errMsg)
        throw Error(errMsg);
      var proto_msg = sync_msg.create(fields);
      console.log("async protobuf msg2: ", proto_msg);
      return sync_msg;
  }
};

/*
console.log(__dirname + PROTO_DIR + "/sync.proto");
protobuf.load(__dirname + PROTO_DIR + "/sync.proto", (error, root) => {
  if (error)
    throw error;

  // 일단 원하는 message타입을 얻어옴
  var sync_msg = root.lookupType('sync_pb.GetUpdatesMessage');
  console.log(sync_msg);
  // var sync_fields = sync_msg.fields;
  // sync_fields['from_timestamp'] = 1111;
  // sync_fields[1] = 2222;
  // sync_fields[2] = 11;

  sync_msg.setOptions({batch_size: 5});
  console.log("option: ", sync_msg.getOption('batch_size'));
  console.log(sync_msg);


  var fields = {
    from_timestamp: 1111,
    fetch_folders: true,
  }
  var errMsg = sync_msg.verify(fields);
  if (errMsg)
    throw Error(errMsg);
  console.log(fields);
  var proto_msg = sync_msg.create(fields);
  console.log(proto_msg);
  // // 삽입할 fileds값 정의
  // var fields = {
  //   query: "string",
  //   number: 1,
  //   result: 200,
  // }

  // // fields 값이 적절한지 확인
  // var errMsg = message.verify(fields);
  // if (errMsg)
  //   throw Error(errMsg);

  // var real_message = message.create(fields);
  // console.log("Real: ", real_message);
});*/