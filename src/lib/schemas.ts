import { z } from "zod";
import {
  FeedKind,
  SearchDate,
  SearchResourceKind,
  SearchSortKind,
} from "../generated/graphql.ts";

export const searchNoteSchema = {
  query: z.string(),
  resources: z.nativeEnum(SearchResourceKind).optional(),
  coediting: z.boolean().optional(),
  updated: z.nativeEnum(SearchDate).optional(),
  groupIds: z.string().optional(),
  folderIds: z.string().optional(),
  likerIds: z.string().optional(),
  isArchived: z.boolean().optional(),
  sortBy: z.nativeEnum(SearchSortKind).optional(),
};
export const searchFolderSchema = { query: z.string() };
export const getGroupsSchema = {
  first: z.number().optional(),
  last: z.number().optional(),
};
export const getFoldersSchema = {
  first: z.number().optional(),
  last: z.number().optional(),
};
export const getNotesSchema = {
  folderId: z.string(),
  first: z.number().optional(),
  last: z.number().optional(),
};
export const getNoteSchema = {
  id: z.string(),
};
export const getNoteFromPathSchema = {
  path: z.string(),
};
export const getFolderSchema = {
  id: z.string(),
  first: z.number().optional(),
};
export const getFolderFromPathSchema = {
  path: z.string(),
  first: z.number().optional(),
};
export const getFeedSectionsSchema = {
  kind: z.nativeEnum(FeedKind),
  groupId: z.string(),
};
export const createNoteSchema = {
  title: z.string(),
  content: z.string(),
  draft: z.boolean().optional(),
  groupIds: z.array(z.string()),
  folders: z
    .array(
      z.object({
        groupId: z.string(),
        folderName: z.string(),
      })
    )
    .optional(),
};
export const createCommentSchema = {
  content: z.string(),
  noteId: z.string(),
};
export const createCommentReplySchema = {
  content: z.string(),
  commentId: z.string(),
};
export const createFolderSchema = {
  groupId: z.string(),
  fullName: z.string(),
};
export const moveNoteToAnotherFolderSchema = {
  id: z.string(),
  fromFolder: z.object({ groupId: z.string(), folderName: z.string() }),
  toFolder: z.object({ groupId: z.string(), folderName: z.string() }),
};
export const attachNoteToFolderSchema = {
  id: z.string(),
  folder: z.object({ groupId: z.string(), folderName: z.string() }),
};
export const updateNoteContentSchema = {
  id: z.string(),
  newContent: z.string(),
  baseContent: z.string(),
};
