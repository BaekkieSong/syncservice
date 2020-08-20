/**
 * @fileoverview
 * @enhanceable
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!

var jspb = require('google-protobuf');
var goog = jspb;
var global = Function('return this')();

var extension_specifics_pb = require('./extension_specifics_pb.js');
goog.object.extend(proto, extension_specifics_pb);
goog.exportSymbol('proto.sync_pb.AppNotificationSettings', null, global);
goog.exportSymbol('proto.sync_pb.AppSpecifics', null, global);
goog.exportSymbol('proto.sync_pb.AppSpecifics.LaunchType', null, global);
goog.exportSymbol('proto.sync_pb.LinkedAppIconInfo', null, global);
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sync_pb.AppNotificationSettings = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sync_pb.AppNotificationSettings, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sync_pb.AppNotificationSettings.displayName = 'proto.sync_pb.AppNotificationSettings';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sync_pb.LinkedAppIconInfo = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sync_pb.LinkedAppIconInfo, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sync_pb.LinkedAppIconInfo.displayName = 'proto.sync_pb.LinkedAppIconInfo';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sync_pb.AppSpecifics = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.sync_pb.AppSpecifics.repeatedFields_, null);
};
goog.inherits(proto.sync_pb.AppSpecifics, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sync_pb.AppSpecifics.displayName = 'proto.sync_pb.AppSpecifics';
}



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sync_pb.AppNotificationSettings.prototype.toObject = function(opt_includeInstance) {
  return proto.sync_pb.AppNotificationSettings.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sync_pb.AppNotificationSettings} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sync_pb.AppNotificationSettings.toObject = function(includeInstance, msg) {
  var obj = {
    initialSetupDone: jspb.Message.getField(msg, 1),
    disabled: jspb.Message.getField(msg, 2),
    oauthClientId: jspb.Message.getField(msg, 3)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sync_pb.AppNotificationSettings}
 */
proto.sync_pb.AppNotificationSettings.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sync_pb.AppNotificationSettings;
  return proto.sync_pb.AppNotificationSettings.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sync_pb.AppNotificationSettings} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sync_pb.AppNotificationSettings}
 */
proto.sync_pb.AppNotificationSettings.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setInitialSetupDone(value);
      break;
    case 2:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setDisabled(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setOauthClientId(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sync_pb.AppNotificationSettings.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sync_pb.AppNotificationSettings.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sync_pb.AppNotificationSettings} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sync_pb.AppNotificationSettings.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = /** @type {boolean} */ (jspb.Message.getField(message, 1));
  if (f != null) {
    writer.writeBool(
      1,
      f
    );
  }
  f = /** @type {boolean} */ (jspb.Message.getField(message, 2));
  if (f != null) {
    writer.writeBool(
      2,
      f
    );
  }
  f = /** @type {string} */ (jspb.Message.getField(message, 3));
  if (f != null) {
    writer.writeString(
      3,
      f
    );
  }
};


/**
 * optional bool initial_setup_done = 1;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.sync_pb.AppNotificationSettings.prototype.getInitialSetupDone = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldWithDefault(this, 1, false));
};


/** @param {boolean} value */
proto.sync_pb.AppNotificationSettings.prototype.setInitialSetupDone = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * Clears the field making it undefined.
 */
proto.sync_pb.AppNotificationSettings.prototype.clearInitialSetupDone = function() {
  jspb.Message.setField(this, 1, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sync_pb.AppNotificationSettings.prototype.hasInitialSetupDone = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional bool disabled = 2;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.sync_pb.AppNotificationSettings.prototype.getDisabled = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldWithDefault(this, 2, false));
};


/** @param {boolean} value */
proto.sync_pb.AppNotificationSettings.prototype.setDisabled = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * Clears the field making it undefined.
 */
