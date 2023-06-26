import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/db";
import { Role, categorySchema } from "@/lib/schema";
import { getToken } from "next-auth/jwt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = await getToken({ req });
  switch (req.method) {
    case "GET":
      const categories = await prisma.category.findMany();
      return res.status(200).json({
        categories,
      });
    case "POST":
      if (
        token?.role === Role.enum.owner ||
        token?.role === Role.enum.manager
      ) {
        const data = categorySchema.partial({ id: true }).safeParse(req.body);
        if (!data.success) {
          return res.status(400).json({
            error: data.error.flatten().fieldErrors,
          });
        }
        try {
          const added = await prisma.category.create({
            data: {
              name: data.data.name,
            },
          });
          return res.status(200).json({
            category: added,
          });
        } catch (e) {
          return res.status(500).json({
            error: "Failed to create category",
          });
        }
      }
      return res.status(403).json({
        error: "Only owner or manager can create category",
      });
    default:
      return res.status(405).json({
        error: "Invalid method",
      });
  }
}
