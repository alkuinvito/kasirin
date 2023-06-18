import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/db";
import { z } from "zod";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      const { id } = req.query;
      const query = z.string().cuid().safeParse(id);
      if (query.success) {
        const categories = await prisma.category.findMany({
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
      }
      return res.status(404).json({
        error: "Category with this id is not exist",
      });
    default:
      return res.status(405).json({
        error: "Invalid method",
      });
  }
}
