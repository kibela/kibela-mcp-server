import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { server } from "./lib/server.ts";

const transport = new StdioServerTransport();
await server.connect(transport);
