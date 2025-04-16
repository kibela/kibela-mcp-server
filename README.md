<div align="center">
  <h1>Kibela MCP Server</h1>

  <p>Kibela MCP Server is a <a href="https://modelcontextprotocol.io/introduction">Model Context Protocol (MCP)</a> server for Kibela.</p>

![GitHub commit activity](https://img.shields.io/github/commit-activity/w/kibela/kibela-mcp-server)
![GitHub Release Date](https://img.shields.io/github/release-date/kibela/kibela-mcp-server)
![GitHub package.json dynamic](https://img.shields.io/github/package-json/license/kibela/kibela-mcp-server)
![GitHub package.json dynamic](https://img.shields.io/github/package-json/version/kibela/kibela-mcp-server)

</div>

## Overview

Kibela MCP Server is currently available only as a local server using STDIO and can be used with any MCP client such as Claude Desktop or VSCode.

Only those GraphQL APIs that are publicly available and suitable for MCP are implemented as tools.

## Use Cases

- Ask about information in Kibela
- Organize folders and articles in Kibela
- Using AI to help you write with Kibela

## Requirements

1. [Docker](https://www.docker.com/) is installed
2. Docker must be running
3. Kibela [access tokens](https://my.kibe.la/settings/access_tokens) is issued
4. An application that implements the [MCP client](https://mcp.so/clients) must be installed

## Installation

### Example: Claude Desktop

Write the following configuration to `claude_desktop_config.json`. Set the Kibela origin and access token as environment variables.

```json
{
  "mcpServers": {
    "kibela": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "-e",
        "KIBELA_ORIGIN",
        "-e",
        "KIBELA_ACCESS_TOKEN",
        "ghcr.io/kibela/kibela-mcp-server"
      ],
      "env": {
        "KIBELA_ORIGIN": "https://your-subdomain.kibe.la",
        "KIBELA_ACCESS_TOKEN": "***"
      }
    }
  }
}
```

### No Docker

Then set the script as the execution command. At this time, make sure that the path to the script is absolute.

```json
{
  "mcpServers": {
    "kibela": {
      "command": "/path/to/kibela-mcp-server/bin/cli.mjs",
      "env": {
        "KIBELA_ORIGIN": "https://your-subdomain.kibe.la",
        "KIBELA_ACCESS_TOKEN": "***"
      }
    }
  }
}
```

## Available Tools

### Note Operations

- `search_kibela_note` - Search notes

  - `query`: Search keyword (required)
  - `resources`: Resource type filter (optional)
  - `coediting`: Co-editing flag (optional)
  - `updated`: Update date range (optional)
  - `groupIds`: Group ID filter (optional)
  - `folderIds`: Folder ID filter (optional)
  - `likerIds`: Liker user ID filter (optional)
  - `isArchived`: Archive flag (optional)
  - `sortBy`: Sort order (optional)

- `get_kibela_note_by_relay_id` - Get a note by Relay ID

  - `id`: Note's Relay ID (required)

- `get_kibela_note_from_path_or_url` - Get a note from path or URL

  - `path`: Note's path or URL (required)

- `get_kibela_notes` - Get notes in a folder

  - `folderId`: Folder ID (required)
  - `first`: Number of records from front (optional)
  - `last`: Number of records from back (optional)

- `create_kibela_note` - Create a new note

  - `title`: Note title (required)
  - `content`: Note content (required)
  - `draft`: Draft flag (optional)
  - `groupIds`: List of group IDs to belong to (required)
  - `folders`: Folder information (optional)
    - `groupId`: Group ID
    - `folderName`: Folder name

- `update_kibela_note_content` - Update note content
  - `id`: Note ID (required)
  - `newContent`: New content (required)
  - `baseContent`: Original content (required)

### Folder Operations

- `search_kibela_folder` - Search folders

  - `query`: Search keyword (required)

- `get_kibela_folder_by_relay_id` - Get a folder by Relay ID

  - `id`: Folder's Relay ID (required)
  - `first`: Number of records from front (optional)

- `get_kibela_folder_from_path_or_url` - Get a folder from path or URL

  - `path`: Folder's path or URL (required)
  - `first`: Number of records from front (optional)

- `get_kibela_folders` - Get folder list

  - `first`: Number of records from front (optional)
  - `last`: Number of records from back (optional)

- `create_kibela_folder` - Create a new folder

  - `groupId`: Group ID (required)
  - `fullName`: Full path name of the folder (required)

- `move_kibela_note_to_another_folder` - Move a note to another folder

  - `id`: Note ID (required)
  - `fromFolder`: Source folder information (required)
    - `groupId`: Group ID
    - `folderName`: Folder name
  - `toFolder`: Destination folder information (required)
    - `groupId`: Group ID
    - `folderName`: Folder name

- `attach_kibela_note_to_folder` - Associate a note with a folder
  - `id`: Note ID (required)
  - `folder`: Folder information (required)
    - `groupId`: Group ID
    - `folderName`: Folder name

### Comment Operations

- `create_kibela_comment` - Create a comment on a note

  - `content`: Comment content (required)
  - `noteId`: Target note ID (required)

- `create_kibela_comment_reply` - Create a reply to a comment
  - `content`: Reply content (required)
  - `commentId`: Target comment ID (required)

### Other Operations

- `get_kibela_groups` - Get group list

  - `first`: Number of records from front (optional)
  - `last`: Number of records from back (optional)

- `get_kibela_feed_sections` - Get feed section list
  - `kind`: Feed type (required)
  - `groupId`: Group ID (required)

## Available Prompts

### Review Prompt

Takes a URL as input and reviews the specified note.

Input schema:

```typescript
{
  url: string; // URL format
}
```

### Search Prompt

Takes a query as input and searches for relevant information.

Input schema:

```typescript
{
  query: string;
}
```

### Related Note Prompt

Takes a URL as input and explore the related note.

Input schema:

```typescript
{
  url: string; // URL format
}
```

### Reflect Comment Prompt

Takes a URL as input and reflect its comment to note.

Input schema:

```typescript
{
  url: string; // URL format
}
```

## Customization

You can customize the tool description and prompt by preparing a JSON file in the following format.

See [`server.ts`](https://github.com/kibela/kibela-mcp-server/blob/main/src/lib/server.ts) for tool and prompt keys.

```json
{
  "tools": {
    "search_kibela_note": {
      "description": "New description"
    }
  },
  "prompts": {
    "review": {
      "prompt": "New review prompt"
    }
  }
}
```

And then mount it to the container as follows:

```json
{
  "mcpServers": {
    "kibela": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "-e",
        "KIBELA_ORIGIN",
        "-e",
        "KIBELA_ACCESS_TOKEN",
        "-v",
        "/path/to/kibela-mcp-server-config.json:/usr/src/app/kibela-mcp-server-config.json",
        "ghcr.io/kibela/kibela-mcp-server"
      ],
      "env": {
        "KIBELA_ORIGIN": "https://your-subdomain.kibe.la",
        "KIBELA_ACCESS_TOKEN": "***"
      }
    }
  }
}
```

## Development

```bash
docker compose run mcp pnpm install
```

```bash
docker compose up
```

### Testing with MCP Inspector

```bash
npx @modelcontextprotocol/inspector \
  -e KIBELA_ORIGIN=https://your-subdomain.kibe.la \
  -e KIBELA_ACCESS_TOKEN=*** \
  docker compose exec mcp bin/cli.mjs
```

# License

This package is licensed under the terms of the [MIT](https://github.com/kibela/kibela-mcp-server/blob/main/LICENSE) license.
