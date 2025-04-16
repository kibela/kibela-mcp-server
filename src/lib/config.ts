import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";

const configSchema = z.object({
  tools: z
    .object({
      search_kibela_note: z
        .object({
          description: z.string().optional(),
        })
        .optional(),
      search_kibela_folder: z
        .object({
          description: z.string().optional(),
        })
        .optional(),
      get_kibela_groups: z
        .object({
          description: z.string().optional(),
        })
        .optional(),
      get_kibela_folders: z
        .object({
          description: z.string().optional(),
        })
        .optional(),
      get_kibela_notes: z
        .object({
          description: z.string().optional(),
        })
        .optional(),
      get_kibela_note_by_relay_id: z
        .object({
          description: z.string().optional(),
        })
        .optional(),
      get_kibela_note_from_path_or_url: z
        .object({
          description: z.string().optional(),
        })
        .optional(),
      get_kibela_folder_by_relay_id: z
        .object({
          description: z.string().optional(),
        })
        .optional(),
      get_kibela_note_from_path_or_url_by_relay_id: z
        .object({
          description: z.string().optional(),
        })
        .optional(),
      get_kibela_note_by_relay_id_from_path_or_url: z
        .object({
          description: z.string().optional(),
        })
        .optional(),
      get_kibela_folder_from_path_or_url: z
        .object({
          description: z.string().optional(),
        })
        .optional(),
      get_kibela_feed_sections: z
        .object({
          description: z.string().optional(),
        })
        .optional(),
      create_kibela_note: z
        .object({
          description: z.string().optional(),
        })
        .optional(),
      create_kibela_comment: z
        .object({
          description: z.string().optional(),
        })
        .optional(),
      create_kibela_comment_reply: z
        .object({
          description: z.string().optional(),
        })
        .optional(),
      create_kibela_folder: z
        .object({
          description: z.string().optional(),
        })
        .optional(),
      move_kibela_note_to_another_folder: z
        .object({
          description: z.string().optional(),
        })
        .optional(),
      attach_kibela_note_to_folder: z
        .object({
          description: z.string().optional(),
        })
        .optional(),
      update_kibela_note_content: z
        .object({
          description: z.string().optional(),
        })
        .optional(),
    })
    .strict()
    .optional(),
  prompts: z
    .object({
      review: z
        .object({
          prompt: z.string().optional(),
        })
        .optional(),
      search: z
        .object({
          prompt: z.string().optional(),
        })
        .optional(),
      related_note: z
        .object({
          prompt: z.string().optional(),
        })
        .optional(),
      reflect_comment: z
        .object({
          prompt: z.string().optional(),
        })
        .optional(),
    })
    .strict()
    .optional(),
});

let config: z.infer<typeof configSchema> = {
  tools: {},
  prompts: {},
};

if (existsSync(join(process.cwd(), "kibela-mcp-server-config.json"))) {
  const parsedConfig = configSchema.safeParse(
    JSON.parse(
      readFileSync(
        join(process.cwd(), "kibela-mcp-server-config.json"),
        "utf-8"
      )
    )
  );

  if (!parsedConfig.success) {
    console.error("Invalid config:", parsedConfig.error.format());
    process.exit(1);
  }

  config = parsedConfig.data;
}

export { config };
