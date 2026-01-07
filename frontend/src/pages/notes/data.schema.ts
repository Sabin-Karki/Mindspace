import z from "zod";

export const  userSchema = z.object({
  username: z.string().min(3, "username should be at least 3 characters").max(50,"thats a long username"),
  email: z.email("Invalid email address"),
  password: z.string(),
});

export type UserType = z.infer<typeof userSchema>;