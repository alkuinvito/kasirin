import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { Role, variantGroupSchema } from "@/lib/schema";
import { getToken } from "next-auth/jwt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = await getToken({ req });
  const { id } = req.query;
  const query = z.string().cuid().safeParse(id);
  if (!query.success) {
    return res.status(400).json({ error: "Invalid variant id" });
  }

  switch (req.method) {
    case "PATCH":
      if (
        token?.role === Role.enum.owner ||
        token?.role === Role.enum.manager
      ) {
        const variantInput = variantGroupSchema.required().safeParse(req.body);
        if (!variantInput.success) {
          return res.status(400).json({
            error: variantInput.error.flatten().fieldErrors,
          });
        }

        try {
          const updated = await prisma.$transaction(async (tx) => {
            const variantGroup = await tx.variantGroup.update({
              where: {
                id: query.data,
              },
              data: {
                name: variantInput.data.name,
                required: variantInput.data.required,
              },
            });

            variantInput.data.items.forEach(async (item) => {
              await tx.variant.upsert({
                where: {
                  id: item.id,
                },
                update: {
                  name: item.name,
                  price: item.price,
                },
                create: {
                  group: {
                    connect: {
                      id: query.data,
                    },
                  },
                  name: item.name,
                  price: item.price,
                },
              });
            });
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
      return res.status(403).json({
        error: "Only owner or manager can update variant",
      });
    case "DELETE":
      if (
        token?.role === Role.enum.owner ||
        token?.role === Role.enum.manager
      ) {
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
      return res.status(403).json({
        error: "Only owner or manager can update variant",
      });
    default:
      return res.status(405).json({
        error: "Invalid method",
      });
  }
}
