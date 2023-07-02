import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { Role, productSchema } from "@/lib/schema";
import { getToken } from "next-auth/jwt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = await getToken({ req });
  const { id } = req.query;
  const query = z.string().cuid().safeParse(id);
  if (!query.success) {
    return res.status(400).json({ error: "Invalid product id" });
  }

  switch (req.method) {
    case "GET":
      try {
        const found = await prisma.product.findUnique({
          where: {
            id: query.data,
          },
          include: {
            variants: true,
          },
        });
        if (!found) {
          return res.status(404).json({
            error: "Product with this id do not exist",
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
        const productInput = productSchema.safeParse(req.body);
        if (!productInput.success)
          return res
            .status(400)
            .json({ error: productInput.error.flatten().fieldErrors });

        try {
          const updated = await prisma.product.update({
            where: {
              id: query.data,
            },
            data: {
              name: productInput.data.name,
              price: productInput.data.price,
              stock: productInput.data.stock,
              image: productInput.data.image,
              variants: {
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
                error: "Product with this id do not exist",
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
              id: query.data,
            },
          });

          return res.status(200).json({
            message: `Product ${deleted.name} deleted successfully`,
          });
        } catch (e) {
          if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2025") {
              return res.status(404).json({
                error: "Product with this id do not exist",
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
