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

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/;

const UserSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  username: z.string().min(4, "Username must be at least 4 characters long"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .refine(value => passwordRegex.test(value), {
      message: "Password must contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character (!@#$%^&*)",
    }),
});

export { searchUserSchema, QueryParams, UserSchema };
