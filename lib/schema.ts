import { z } from "zod";

export const FormidableError = z.object({
  code: z.number(),
  httpCode: z.number().optional().default(500),
  name: z.string(),
  message: z.string(),
  stack: z.string().optional(),
});

export const Role = z.enum(["owner", "manager", "employee"]);
export type Role = z.infer<typeof Role>;

export const Gender = z.enum(["male", "female"]);
export type Gender = z.infer<typeof Gender>;

export const UserModelSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  emailVerification: z.optional(z.boolean()),
  image: z.string().nullable(),
  phone: z.coerce.number().positive().safe().nullable(),
  address: z.string().nullable(),
  gender: Gender.nullable(),
  dob: z.coerce.date().max(new Date()).nullable(),
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

export const variantSchema = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  price: z.number().int().gte(0),
  groupId: z.string().cuid().optional(),
});

export const variantGroupSchema = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  required: z.boolean().optional(),
  items: variantSchema.array().nonempty(),
});

export const productSchema = z.object({
  id: z.string().cuid().optional(),
  name: z.string().min(3).max(32),
  price: z.number().positive().safe(),
  image: z.string().url(),
  available: z.boolean().optional().default(true),
  variants: variantGroupSchema.array().optional(),
  categoryId: z.string().cuid(),
});

export const categorySchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(3).max(16),
});

export type Category = z.infer<typeof categorySchema>;

export const menuSchema = z.object({
  categories: z
    .object({
      id: z.string().cuid(),
      name: z.string(),
      products: productSchema.array(),
    })
    .array(),
});
