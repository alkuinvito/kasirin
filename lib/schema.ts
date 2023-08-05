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

export const Status = z.enum(["done", "pending", "expired"]);
export type Status = z.infer<typeof Status>;

export const PaymentMethod = z.enum(["cash", "card", "e-wallet"]);
export type PaymentMethod = z.infer<typeof PaymentMethod>;

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
  image: z.string(),
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

export const OrderVariantSchema = z.object({
  orderId: z.string().cuid(),
  variantId: z.string().cuid(),
  name: z.string(),
  price: z.coerce.number().min(0).max(100000000),
});

export type OrderVariant = z.infer<typeof OrderVariantSchema>;

export const OrderModelSchema = z.object({
  id: z.string().cuid().optional(),
  transactionId: z.string().cuid().optional(),
  productId: z.string().cuid(),
  product: productSchema.optional(),
  price: z.coerce.number().min(0).max(100000000).optional(),
  quantity: z.coerce.number().min(1).max(1000),
  variants: OrderVariantSchema.array().optional(),
  notes: z.string().max(256).optional(),
});

export type OrderModel = z.infer<typeof OrderModelSchema>;

export const FeeSchema = z.object({
  id: z.string().cuid().optional(),
  type: z.enum(["flat", "percentage"]),
  name: z.string(),
  amount: z.number(),
});

export type Fee = z.infer<typeof FeeSchema>;

export const TransactionModelSchema = z.object({
  id: z.string().cuid().optional(),
  userId: z.string().cuid(),
  date: z.coerce.date().max(new Date()).optional(),
  orders: OrderModelSchema.array().nonempty(),
  status: Status.optional(),
  subtotal: z.number().optional(),
  total: z.number().optional(),
  method: PaymentMethod.optional(),
  user: z.object({ name: z.string() }).optional(),
});

export type TransactionModel = z.infer<typeof TransactionModelSchema>;

export const Transaction = z.object({
  transaction: TransactionModelSchema.extend({
    orders: OrderModelSchema.extend({
      product: productSchema.pick({ name: true, image: true }),
      variants: variantSchema
        .pick({ name: true, price: true })
        .array()
        .optional(),
    })
      .array()
      .nonempty(),
  }),
});

export type Transaction = z.infer<typeof Transaction>;
