const { CREATE_QUERY } = 'CREATE';

const createAccount = `
  CREATE TABLE IF NOT EXISTS account(
    index INTEGER AUTOINCREMENT,
    name VARCHAR(20),
    password VARCHAR(20),
    string_id 
  )
`;

const createEntity = `
  CREATE TABLE IF NOT EXISTS syncentity(
    id_string TEXT PRIMARY KEY NOT NULL UNIQUE,
    parent_id_string TEXT,
    old_parent_id TEXT,
    version INTEGER NOT NULL,
    mtime INTEGER,
    ctime INTEGER,
    name TEXT NOT NULL,
    non_unique_name TEXT,
    sync_timestamp INTEGER,
    server_defined_unique_tag TEXT,
    BookmarkData BLOB,
    position_in_parent INTEGER,
    insert_after_item_id TEXT,
    deleted INTEGER DEFAULT False,
    originator_cache_guid TEXT,
    originator_client_item_id TEXT,
    EntitySpecifics BLOB,
    folder INTEGER DEFAULT False,
    client_defined_unique_tag TEXT,
    ordinal_in_parent BLOB,
    UniquePosition BLOB,
    AttachmentIdProto BLOB
  )
`;

const dropQuery = `
    DROP TABLE IF EXISTS person
`;

const insertQuery = `
  CREATE TABLE IF NOT EXISTS person(
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name VARCHAR(20),
    user_password VARCHAR(20)
  )
`;

const dummyDataQuery = `
  insert into person(user_name, user_password) 
  values 
    ('doraemong', 'daenamuhelicopter'),
    ('kukaro', 'wordpass'),
    ('jiharu', 'password')
`;

exports.create = createEntity;
exports.insert = `
INSERT INTO syncentity(id_string, mtime, ctime) VALUES(?, ?, ?)
`
exports.drop = (table_name) => dropQuery;