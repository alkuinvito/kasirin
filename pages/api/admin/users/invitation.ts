import type { NextApiRequest, NextApiResponse } from "next";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { Role } from "@/lib/schema";
import { getToken } from "next-auth/jwt";

const schema = z.object({
  email: z.string().email(),
  role: Role,
});

const deletedReq = z.object({ email: z.string().email() });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = await getToken({ req });
  switch (req.method) {
    case "POST":
      if (token?.role !== Role.enum.owner) {
        return res.status(403).json({ error: "Only owner can add invitation" });
      }
      try {
        const data = schema.parse(req.body);

        const user = await prisma.user.findUnique({
          where: {
            email: data.email,
          },
        });

        if (user) {
          return res.status(400).json({
            error: "Member with this email already exist",
          });
        }

        const invitation = await prisma.invitation.create({
          data: {
            email: data.email,
            role: data.role,
          },
        });

        res.status(200).json({
          invitation,
        });
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            return res.status(400).json({
              error: "Invitation with this email already exist",
            });
          }
        }
        return res.status(400).json({
          error: "Invalid body request",
        });
      }
      break;
    case "GET":
      const invitations = await prisma.invitation.findMany();
      return res.status(200).json({
        invitations,
      });
    case "PATCH":
      if (token?.role !== Role.enum.owner) {
        return res
          .status(403)
          .json({ error: "Only owner can delete invitation" });
      }
      const data = deletedReq.safeParse(req.body);
      if (data.success) {
        try {
          const deleted = await prisma.invitation.delete({
            where: {
              email: data.data.email,
            },
          });
          return res.status(200).json({
            message: `${data.data.email} deleted`,
          });
        } catch (e) {
          return res.status(400).json({
            error: "Email does not exist",
          });
        }
      }
      return res.status(400).json({
        error: "Invalid email",
      });
    default:
      return res.status(405).json({
        error: "Invalid method",
      });
  }
}
