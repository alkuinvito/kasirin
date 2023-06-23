import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/db";
import { UserModelSchema } from "@/lib/schema";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      const users = await prisma.user.findMany();
      const response = UserModelSchema.array().safeParse(users);
      if (response.success)
        return res.status(200).json({ users: response.data });
      return res.status(500).json({ error: "Failed to retrive users" });
    default:
      return res.status(405).send({
        error: "Invalid allowed method",
      });
  }
}
