import { z } from "zod";

const EnvSchema = z.object({ DATABASE_URL: z.string().url() });

export type EnvSchema = z.infer<typeof EnvSchema>;

export const envs = EnvSchema.parse(process.env);
