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

goog.exportSymbol('proto.sync_pb.ArticlePage', null, global);
goog.exportSymbol('proto.sync_pb.ArticleSpecifics', null, global);
goog.exportSymbol('proto.sync_pb.DeprecatedArticleAttachments', null, global);
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
proto.sync_pb.ArticleSpecifics = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.sync_pb.ArticleSpecifics.repeatedFields_, null);
};
goog.inherits(proto.sync_pb.ArticleSpecifics, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sync_pb.ArticleSpecifics.displayName = 'proto.sync_pb.ArticleSpecifics';
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
proto.sync_pb.ArticlePage = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sync_pb.ArticlePage, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sync_pb.ArticlePage.displayName = 'proto.sync_pb.ArticlePage';
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
proto.sync_pb.DeprecatedArticleAttachments = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sync_pb.DeprecatedArticleAttachments, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sync_pb.DeprecatedArticleAttachments.displayName = 'proto.sync_pb.DeprecatedArticleAttachments';
}

/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.sync_pb.ArticleSpecifics.repeatedFields_ = [3];



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
proto.sync_pb.ArticleSpecifics.prototype.toObject = function(opt_includeInstance) {
  return proto.sync_pb.ArticleSpecifics.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sync_pb.ArticleSpecifics} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sync_pb.ArticleSpecifics.toObject = function(includeInstance, msg) {
  var obj = {
    entryId: jspb.Message.getField(msg, 1),
    title: jspb.Message.getField(msg, 2),
    pagesList: jspb.Message.toObjectList(msg.getPagesList(),
    proto.sync_pb.ArticlePage.toObject, includeInstance),
    attachments: (f = msg.getAttachments()) && proto.sync_pb.DeprecatedArticleAttachments.toObject(includeInstance, f)
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
 * @return {!proto.sync_pb.ArticleSpecifics}
 */
proto.sync_pb.ArticleSpecifics.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sync_pb.ArticleSpecifics;
  return proto.sync_pb.ArticleSpecifics.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sync_pb.ArticleSpecifics} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sync_pb.ArticleSpecifics}
 */
proto.sync_pb.ArticleSpecifics.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setEntryId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setTitle(value);
      break;
    case 3:
      var value = new proto.sync_pb.ArticlePage;
      reader.readMessage(value,proto.sync_pb.ArticlePage.deserializeBinaryFromReader);
      msg.addPages(value);
      break;
    case 4:
      var value = new proto.sync_pb.DeprecatedArticleAttachments;
      reader.readMessage(value,proto.sync_pb.DeprecatedArticleAttachments.deserializeBinaryFromReader);
      msg.setAttachments(value);
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
proto.sync_pb.ArticleSpecifics.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sync_pb.ArticleSpecifics.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sync_pb.ArticleSpecifics} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sync_pb.ArticleSpecifics.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = /** @type {string} */ (jspb.Message.getField(message, 1));
  if (f != null) {
    writer.writeString(
      1,
      f
    );
  }
  f = /** @type {string} */ (jspb.Message.getField(message, 2));
  if (f != null) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getPagesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      3,
      f,
      proto.sync_pb.ArticlePage.serializeBinaryToWriter
    );
  }
  f = message.getAttachments();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      proto.sync_pb.DeprecatedArticleAttachments.serializeBinaryToWriter
    );
  }
};


/**
 * optional string entry_id = 1;
 * @return {string}
 */
proto.sync_pb.ArticleSpecifics.prototype.getEntryId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.sync_pb.ArticleSpecifics.prototype.setEntryId = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * Clears the field making it undefined.
 */
