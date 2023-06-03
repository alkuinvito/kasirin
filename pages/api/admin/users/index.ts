import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      const users = await prisma.user.findMany();
      return res.status(200).json({
        users,
      });
    default:
      return res.status(405).send({
        error: `invalid method`,
      });
  }
}
