import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { Role, productSchema, variantGroupSchema } from "@/lib/schema";
import { getToken } from "next-auth/jwt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = await getToken({ req });
  const { permalink } = req.query;
  const query = productSchema
    .pick({ permalink: true })
    .safeParse({ permalink: permalink });
  if (!query.success) {
    return res.status(400).json({ error: "Invalid product name" });
  }

  switch (req.method) {
    case "GET":
      try {
        const found = await prisma.product.findUnique({
          where: {
            permalink: query.data.permalink,
          },
          include: { variants: { include: { items: true } } },
        });
        if (!found) {
          return res.status(404).json({
            error: "Product does not exist",
          });
        }

        return res.status(200).json({
          product: found,
        });
      } catch (e) {
        return res.status(500).json({
          error: "Failed to get product",
        });
      }
    case "PATCH":
      if (
        token?.role === Role.enum.owner ||
        token?.role === Role.enum.manager
      ) {
        const productInput = productSchema
          .extend({
            variants: variantGroupSchema.pick({ id: true }).array().optional(),
          })
          .safeParse(req.body);
        if (!productInput.success)
          return res
            .status(400)
            .json({ error: productInput.error.flatten().fieldErrors });

        try {
          const updated = await prisma.product.update({
            where: {
              permalink: query.data.permalink,
            },
            data: {
              name: productInput.data.name,
              price: productInput.data.price,
              stock: productInput.data.stock,
              image: productInput.data.image,
              permalink: productInput.data.permalink,
              category: {
                connect: { id: productInput.data.categoryId },
              },
              variants: {
                set: [],
                connect: productInput.data.variants,
              },
            },
            include: {
              variants: true,
            },
          });

          return res.status(200).json({
            product: updated,
          });
        } catch (e) {
          if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2025") {
              return res.status(404).json({
                error: "Product does not exist",
              });
            }
          }
          return res.status(500).json({ error: "Failed to update product" });
        }
      }
      return res.status(403).json({
        error: "Only owner or manager can update product",
      });
    case "DELETE":
      if (
        token?.role === Role.enum.owner ||
        token?.role === Role.enum.manager
      ) {
        try {
          const deleted = await prisma.product.delete({
            where: {
              permalink: query.data.permalink,
            },
          });

          return res.status(200).json({
            message: `Product ${deleted.name} deleted successfully`,
          });
        } catch (e) {
          if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2025") {
              return res.status(404).json({
                error: "Product does not exist",
              });
            }
          }
          return res.status(500).json({ error: "Failed to delete product" });
        }
      }
      return res.status(403).json({
        error: "Only owner or manager can delete product",
      });
    default:
      return res.status(405).json({
        error: "Invalid method",
      });
  }
}
