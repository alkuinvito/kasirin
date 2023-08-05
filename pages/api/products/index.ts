import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/db";
import { Role, productSchema } from "@/lib/schema";
import { Prisma } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import z from "zod";
import { UploadImg } from "@/lib/image";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "5mb",
    },
  },
};

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
        const products = await prisma.product.findMany({
          where: {
            name: {
              contains: query.data,
              mode: "insensitive",
            },
          },
          include: {
            variants: {
              include: {
                items: true,
              },
            },
          },
        });
        return res.status(200).json({ products });
      }
      const products = await prisma.product.findMany({
        include: {
          variants: {
            include: {
              items: true,
            },
          },
        },
      });
      return res.status(200).json({
        products,
      });
    case "POST":
      if (
        token?.role === Role.enum.owner ||
        token?.role === Role.enum.manager
      ) {
        const data = productSchema
          .extend({
            variants: z.object({ id: z.string().cuid() }).array().optional(),
          })
          .safeParse(req.body);
        if (!data.success) {
          return res.status(400).json({
            error: data.error.flatten().fieldErrors,
          });
        }
        try {
          if (!data.data.image.startsWith("http")) {
            data.data.image = await UploadImg(data.data.image);
            if (!data.data.image)
              res.status(500).json({ error: "Failed to upload image" });
          }

          const added = await prisma.product.create({
            data: {
              name: data.data.name,
              price: data.data.price,
              image: data.data.image,
              stock: data.data.stock,
              permalink: data.data.permalink,
              variants: {
                connect: data.data.variants,
              },
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
            } else if (e.code === "P2002") {
              return res.status(400).json({
                error: "Permalink already exists",
              });
            }
            return res.status(500).json({
              error: "Failed to create category",
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
