import { Dispatch, SetStateAction } from "react";
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

export const variantSchema = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  price: z.number().int().gte(0),
});

export const productSchema = z.object({
  id: z.string().cuid().optional(),
  name: z
    .string({
      required_error: "Name must not be empty",
      invalid_type_error: "Name must be a string",
    })
    .min(3, "Name must between 3 and 16 characters long")
    .max(32, "Name must between 3 and 16 characters long"),
  price: z
    .number({
      required_error: "Price must not be empty",
      invalid_type_error: "Price must be an integer",
    })
    .positive("Price can not be negative value")
    .safe(),
  image: z
    .string({
      required_error: "Image must not be empty",
    })
    .url("Image must be a valid URL"),
  variants: variantSchema.array().optional(),
  categoryId: z
    .string({
      required_error: "Category must not be empty",
    })
    .cuid("Category must be a valid CUID"),
  available: z.boolean().default(true),
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
