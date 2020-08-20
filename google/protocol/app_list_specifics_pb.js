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

goog.exportSymbol('proto.sync_pb.AppListSpecifics', null, global);
goog.exportSymbol('proto.sync_pb.AppListSpecifics.AppListItemType', null, global);
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
proto.sync_pb.AppListSpecifics = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sync_pb.AppListSpecifics, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sync_pb.AppListSpecifics.displayName = 'proto.sync_pb.AppListSpecifics';
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
proto.sync_pb.AppListSpecifics.prototype.toObject = function(opt_includeInstance) {
  return proto.sync_pb.AppListSpecifics.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sync_pb.AppListSpecifics} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sync_pb.AppListSpecifics.toObject = function(includeInstance, msg) {
  var obj = {
    itemId: jspb.Message.getField(msg, 1),
    itemType: jspb.Message.getField(msg, 2),
    itemName: jspb.Message.getField(msg, 3),
    parentId: jspb.Message.getField(msg, 4),
    obsoletePageOrdinal: jspb.Message.getField(msg, 5),
    itemOrdinal: jspb.Message.getField(msg, 6),
    itemPinOrdinal: jspb.Message.getField(msg, 7)
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
 * @return {!proto.sync_pb.AppListSpecifics}
 */
proto.sync_pb.AppListSpecifics.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sync_pb.AppListSpecifics;
  return proto.sync_pb.AppListSpecifics.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sync_pb.AppListSpecifics} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sync_pb.AppListSpecifics}
 */
proto.sync_pb.AppListSpecifics.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setItemId(value);
      break;
    case 2:
      var value = /** @type {!proto.sync_pb.AppListSpecifics.AppListItemType} */ (reader.readEnum());
      msg.setItemType(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setItemName(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setParentId(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setObsoletePageOrdinal(value);
      break;
    case 6:
      var value = /** @type {string} */ (reader.readString());
      msg.setItemOrdinal(value);
      break;
    case 7:
      var value = /** @type {string} */ (reader.readString());
      msg.setItemPinOrdinal(value);
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
proto.sync_pb.AppListSpecifics.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sync_pb.AppListSpecifics.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sync_pb.AppListSpecifics} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sync_pb.AppListSpecifics.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = /** @type {string} */ (jspb.Message.getField(message, 1));
  if (f != null) {
    writer.writeString(
      1,
      f
    );
  }
  f = /** @type {!proto.sync_pb.AppListSpecifics.AppListItemType} */ (jspb.Message.getField(message, 2));
  if (f != null) {
    writer.writeEnum(
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
  f = /** @type {string} */ (jspb.Message.getField(message, 4));
  if (f != null) {
    writer.writeString(
      4,
      f
    );
  }
  f = /** @type {string} */ (jspb.Message.getField(message, 5));
  if (f != null) {
    writer.writeString(
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
};


/**
 * @enum {number}
 */
proto.sync_pb.AppListSpecifics.AppListItemType = {
  TYPE_APP: 1,
  TYPE_REMOVE_DEFAULT_APP: 2,
  TYPE_FOLDER: 3,
  TYPE_URL: 4,
  TYPE_PAGE_BREAK: 5
};

/**
 * optional string item_id = 1;
 * @return {string}
 */
proto.sync_pb.AppListSpecifics.prototype.getItemId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.sync_pb.AppListSpecifics.prototype.setItemId = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * Clears the field making it undefined.
 */
proto.sync_pb.AppListSpecifics.prototype.clearItemId = function() {
  jspb.Message.setField(this, 1, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sync_pb.AppListSpecifics.prototype.hasItemId = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional AppListItemType item_type = 2;
 * @return {!proto.sync_pb.AppListSpecifics.AppListItemType}
 */
proto.sync_pb.AppListSpecifics.prototype.getItemType = function() {
  return /** @type {!proto.sync_pb.AppListSpecifics.AppListItemType} */ (jspb.Message.getFieldWithDefault(this, 2, 1));
};


/** @param {!proto.sync_pb.AppListSpecifics.AppListItemType} value */
proto.sync_pb.AppListSpecifics.prototype.setItemType = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * Clears the field making it undefined.
 */
proto.sync_pb.AppListSpecifics.prototype.clearItemType = function() {
  jspb.Message.setField(this, 2, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sync_pb.AppListSpecifics.prototype.hasItemType = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional string item_name = 3;
 * @return {string}
 */
proto.sync_pb.AppListSpecifics.prototype.getItemName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/** @param {string} value */
proto.sync_pb.AppListSpecifics.prototype.setItemName = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * Clears the field making it undefined.
 */
proto.sync_pb.AppListSpecifics.prototype.clearItemName = function() {
  jspb.Message.setField(this, 3, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sync_pb.AppListSpecifics.prototype.hasItemName = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional string parent_id = 4;
 * @return {string}
 */
proto.sync_pb.AppListSpecifics.prototype.getParentId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/** @param {string} value */
proto.sync_pb.AppListSpecifics.prototype.setParentId = function(value) {
  jspb.Message.setField(this, 4, value);
};


/**
 * Clears the field making it undefined.
 */
proto.sync_pb.AppListSpecifics.prototype.clearParentId = function() {
  jspb.Message.setField(this, 4, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sync_pb.AppListSpecifics.prototype.hasParentId = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional string OBSOLETE_page_ordinal = 5;
 * @return {string}
 */
proto.sync_pb.AppListSpecifics.prototype.getObsoletePageOrdinal = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/** @param {string} value */
proto.sync_pb.AppListSpecifics.prototype.setObsoletePageOrdinal = function(value) {
  jspb.Message.setField(this, 5, value);
};


/**
 * Clears the field making it undefined.
 */
proto.sync_pb.AppListSpecifics.prototype.clearObsoletePageOrdinal = function() {
  jspb.Message.setField(this, 5, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sync_pb.AppListSpecifics.prototype.hasObsoletePageOrdinal = function() {
  return jspb.Message.getField(this, 5) != null;
};


/**
 * optional string item_ordinal = 6;
 * @return {string}
 */
proto.sync_pb.AppListSpecifics.prototype.getItemOrdinal = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};


/** @param {string} value */
proto.sync_pb.AppListSpecifics.prototype.setItemOrdinal = function(value) {
  jspb.Message.setField(this, 6, value);
};


/**
 * Clears the field making it undefined.
 */
proto.sync_pb.AppListSpecifics.prototype.clearItemOrdinal = function() {
  jspb.Message.setField(this, 6, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sync_pb.AppListSpecifics.prototype.hasItemOrdinal = function() {
  return jspb.Message.getField(this, 6) != null;
};


/**
 * optional string item_pin_ordinal = 7;
 * @return {string}
 */
proto.sync_pb.AppListSpecifics.prototype.getItemPinOrdinal = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 7, ""));
};


/** @param {string} value */
proto.sync_pb.AppListSpecifics.prototype.setItemPinOrdinal = function(value) {
  jspb.Message.setField(this, 7, value);
};


/**
 * Clears the field making it undefined.
 */
proto.sync_pb.AppListSpecifics.prototype.clearItemPinOrdinal = function() {
  jspb.Message.setField(this, 7, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sync_pb.AppListSpecifics.prototype.hasItemPinOrdinal = function() {
  return jspb.Message.getField(this, 7) != null;
};


goog.object.extend(exports, proto.sync_pb);
