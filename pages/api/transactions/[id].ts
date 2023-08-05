import prisma from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import dayjs from "dayjs";
import { Prisma } from "@prisma/client";
import { PaymentMethod } from "@/lib/schema";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const query = z.string().cuid().safeParse(id);
  if (!query.success) {
    return res.status(400).json({
      error: "Invalid transaction id",
    });
  }

  switch (req.method) {
    case "GET":
      try {
        const result = await prisma.transaction.findFirstOrThrow({
          where: { id: query.data },
          include: {
            user: {
              select: {
                name: true,
              },
            },
            orders: {
              include: {
                product: {
                  select: {
                    name: true,
                    image: true,
                  },
                },
                variants: {
                  select: {
                    name: true,
                    price: true,
                  },
                },
              },
            },
          },
        });

        if (
          dayjs().diff(result.date, "minute") < 5 &&
          result.status === "expired"
        ) {
          result.status = "pending";
        }

        return res.status(200).json({ transaction: result });
      } catch (e) {
        console.error(e);
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === "P2025") {
            return res
              .status(404)
              .json({ error: "Transaction with this id does not exist" });
          }
        }
        return res.status(500).json({ error: "Failed to update transaction" });
      }
    case "PATCH":
      const input = z.object({ method: PaymentMethod }).safeParse(req.body);
      if (!input.success) {
        return res.status(400).json({ error: "Invalid payment method" });
      }

      try {
        const current = await prisma.transaction.findFirstOrThrow({
          where: { id: query.data },
          include: {
            orders: { include: { product: { select: { id: true } } } },
          },
        });
        if (current.status === "done") {
          return res
            .status(409)
            .json({ error: "Transaction has already paid" });
        }

        if (dayjs().diff(dayjs(current.date), "minute") >= 5) {
          return res.status(400).json({ error: "Expired transaction" });
        }

        const result = await prisma.$transaction(async (tx) => {
          await tx.transaction.update({
            where: { id: query.data },
            data: { status: "done", method: input.data.method },
          });

          for (const order of current.orders) {
            const product = await tx.product.findUniqueOrThrow({
              where: { id: order.productId },
            });

            if (product.stock < order.quantity) throw new Error("ErrStock");

            await tx.product.update({
              where: {
                id: order.productId,
              },
              data: {
                stock: product.stock - order.quantity,
              },
            });
          }
        });
        return res.status(200).json({ id: query.data });
      } catch (e) {
        console.error(e);
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === "P2025") {
            return res
              .status(404)
              .json({ error: "Transaction with this id does not exist" });
          }
        } else if (e instanceof Error) {
          if (e.message === "ErrStock") {
            await prisma.transaction.delete({ where: { id: query.data } });
            return res
              .status(409)
              .json({ error: "Not enough product in stock" });
          }
        }
        return res.status(500).json({ error: "Failed to update transaction" });
      }

    default:
      return res.status(405).json({ error: "Invalid request method" });
  }
}
