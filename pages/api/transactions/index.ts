import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/db";
import {
  OrderModelSchema,
  TransactionModelSchema,
  variantSchema,
} from "@/lib/schema";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import * as _ from "lodash";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      const { start, end, cashier } = req.query;
      const startDate = z.coerce.date().safeParse(start);
      const endDate = z.coerce.date().safeParse(end);
      const userId = z.string().cuid().safeParse(cashier);

      try {
        let args = {
          where: {},
          include: {
            orders: {
              select: {
                id: true,
                productId: true,
                price: true,
                quantity: true,
                variants: true,
                notes: true,
              },
            },
          },
        };

        if (startDate.success && endDate.success) {
          startDate.data.setHours(0o0, 0o0, 0o0);
          endDate.data.setHours(23, 59, 59);
          args = {
            ...args,
            where: {
              date: {
                gte: startDate.data,
                lte: endDate.data,
              },
            },
          };
        }

        if (userId.success) {
          args = {
            ...args,
            where: {
              ...args.where,
              userId: userId.data,
            },
          };
        }

        const transactions = await prisma.transaction.findMany(args);
        return res.status(200).json({ transactions: transactions });
      } catch (e) {
        return res
          .status(500)
          .json({ error: "Failed to retrieve transactions" });
      }
    case "POST":
      const transactionInput = TransactionModelSchema.extend({
        orders: OrderModelSchema.extend({
          variants: variantSchema.pick({ id: true }).array().optional(),
        })
          .array()
          .nonempty(),
      }).safeParse(req.body);
      if (!transactionInput.success) {
        return res.status(400).json({
          error: transactionInput.error,
        });
      }

      try {
        const result = await prisma.$transaction(async (tx) => {
          const newTransaction = await tx.transaction.create({
            data: {
              date: new Date(),
              user: {
                connect: {
                  id: transactionInput.data.userId,
                },
              },
            },
          });

          for (const order of transactionInput.data.orders) {
            const product = await tx.product.findUniqueOrThrow({
              where: {
                id: order.productId,
              },
              include: {
                variants: {
                  include: {
                    items: true,
                  },
                },
              },
            });

            if (product.stock < order.quantity)
              throw new Error("Not enough product in stock");

            await tx.product.update({
              where: {
                id: order.productId,
              },
              data: {
                stock: product.stock - order.quantity,
              },
            });

            const parsedVariants = variantSchema
              .pick({ id: true })
              .required()
              .array()
              .safeParse(order.variants);

            for (const variants of product.variants) {
              if (variants.required) {
                if (!order.variants)
                  throw new Error(`Missing required variant: ${variants.name}`);
                if (
                  _.intersectionBy(variants.items, order.variants, "id")
                    .length === 0
                ) {
                  throw new Error(`Missing required variant: ${variants.name}`);
                }
              }
            }

            if (parsedVariants.success) {
              if (
                order.variants?.length !== _.uniqBy(order.variants, "id").length
              )
                throw new Error("Invalid duplicate variant");

              const validVariants = _.flatten(_.map(product.variants, "items"));
              if (
                _.intersectionBy(validVariants, order.variants, "id").length !==
                order.variants.length
              )
                throw new Error("Invalid unknown variants");

              await tx.order.create({
                data: {
                  price: product.price,
                  quantity: order.quantity,
                  notes: order.notes,
                  variants: {
                    connect: parsedVariants.data,
                  },
                  product: {
                    connect: {
                      id: order.productId,
                    },
                  },
                  transaction: {
                    connect: {
                      id: newTransaction.id,
                    },
                  },
                },
              });
            } else {
              await tx.order.create({
                data: {
                  price: product.price,
                  quantity: order.quantity,
                  notes: order.notes,
                  product: {
                    connect: {
                      id: order.productId,
                    },
                  },
                  transaction: {
                    connect: {
                      id: newTransaction.id,
                    },
                  },
                },
              });
            }
          }

          return newTransaction;
        });
        return res.status(200).json(result);
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === "P2025") {
            return res.status(404).json({ error: e.message });
          }
        } else if (e instanceof Error) {
          return res.status(409).json({ error: e.message });
        }
        return res.status(500).json({ error: "Failed to create transaction" });
      }
    default:
      return res.status(405).json({
        error: "Invalid method",
      });
  }
}
