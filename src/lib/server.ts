import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { searchNote } from "../callbacks/searchNote.ts";
import {
  attachNoteToFolderSchema,
  createCommentReplySchema,
  createCommentSchema,
  createFolderSchema,
  createNoteSchema,
  getFeedSectionsSchema,
  getFolderFromPathSchema,
  getFolderSchema,
  getFoldersSchema,
  getGroupsSchema,
  getNoteFromPathSchema,
  getNoteSchema,
  getNotesSchema,
  moveNoteToAnotherFolderSchema,
  searchNoteSchema,
  updateNoteContentSchema,
} from "./schemas.ts";
import { getGroups } from "../callbacks/getGroups.ts";
import { getFolders } from "../callbacks/getFolders.ts";
import { getNotes } from "../callbacks/getNotes.ts";
import { getNote } from "../callbacks/getNote.ts";
import { createNote } from "../callbacks/createNote.ts";
import { createFolder } from "../callbacks/createFolder.ts";
import { moveNoteToAnotherFolder } from "../callbacks/moveNoteToAnotherFolder.ts";
import { updateNoteContent } from "../callbacks/updateNoteContent.ts";
import { searchFolder } from "../callbacks/searchFolder.ts";
import { getFolder } from "../callbacks/getFolder.ts";
import { getNoteFromPath } from "../callbacks/getNoteFromPath.ts";
import { createComment } from "../callbacks/createComment.ts";
import { createCommentReply } from "../callbacks/createCommentReply.ts";
import { attachNoteToFolder } from "../callbacks/attachNoteToFolder.ts";
import { getFolderFromPath } from "../callbacks/getFolderFromPath.ts";
import { getFeedSections } from "../callbacks/getFeedSections.ts";
import { z } from "zod";
import { user } from "./prompt.ts";
import { config } from "./config.ts";
import "./intl.ts";

const server = new McpServer({
  name: "Kibela MCP Server",
  version: "0.1.0",
});

server.tool(
  "search_kibela_note",
  config.tools?.search_kibela_note?.description ||
    "Search for articles in Kibela",
  searchNoteSchema,
  searchNote
);
server.tool(
  "search_kibela_folder",
  config.tools?.search_kibela_folder?.description ||
    "Search for folders in Kibela",
  searchNoteSchema,
  searchFolder
);
server.tool(
  "get_kibela_groups",
  config.tools?.get_kibela_groups?.description || "Get groups in Kibela",
  getGroupsSchema,
  getGroups
);
server.tool(
  "get_kibela_folders",
  config.tools?.get_kibela_folders?.description || "Get folders in Kibela",
  getFoldersSchema,
  getFolders
);
server.tool(
  "get_kibela_notes",
  config.tools?.get_kibela_notes?.description ||
    "Get notes in folders in Kibela",
  getNotesSchema,
  getNotes
);
server.tool(
  "get_kibela_note_by_relay_id",
  config.tools?.get_kibela_note_by_relay_id?.description ||
    "Get note in Kibela by GraphQL relay ID",
  getNoteSchema,
  getNote
);
server.tool(
  "get_kibela_note_from_path_or_url",
  config.tools?.get_kibela_note_from_path_or_url?.description ||
    "Get note in Kibela from path (/notes/{id}) or URL (https://subdomain.kibe.la/notes/{id})",
  getNoteFromPathSchema,
  getNoteFromPath
);
server.tool(
  "get_kibela_folder_by_relay_id",
  config.tools?.get_kibela_folder_by_relay_id?.description ||
    "Get folder in Kibela by GraphQL relay ID",
  getFolderSchema,
  getFolder
);
server.tool(
  "get_kibela_folder_from_path_or_url",
  config.tools?.get_kibela_folder_from_path_or_url?.description ||
    "Get folder in Kibela from path (/folders/{id}) or URL (https://subdomain.kibe.la/folders/{id})",
  getFolderFromPathSchema,
  getFolderFromPath
);
server.tool(
  "get_kibela_feed_sections",
  config.tools?.get_kibela_feed_sections?.description ||
    "Get feed (timeline of posted notes) sections in Kibela.",
  getFeedSectionsSchema,
  getFeedSections
);
server.tool(
  "create_kibela_note",
  config.tools?.create_kibela_note?.description || "Create note in Kibela",
  createNoteSchema,
  createNote
);
server.tool(
  "create_kibela_comment",
  config.tools?.create_kibela_comment?.description ||
    "Create comment in Kibela",
  createCommentSchema,
  createComment
);
server.tool(
  "create_kibela_comment_reply",
  config.tools?.create_kibela_comment_reply?.description ||
    "Create comment reply in Kibela",
  createCommentReplySchema,
  createCommentReply
);
server.tool(
  "create_kibela_folder",
  config.tools?.create_kibela_folder?.description || "Create folder in Kibela",
  createFolderSchema,
  createFolder
);
server.tool(
  "move_kibela_note_to_another_folder",
  config.tools?.move_kibela_note_to_another_folder?.description ||
    "Move note in Kibela to another folder",
  moveNoteToAnotherFolderSchema,
  moveNoteToAnotherFolder
);
server.tool(
  "attach_kibela_note_to_folder",
  config.tools?.attach_kibela_note_to_folder?.description ||
    "Attach note in Kibela to folder",
  attachNoteToFolderSchema,
  attachNoteToFolder
);
server.tool(
  "update_kibela_note_content",
  config.tools?.update_kibela_note_content?.description ||
    "Update note content in Kibela",
  updateNoteContentSchema,
  updateNoteContent
);

server.prompt(
  intl.__("reviewPromptName"),
  { url: z.string().url() },
  ({ url }) =>
    user(
      `${url}\n\n${config.prompts?.review?.prompt || intl.__("reviewMessage")}`
    )
);
server.prompt(intl.__("searchPromptName"), { query: z.string() }, ({ query }) =>
  user(
    `${query}\n\n${config.prompts?.search?.prompt || intl.__("searchMessage")}`
  )
);
server.prompt(
  intl.__("relatedNotePromptName"),
  { url: z.string().url() },
  ({ url }) =>
    user(
      `${url}\n\n${
        config.prompts?.related_note?.prompt || intl.__("relatedNoteMessage")
      }`
    )
);
server.prompt(
  intl.__("reflectCommentPromptName"),
  { url: z.string().url() },
  ({ url }) =>
    user(
      `${url}\n\n${
        config.prompts?.reflect_comment?.prompt ||
        intl.__("reflectCommentMessage")
      }`
    )
);

export { server };
