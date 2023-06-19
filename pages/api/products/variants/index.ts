import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/db";
import { Role, variantSchema } from "@/lib/schema";
import { getToken } from "next-auth/jwt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = await getToken({ req });

  switch (req.method) {
    case "GET":
      const variants = await prisma.variant.findMany();
      return res.status(200).json({
        variants,
      });
    case "POST":
      if (
        token?.role === Role.enum.owner ||
        token?.role === Role.enum.manager
      ) {
        const data = variantSchema.safeParse(req.body);
        if (data.success) {
          const added = await prisma.variant.create({
            data: data.data,
          });
          return res.status(200).json({ variant: added });
        }
        return res.status(400).json({
          error: data.error.flatten().fieldErrors,
        });
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
