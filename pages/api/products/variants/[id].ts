import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { Role, variantSchema } from "@/lib/schema";
import { getToken } from "next-auth/jwt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = await getToken({ req });
  switch (req.method) {
    case "PATCH":
      if (
        token?.role === Role.enum.owner ||
        token?.role === Role.enum.manager
      ) {
        const { id } = req.query;
        const query = z.string().cuid().safeParse(id);
        if (query.success) {
          const data = variantSchema.safeParse(req.body);
          if (data.success) {
            try {
              const updated = await prisma.variant.update({
                where: {
                  id: query.data,
                },
                data: {
                  name: data.data.name,
                  price: data.data.price,
                },
              });
              return res.status(200).json({
                variant: updated,
              });
            } catch (e) {
              if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === "P2003") {
                  return res.status(404).json({
                    error: "Variant with this id is not exist",
                  });
                }
              }
            }
          }
        }
        return res.status(400).json({
          error: "Invalid id",
        });
      }
      return res.status(403).json({
        error: "Only owner or manager can update variant",
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
