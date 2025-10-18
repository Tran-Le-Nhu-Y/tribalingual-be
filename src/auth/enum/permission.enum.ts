export enum Permission {
  READ_GENRE = 'read:genre',
  CREATE_GENRE = 'create:genre',
  UPDATE_GENRE = 'update:genre',
  DELETE_GENRE = 'delete:genre',

  READ_FILE = 'read:file',
  CREATE_FILE = 'create:file',
  UPDATE_FILE = 'update:file',
  DELETE_FILE = 'delete:file',

  READ_STORY = 'read:story',
  CREATE_STORY = 'create:story',
  UPDATE_STORY = 'update:story',
  DELETE_STORY = 'delete:story',
  PUBLISH_STORY = 'publish:story',
  READ_COMMENT = 'read:comment',
  CREATE_COMMENT = 'create:comment',
  DELETE_COMMENT = 'delete:comment',
  CREATE_FAVORITE = 'create:favorite',
  DELETE_FAVORITE = 'delete:favorite',
  CREATE_VIEW = 'create:view',

  READ_STORY_HISTORY = 'read:story_history',
  CREATE_STORY_HISTORY = 'create:story_history',
  DELETE_STORY_HISTORY = 'delete:story_history',

  READ_USER = 'read:users',
}
