import { z } from "zod";

export const Role = z.enum(["admin", "user"]);
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
