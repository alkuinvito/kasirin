import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { Role, categorySchema } from "@/lib/schema";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const query = z.string().cuid().safeParse(id);
  if (!query.success) {
    return res.status(400).json({
      error: "Invalid category id",
    });
  }

  const token = await getToken({ req });
  switch (req.method) {
    case "GET":
      try {
        const categories = await prisma.category.findUnique({
          where: {
            id: query.data,
          },
          include: {
            products: true,
          },
        });
        return res.status(200).json({
          categories,
        });
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === "P2003") {
            return res.status(404).json({
              error: "Category with this id is not exist",
            });
          }
        }
        return res.status(500).json({
          error: "Failed to get category",
        });
      }
    case "PATCH":
      if (
        token?.role === Role.enum.owner ||
        token?.role === Role.enum.manager
      ) {
        const data = categorySchema.partial({ id: true }).safeParse(req.body);
        if (!data.success) {
          return res.status(400).json({ error: "Invalid category" });
        }
        try {
          const updated = await prisma.category.update({
            where: {
              id: query.data,
            },
            data: { name: data.data.name },
          });
          return res.status(200).json({
            category: updated,
          });
        } catch (e) {
          if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2025") {
              return res.status(404).json({
                error: "Category with this id is not exist",
              });
            }
          }
          return res.status(500).json({
            error: "Failed to update category",
          });
        }
      }
      return res.status(403).json({
        error: "Only owner or manager can update category",
      });
    case "DELETE":
      if (
        token?.role === Role.enum.owner ||
        token?.role === Role.enum.manager
      ) {
        try {
          const deleted = await prisma.category.delete({
            where: {
              id: query.data,
            },
            include: {
              products: true,
            },
          });
          return res.status(200).json({
            message: `Category ${deleted.name} deleted`,
          });
        } catch (e) {
          if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2025") {
              return res.status(404).json({
                error: "Category with this id is not exist",
              });
            }
          }
          return res.status(500).json({
            error: "Failed to delete category",
          });
        }
      }
      return res.status(403).json({
        error: "Only owner or manager can delete category",
      });
    default:
      return res.status(405).json({
        error: "Invalid method",
      });
  }
}
