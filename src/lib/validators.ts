import { z } from "zod";
const searchUserSchema = z.object({
  query: z
    .string()
    .max(50, { message: "Query must be less than 50 characters" }),
});

export { searchUserSchema };
