import { z } from "zod";

export const FormidableError = z.object({
  code: z.number(),
  httpCode: z.number().optional().default(500),
  name: z.string(),
  message: z.string(),
  stack: z.string().optional(),
});

export const Severity = z.enum(["success", "warning", "error"]);
export type Severity = z.infer<typeof Severity>;

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
  active: z.boolean(),
});

export type UserModel = z.infer<typeof UserModelSchema>;

export const variantSchema = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  price: z.number().min(0).max(100000000),
  groupId: z.string().cuid().optional(),
});

export const variantGroupSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  required: z.boolean(),
  items: variantSchema.array().nonempty(),
});

export const productSchema = z.object({
  id: z.string().cuid().optional(),
  name: z.string().min(3).max(32),
  price: z.coerce.number().min(0).max(100000000),
  image: z.string().url(),
  stock: z.coerce.number().min(0).max(1000).default(0),
  permalink: z
    .string()
    .toLowerCase()
    .regex(
      /(^[-a-zA-Z0-9-]*)$/gi,
      "Permalink can only contains alphanumeric and dash (-)"
    )
    .min(3)
    .max(32),
  variants: variantGroupSchema.array().optional(),
  categoryId: z.string().cuid(),
});

export const categorySchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(3).max(16),
});

export type Category = z.infer<typeof categorySchema>;

export const menuSchema = z.object({
  categories: z.object({
    id: z.string().cuid(),
    name: z.string(),
    products: productSchema.array(),
  }),
});
