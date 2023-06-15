import type { NextApiRequest, NextApiResponse } from "next";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { Role, profileSchema } from "@/lib/schema";
import { getToken } from "next-auth/jwt";

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
    case "POST":
      const token = await getToken({ req });
      if (token?.role === Role.enum.owner) {
        const valid = profileSchema.safeParse(req.body);
        if (!valid.success) {
          const error = valid.error.flatten();
          return res.status(400).json({
            error: error,
          });
        }

        try {
          await prisma.user.update({
            where: {
              email: valid.data.email,
            },
            data: {
              name: valid.data.fullname,
              role: valid.data.role,
            },
          });
        } catch (e) {
          if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2001") {
              return res.status(400).json({
                error: "Account with this email does not exist",
              });
            }
          }
        }
        return res.status(200).json({
          message: `${valid.data.email} updated successfully`,
        });
      }
      return res.status(403).json({ error: "Only owner can edit accounts" });
    default:
      return res.status(405).send({
        error: "Invalid allowed method",
      });
  }
}