proto.sync_pb.ArticleSpecifics.prototype.clearEntryId = function() {
  jspb.Message.setField(this, 1, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sync_pb.ArticleSpecifics.prototype.hasEntryId = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string title = 2;
 * @return {string}
 */
proto.sync_pb.ArticleSpecifics.prototype.getTitle = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.sync_pb.ArticleSpecifics.prototype.setTitle = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * Clears the field making it undefined.
 */
proto.sync_pb.ArticleSpecifics.prototype.clearTitle = function() {
  jspb.Message.setField(this, 2, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sync_pb.ArticleSpecifics.prototype.hasTitle = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * repeated ArticlePage pages = 3;
 * @return {!Array<!proto.sync_pb.ArticlePage>}
 */
proto.sync_pb.ArticleSpecifics.prototype.getPagesList = function() {
  return /** @type{!Array<!proto.sync_pb.ArticlePage>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.sync_pb.ArticlePage, 3));
};


/** @param {!Array<!proto.sync_pb.ArticlePage>} value */
proto.sync_pb.ArticleSpecifics.prototype.setPagesList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 3, value);
};


/**
 * @param {!proto.sync_pb.ArticlePage=} opt_value
 * @param {number=} opt_index
 * @return {!proto.sync_pb.ArticlePage}
 */
proto.sync_pb.ArticleSpecifics.prototype.addPages = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 3, opt_value, proto.sync_pb.ArticlePage, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 */
proto.sync_pb.ArticleSpecifics.prototype.clearPagesList = function() {
  this.setPagesList([]);
};


/**
 * optional DeprecatedArticleAttachments attachments = 4;
 * @return {?proto.sync_pb.DeprecatedArticleAttachments}
 */
proto.sync_pb.ArticleSpecifics.prototype.getAttachments = function() {
  return /** @type{?proto.sync_pb.DeprecatedArticleAttachments} */ (
    jspb.Message.getWrapperField(this, proto.sync_pb.DeprecatedArticleAttachments, 4));
};


/** @param {?proto.sync_pb.DeprecatedArticleAttachments|undefined} value */
proto.sync_pb.ArticleSpecifics.prototype.setAttachments = function(value) {
  jspb.Message.setWrapperField(this, 4, value);
};


/**
 * Clears the message field making it undefined.
 */
proto.sync_pb.ArticleSpecifics.prototype.clearAttachments = function() {
  this.setAttachments(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sync_pb.ArticleSpecifics.prototype.hasAttachments = function() {
  return jspb.Message.getField(this, 4) != null;
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
proto.sync_pb.ArticlePage.prototype.toObject = function(opt_includeInstance) {
  return proto.sync_pb.ArticlePage.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sync_pb.ArticlePage} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sync_pb.ArticlePage.toObject = function(includeInstance, msg) {
  var obj = {
    url: jspb.Message.getField(msg, 1)
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
 * @return {!proto.sync_pb.ArticlePage}
 */
proto.sync_pb.ArticlePage.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sync_pb.ArticlePage;
  return proto.sync_pb.ArticlePage.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sync_pb.ArticlePage} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sync_pb.ArticlePage}
 */
proto.sync_pb.ArticlePage.deserializeBinaryFromReader = function(msg, reader) {
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
proto.sync_pb.ArticlePage.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sync_pb.ArticlePage.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sync_pb.ArticlePage} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sync_pb.ArticlePage.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = /** @type {string} */ (jspb.Message.getField(message, 1));
  if (f != null) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string url = 1;
 * @return {string}
 */
proto.sync_pb.ArticlePage.prototype.getUrl = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.sync_pb.ArticlePage.prototype.setUrl = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * Clears the field making it undefined.
 */
proto.sync_pb.ArticlePage.prototype.clearUrl = function() {
  jspb.Message.setField(this, 1, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sync_pb.ArticlePage.prototype.hasUrl = function() {
  return jspb.Message.getField(this, 1) != null;
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
proto.sync_pb.DeprecatedArticleAttachments.prototype.toObject = function(opt_includeInstance) {
  return proto.sync_pb.DeprecatedArticleAttachments.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sync_pb.DeprecatedArticleAttachments} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sync_pb.DeprecatedArticleAttachments.toObject = function(includeInstance, msg) {
  var obj = {

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
 * @return {!proto.sync_pb.DeprecatedArticleAttachments}
 */
proto.sync_pb.DeprecatedArticleAttachments.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sync_pb.DeprecatedArticleAttachments;
  return proto.sync_pb.DeprecatedArticleAttachments.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sync_pb.DeprecatedArticleAttachments} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sync_pb.DeprecatedArticleAttachments}
 */
proto.sync_pb.DeprecatedArticleAttachments.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
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
proto.sync_pb.DeprecatedArticleAttachments.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sync_pb.DeprecatedArticleAttachments.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sync_pb.DeprecatedArticleAttachments} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sync_pb.DeprecatedArticleAttachments.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};


goog.object.extend(exports, proto.sync_pb);