proto.sync_pb.AppNotificationSettings.prototype.clearDisabled = function() {
  jspb.Message.setField(this, 2, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sync_pb.AppNotificationSettings.prototype.hasDisabled = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional string oauth_client_id = 3;
 * @return {string}
 */
proto.sync_pb.AppNotificationSettings.prototype.getOauthClientId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/** @param {string} value */
proto.sync_pb.AppNotificationSettings.prototype.setOauthClientId = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * Clears the field making it undefined.
 */
proto.sync_pb.AppNotificationSettings.prototype.clearOauthClientId = function() {
  jspb.Message.setField(this, 3, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sync_pb.AppNotificationSettings.prototype.hasOauthClientId = function() {
  return jspb.Message.getField(this, 3) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sync_pb.LinkedAppIconInfo.prototype.toObject = function(opt_includeInstance) {
  return proto.sync_pb.LinkedAppIconInfo.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sync_pb.LinkedAppIconInfo} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sync_pb.LinkedAppIconInfo.toObject = function(includeInstance, msg) {
  var obj = {
    url: jspb.Message.getField(msg, 1),
    size: jspb.Message.getField(msg, 2)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sync_pb.LinkedAppIconInfo}
 */
proto.sync_pb.LinkedAppIconInfo.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sync_pb.LinkedAppIconInfo;
  return proto.sync_pb.LinkedAppIconInfo.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sync_pb.LinkedAppIconInfo} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sync_pb.LinkedAppIconInfo}
 */
proto.sync_pb.LinkedAppIconInfo.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setUrl(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setSize(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sync_pb.LinkedAppIconInfo.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sync_pb.LinkedAppIconInfo.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sync_pb.LinkedAppIconInfo} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sync_pb.LinkedAppIconInfo.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = /** @type {string} */ (jspb.Message.getField(message, 1));
  if (f != null) {
    writer.writeString(
      1,
      f
    );
  }
  f = /** @type {number} */ (jspb.Message.getField(message, 2));
  if (f != null) {
    writer.writeUint32(
      2,
      f
    );
  }
};


/**
 * optional string url = 1;
 * @return {string}
 */
proto.sync_pb.LinkedAppIconInfo.prototype.getUrl = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.sync_pb.LinkedAppIconInfo.prototype.setUrl = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * Clears the field making it undefined.
 */
proto.sync_pb.LinkedAppIconInfo.prototype.clearUrl = function() {
  jspb.Message.setField(this, 1, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sync_pb.LinkedAppIconInfo.prototype.hasUrl = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional uint32 size = 2;
 * @return {number}
 */
proto.sync_pb.LinkedAppIconInfo.prototype.getSize = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/** @param {number} value */
proto.sync_pb.LinkedAppIconInfo.prototype.setSize = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * Clears the field making it undefined.
 */
proto.sync_pb.LinkedAppIconInfo.prototype.clearSize = function() {
  jspb.Message.setField(this, 2, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sync_pb.LinkedAppIconInfo.prototype.hasSize = function() {
  return jspb.Message.getField(this, 2) != null;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.sync_pb.AppSpecifics.repeatedFields_ = [9];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sync_pb.AppSpecifics.prototype.toObject = function(opt_includeInstance) {
  return proto.sync_pb.AppSpecifics.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sync_pb.AppSpecifics} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sync_pb.AppSpecifics.toObject = function(includeInstance, msg) {
  var obj = {
    extension: (f = msg.getExtension$()) && extension_specifics_pb.ExtensionSpecifics.toObject(includeInstance, f),
    notificationSettings: (f = msg.getNotificationSettings()) && proto.sync_pb.AppNotificationSettings.toObject(includeInstance, f),
    appLaunchOrdinal: jspb.Message.getField(msg, 3),
    pageOrdinal: jspb.Message.getField(msg, 4),
    launchType: jspb.Message.getField(msg, 5),
    bookmarkAppUrl: jspb.Message.getField(msg, 6),
    bookmarkAppDescription: jspb.Message.getField(msg, 7),
    bookmarkAppIconColor: jspb.Message.getField(msg, 8),
    linkedAppIconsList: jspb.Message.toObjectList(msg.getLinkedAppIconsList(),
    proto.sync_pb.LinkedAppIconInfo.toObject, includeInstance),
    bookmarkAppScope: jspb.Message.getField(msg, 10),
    bookmarkAppThemeColor: jspb.Message.getField(msg, 11)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sync_pb.AppSpecifics}
 */
proto.sync_pb.AppSpecifics.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sync_pb.AppSpecifics;
  return proto.sync_pb.AppSpecifics.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sync_pb.AppSpecifics} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sync_pb.AppSpecifics}
 */
proto.sync_pb.AppSpecifics.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new extension_specifics_pb.ExtensionSpecifics;
      reader.readMessage(value,extension_specifics_pb.ExtensionSpecifics.deserializeBinaryFromReader);
      msg.setExtension$(value);
      break;
    case 2:
      var value = new proto.sync_pb.AppNotificationSettings;
      reader.readMessage(value,proto.sync_pb.AppNotificationSettings.deserializeBinaryFromReader);
      msg.setNotificationSettings(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setAppLaunchOrdinal(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setPageOrdinal(value);
      break;
    case 5:
      var value = /** @type {!proto.sync_pb.AppSpecifics.LaunchType} */ (reader.readEnum());
      msg.setLaunchType(value);
      break;
    case 6:
      var value = /** @type {string} */ (reader.readString());
      msg.setBookmarkAppUrl(value);
      break;
    case 7:
      var value = /** @type {string} */ (reader.readString());
      msg.setBookmarkAppDescription(value);
      break;
    case 8:
      var value = /** @type {string} */ (reader.readString());
      msg.setBookmarkAppIconColor(value);
      break;
    case 9:
      var value = new proto.sync_pb.LinkedAppIconInfo;
      reader.readMessage(value,proto.sync_pb.LinkedAppIconInfo.deserializeBinaryFromReader);
      msg.addLinkedAppIcons(value);
      break;
    case 10:
      var value = /** @type {string} */ (reader.readString());
      msg.setBookmarkAppScope(value);
      break;
    case 11:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setBookmarkAppThemeColor(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sync_pb.AppSpecifics.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sync_pb.AppSpecifics.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sync_pb.AppSpecifics} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sync_pb.AppSpecifics.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getExtension$();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      extension_specifics_pb.ExtensionSpecifics.serializeBinaryToWriter
    );
  }
  f = message.getNotificationSettings();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.sync_pb.AppNotificationSettings.serializeBinaryToWriter
    );
  }
  f = /** @type {string} */ (jspb.Message.getField(message, 3));
  if (f != null) {
    writer.writeString(
      3,
      f
    );
  }
  f = /** @type {string} */ (jspb.Message.getField(message, 4));
  if (f != null) {
    writer.writeString(
      4,
      f
    );
  }
  f = /** @type {!proto.sync_pb.AppSpecifics.LaunchType} */ (jspb.Message.getField(message, 5));
  if (f != null) {
    writer.writeEnum(
      5,
      f
    );
  }
  f = /** @type {string} */ (jspb.Message.getField(message, 6));
  if (f != null) {
    writer.writeString(
      6,
      f
    );
  }
  f = /** @type {string} */ (jspb.Message.getField(message, 7));
  if (f != null) {
    writer.writeString(
      7,
      f
    );
  }
  f = /** @type {string} */ (jspb.Message.getField(message, 8));
  if (f != null) {
    writer.writeString(
      8,
      f
    );
  }
  f = message.getLinkedAppIconsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      9,
      f,
      proto.sync_pb.LinkedAppIconInfo.serializeBinaryToWriter
    );
  }
  f = /** @type {string} */ (jspb.Message.getField(message, 10));
  if (f != null) {
    writer.writeString(
      10,
      f
    );
  }
  f = /** @type {number} */ (jspb.Message.getField(message, 11));
  if (f != null) {
    writer.writeUint32(
      11,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.sync_pb.AppSpecifics.LaunchType = {
  PINNED: 0,
  REGULAR: 1,
  FULLSCREEN: 2,
  WINDOW: 3
};

/**
 * optional ExtensionSpecifics extension = 1;
 * @return {?proto.sync_pb.ExtensionSpecifics}
 */
proto.sync_pb.AppSpecifics.prototype.getExtension$ = function() {
  return /** @type{?proto.sync_pb.ExtensionSpecifics} */ (
    jspb.Message.getWrapperField(this, extension_specifics_pb.ExtensionSpecifics, 1));
};


/** @param {?proto.sync_pb.ExtensionSpecifics|undefined} value */
proto.sync_pb.AppSpecifics.prototype.setExtension$ = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 */
proto.sync_pb.AppSpecifics.prototype.clearExtension$ = function() {
  this.setExtension$(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sync_pb.AppSpecifics.prototype.hasExtension$ = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional AppNotificationSettings notification_settings = 2;
 * @return {?proto.sync_pb.AppNotificationSettings}
 */
proto.sync_pb.AppSpecifics.prototype.getNotificationSettings = function() {
  return /** @type{?proto.sync_pb.AppNotificationSettings} */ (
    jspb.Message.getWrapperField(this, proto.sync_pb.AppNotificationSettings, 2));
};


/** @param {?proto.sync_pb.AppNotificationSettings|undefined} value */
proto.sync_pb.AppSpecifics.prototype.setNotificationSettings = function(value) {
  jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 */
proto.sync_pb.AppSpecifics.prototype.clearNotificationSettings = function() {
  this.setNotificationSettings(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sync_pb.AppSpecifics.prototype.hasNotificationSettings = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional string app_launch_ordinal = 3;
 * @return {string}
 */
proto.sync_pb.AppSpecifics.prototype.getAppLaunchOrdinal = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/** @param {string} value */
proto.sync_pb.AppSpecifics.prototype.setAppLaunchOrdinal = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * Clears the field making it undefined.
 */
proto.sync_pb.AppSpecifics.prototype.clearAppLaunchOrdinal = function() {
  jspb.Message.setField(this, 3, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sync_pb.AppSpecifics.prototype.hasAppLaunchOrdinal = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional string page_ordinal = 4;
 * @return {string}
 */
proto.sync_pb.AppSpecifics.prototype.getPageOrdinal = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/** @param {string} value */
proto.sync_pb.AppSpecifics.prototype.setPageOrdinal = function(value) {
  jspb.Message.setField(this, 4, value);
};


/**
 * Clears the field making it undefined.
 */
proto.sync_pb.AppSpecifics.prototype.clearPageOrdinal = function() {
  jspb.Message.setField(this, 4, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sync_pb.AppSpecifics.prototype.hasPageOrdinal = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional LaunchType launch_type = 5;
 * @return {!proto.sync_pb.AppSpecifics.LaunchType}
 */
proto.sync_pb.AppSpecifics.prototype.getLaunchType = function() {
  return /** @type {!proto.sync_pb.AppSpecifics.LaunchType} */ (jspb.Message.getFieldWithDefault(this, 5, 0));
};


/** @param {!proto.sync_pb.AppSpecifics.LaunchType} value */
proto.sync_pb.AppSpecifics.prototype.setLaunchType = function(value) {
  jspb.Message.setField(this, 5, value);
};


/**
 * Clears the field making it undefined.
 */
proto.sync_pb.AppSpecifics.prototype.clearLaunchType = function() {
  jspb.Message.setField(this, 5, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sync_pb.AppSpecifics.prototype.hasLaunchType = function() {
  return jspb.Message.getField(this, 5) != null;
};


/**
 * optional string bookmark_app_url = 6;
 * @return {string}
 */
proto.sync_pb.AppSpecifics.prototype.getBookmarkAppUrl = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};


/** @param {string} value */
proto.sync_pb.AppSpecifics.prototype.setBookmarkAppUrl = function(value) {
  jspb.Message.setField(this, 6, value);
};


/**
 * Clears the field making it undefined.
 */
proto.sync_pb.AppSpecifics.prototype.clearBookmarkAppUrl = function() {
  jspb.Message.setField(this, 6, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sync_pb.AppSpecifics.prototype.hasBookmarkAppUrl = function() {
  return jspb.Message.getField(this, 6) != null;
};


/**
 * optional string bookmark_app_description = 7;
 * @return {string}
 */
proto.sync_pb.AppSpecifics.prototype.getBookmarkAppDescription = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 7, ""));
};


/** @param {string} value */
proto.sync_pb.AppSpecifics.prototype.setBookmarkAppDescription = function(value) {
  jspb.Message.setField(this, 7, value);
};


/**
 * Clears the field making it undefined.
 */
proto.sync_pb.AppSpecifics.prototype.clearBookmarkAppDescription = function() {
  jspb.Message.setField(this, 7, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sync_pb.AppSpecifics.prototype.hasBookmarkAppDescription = function() {
  return jspb.Message.getField(this, 7) != null;
};


/**
 * optional string bookmark_app_icon_color = 8;
 * @return {string}
 */
proto.sync_pb.AppSpecifics.prototype.getBookmarkAppIconColor = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 8, ""));
};


/** @param {string} value */
proto.sync_pb.AppSpecifics.prototype.setBookmarkAppIconColor = function(value) {
  jspb.Message.setField(this, 8, value);
};


/**
 * Clears the field making it undefined.
 */
proto.sync_pb.AppSpecifics.prototype.clearBookmarkAppIconColor = function() {
  jspb.Message.setField(this, 8, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sync_pb.AppSpecifics.prototype.hasBookmarkAppIconColor = function() {
  return jspb.Message.getField(this, 8) != null;
};


/**
 * repeated LinkedAppIconInfo linked_app_icons = 9;
 * @return {!Array<!proto.sync_pb.LinkedAppIconInfo>}
 */
proto.sync_pb.AppSpecifics.prototype.getLinkedAppIconsList = function() {
  return /** @type{!Array<!proto.sync_pb.LinkedAppIconInfo>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.sync_pb.LinkedAppIconInfo, 9));
};


/** @param {!Array<!proto.sync_pb.LinkedAppIconInfo>} value */
proto.sync_pb.AppSpecifics.prototype.setLinkedAppIconsList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 9, value);
};


/**
 * @param {!proto.sync_pb.LinkedAppIconInfo=} opt_value
 * @param {number=} opt_index
 * @return {!proto.sync_pb.LinkedAppIconInfo}
 */
proto.sync_pb.AppSpecifics.prototype.addLinkedAppIcons = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 9, opt_value, proto.sync_pb.LinkedAppIconInfo, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 */
proto.sync_pb.AppSpecifics.prototype.clearLinkedAppIconsList = function() {
  this.setLinkedAppIconsList([]);
};


/**
 * optional string bookmark_app_scope = 10;
 * @return {string}
 */
proto.sync_pb.AppSpecifics.prototype.getBookmarkAppScope = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 10, ""));
};


/** @param {string} value */
proto.sync_pb.AppSpecifics.prototype.setBookmarkAppScope = function(value) {
  jspb.Message.setField(this, 10, value);
};


/**
 * Clears the field making it undefined.
 */
proto.sync_pb.AppSpecifics.prototype.clearBookmarkAppScope = function() {
  jspb.Message.setField(this, 10, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sync_pb.AppSpecifics.prototype.hasBookmarkAppScope = function() {
  return jspb.Message.getField(this, 10) != null;
};


/**
 * optional uint32 bookmark_app_theme_color = 11;
 * @return {number}
 */
proto.sync_pb.AppSpecifics.prototype.getBookmarkAppThemeColor = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 11, 0));
};


/** @param {number} value */
proto.sync_pb.AppSpecifics.prototype.setBookmarkAppThemeColor = function(value) {
  jspb.Message.setField(this, 11, value);
};


/**
 * Clears the field making it undefined.
 */
proto.sync_pb.AppSpecifics.prototype.clearBookmarkAppThemeColor = function() {
  jspb.Message.setField(this, 11, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sync_pb.AppSpecifics.prototype.hasBookmarkAppThemeColor = function() {
  return jspb.Message.getField(this, 11) != null;
};


goog.object.extend(exports, proto.sync_pb);
