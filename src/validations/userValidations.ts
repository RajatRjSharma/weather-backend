import { z } from "zod";

export const registerUserSchema = z.object({
  firstname: z.string().min(1, "First name is required").trim(),
  lastname: z.string().min(1, "Last name is required").trim(),
  username: z.string().min(1, "Username is required").trim(),
  email: z.string().email("Invalid email format").trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /(?=.*[A-Za-z])(?=.*\d)/,
      "Password must contain letters and numbers"
    ),
});

export const loginUserSchema = z.object({
  email: z.string().email("Invalid email address").trim(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginUserInput = z.infer<typeof loginUserSchema>;
