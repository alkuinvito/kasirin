import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { Role } from "@/lib/schema";
import { getToken } from "next-auth/jwt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = await getToken({ req });
  switch (req.method) {
    case "GET":
      const { id } = req.query;
      const query = z.string().cuid().safeParse(id);
      if (query.success) {
        try {
          const result = await prisma.product.findFirst({
            where: {
              id: query.data,
            },
            include: {
              variants: true,
            },
          });
          return res.status(200).json({
            product: result,
          });
        } catch (e) {
          if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2003") {
              return res.status(404).json({
                error: "Product with this id is not exist",
              });
            }
          }
        }
      }
      return res.status(400).json({
        error: "Invalid id",
      });
    case "DELETE":
      if (
        token?.role === Role.enum.owner ||
        token?.role === Role.enum.manager
      ) {
        const { id } = req.query;
        const query = z.string().cuid().safeParse(id);
        if (query.success) {
          try {
            const deleted = await prisma.variant.delete({
              where: {
                id: query.data,
              },
            });
            return res.status(200).json({
              message: "Variant deleted successfully",
            });
          } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
              if (e.code === "P2003") {
                return res.status(400).json({
                  error: "Category does not exist",
                });
              }
            }
          }
        }
        return res.status(404).json({
          error: "Variant with this id is not exist",
        });
      }
      return res.status(403).json({
        error: "Only owner or manager can update variant",
      });
    default:
      return res.status(405).json({
        error: "Invalid method",
      });
  }
}
