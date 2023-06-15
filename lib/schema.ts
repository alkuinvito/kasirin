import { z } from "zod";

export const Role = z.enum(["owner", "manager", "employee"]);
export type Role = z.infer<typeof Role>;

export const UserModelSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  emailVerification: z.optional(z.boolean()),
  image: z.string().nullable(),
  role: Role,
});

export type UserModel = z.infer<typeof UserModelSchema>;

export const InvitationModelSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  role: Role,
});

export type InvitationModel = z.infer<typeof InvitationModelSchema>;

export const profileSchema = z.object({
  fullname: z
    .string({
      required_error: "Fullname must not be empty",
    })
    .regex(/[a-zA-Z][a-zA-Z ]+/, "Fullname must only contains alphabet")
    .transform((val, ctx) => {
      const trimmed = val.trim();
      if (trimmed.length < 3 || trimmed.length > 40) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Fullname must between 3 and 40 characters long",
        });
        return z.NEVER;
      }
      return trimmed;
    }),
  email: z
    .string({ required_error: "Email must not be empty" })
    .email({ message: "Invalid email" }),
  role: z.enum(Role.options, {
    required_error: "Role must not be empty",
    invalid_type_error: "Role must be owner, manager or employee",
  }),
});
