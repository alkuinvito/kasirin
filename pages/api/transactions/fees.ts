import prisma from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      try {
        const fees = await prisma.fee.findMany();
        return res.status(200).json(fees);
      } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Failed to retrieve fees" });
      }
    default:
      return res.status(405).json({ error: "Invalid request method" });
  }
}
