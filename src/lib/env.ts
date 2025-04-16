import { z } from "zod";

const envVariables = z.object({
  KIBELA_ORIGIN: z.string().url(),
  KIBELA_ACCESS_TOKEN: z.string(),
});

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}
