import z from "zod";

const loginSchema = z.object({
  email: z.email("Email is Required !"),
  password: z.string("Password is Required !"),
});

export const authValidation = {
  loginSchema,
};
