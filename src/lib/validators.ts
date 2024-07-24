import { z } from "zod";
const searchUserSchema = z.object({
  query: z
    .string()
    .max(50, { message: "Query must be less than 50 characters" }),
});

const QueryParams = z.object({
  q: z.string(),
  page: z.string().optional().default("1"),
});

export { searchUserSchema, QueryParams };
