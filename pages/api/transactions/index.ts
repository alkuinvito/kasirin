import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/db";
import {
  OrderModelSchema,
  OrderVariantSchema,
  TransactionModelSchema,
  variantSchema,
} from "@/lib/schema";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import _ from "lodash";
import { getToken } from "next-auth/jwt";
import { calculateSkip, calculateTotalPage } from "@/lib/helper";
import dayjs from "dayjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      const { start, end, cashier, page, status } = req.query;
      const startDate = z.coerce.date().safeParse(start);
      const endDate = z.coerce.date().safeParse(end);
      const userId = z.string().cuid().safeParse(cashier);
      const pageParam = z.coerce
        .number()
        .min(0)
        .optional()
        .default(0)
        .parse(page);
      const statusParam = z.string().optional().default("").parse(status);

      try {
        let args = {
          where: {},
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

        if (statusParam) {
          if (statusParam === "pending") {
            _.set(args, "where.status", "expired");
            _.set(args, "where.date", {
              gt: dayjs().subtract(5, "minute").toDate(),
            });
          } else {
            _.set(args, "where.status", statusParam);
          }
        }

        const counter = await prisma.transaction.count(args);
        const transactions = await prisma.transaction.findMany({
          skip: calculateSkip(pageParam),
          take: 10,
          ...args,
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
          orderBy: [{ date: "desc" }],
        });

        for (const transaction of transactions) {
          if (
            dayjs().diff(transaction.date, "minute") < 5 &&
            transaction.status === "expired"
          ) {
            transaction.status = "pending";
          }
        }

        console.log(args);

        return res.status(200).json({
          transactions: transactions,
          page: pageParam,
          totalPage: calculateTotalPage(counter),
          total: counter,
        });
      } catch (e) {
        console.log(e);
        return res
          .status(500)
          .json({ error: "Failed to retrieve transactions" });
      }
    case "POST":
      const token = await getToken({ req });
      if (!token) {
        return res
          .status(401)
          .json({ error: "Only authenticated user can create transaction" });
      }

      const transactionInput = TransactionModelSchema.extend({
        orders: OrderModelSchema.extend({
          variants: variantSchema.pick({ id: true }).array().optional(),
        })
          .array()
          .nonempty(),
      })
        .omit({ userId: true })
        .safeParse(req.body);
      if (!transactionInput.success) {
        return res.status(400).json({
          error: transactionInput.error,
        });
      }

      try {
        const result = await prisma.$transaction(async (tx) => {
          let subtotal = 0,
            total = 0;

          const newTransaction = await tx.transaction.create({
            data: {
              subtotal: 0,
              total: 0,
              date: new Date(),
              user: {
                connect: {
                  id: token.sub,
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
              let currTotal = 0;
              if (
                order.variants?.length !== _.uniqBy(order.variants, "id").length
              )
                throw new Error("Invalid duplicate variant");

              const validVariants = _.flatten(_.map(product.variants, "items"));
              const orderVariant = OrderVariantSchema.omit({
                orderId: true,
              }).array();
              type orderVariantsType = z.infer<typeof orderVariant>;
              let orderVariants: orderVariantsType = [];
              for (const variant of order.variants) {
                const temp = _.intersectionBy(validVariants, [variant], "id");
                if (temp.length === 0) {
                  throw new Error("Invalid unknown variant");
                }
                orderVariants.push({
                  variantId: temp[0].id,
                  name: temp[0].name,
                  price: temp[0].price,
                });
                currTotal += temp[0].price;
              }
              currTotal += product.price;

              subtotal += order.quantity * currTotal;

              await tx.order.create({
                data: {
                  price: product.price,
                  quantity: order.quantity,
                  notes: order.notes,
                  variants: {
                    create: orderVariants,
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
              subtotal += order.quantity * product.price;
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

          total += subtotal;
          const fees = await tx.fee.findMany();
          for (const fee of fees) {
            switch (fee.type) {
              case "flat":
                total += fee.amount;
                break;
              case "percentage":
                total += subtotal * (fee.amount / 100);
                break;
            }
          }

          const updated = tx.transaction.update({
            where: {
              id: newTransaction.id,
            },
            data: {
              subtotal: subtotal,
              total: total,
            },
          });

          return updated;
        });
        result.status = "pending";
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
