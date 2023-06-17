import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/db";
import { Role, productSchema } from "@/lib/schema";
import { Prisma } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import z from "zod";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = await getToken({ req });

  switch (req.method) {
    case "GET":
      const { q } = req.query;
      const query = z.string().safeParse(q);
      if (query.success) {
        const categories = await prisma.category.findMany({
          where: {
            products: {
              some: {
                name: {
                  contains: query.data,
                  mode: "insensitive",
                },
              },
            },
          },
          include: {
            products: true,
          },
        });
        return res.status(200).json({ categories });
      }
      const categories = await prisma.category.findMany({
        include: {
          products: true,
        },
      });
      return res.status(200).json({
        categories,
      });
    case "POST":
      if (
        token?.role === Role.enum.owner ||
        token?.role === Role.enum.manager
      ) {
        const data = productSchema.safeParse(req.body);
        if (!data.success) {
          return res.status(400).json({
            error: data.error.flatten().fieldErrors,
          });
        }
        try {
          const added = await prisma.product.create({
            data: {
              name: data.data.name,
              price: data.data.price,
              image: data.data.image,
              categoryId: data.data.categoryId,
            },
          });
          return res.status(200).json({
            product: added,
          });
        } catch (e) {
          if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2003") {
              return res.status(400).json({
                error: "Category does not exist",
              });
            }
            return res.status(500).json({
              error: "Failed to create product",
            });
          }
        }
      }
      return res.status(403).json({
        error: "Only owner or manager can create product",
      });
    default:
      return res.status(405).json({
        error: "Invalid method",
      });
  }
}
