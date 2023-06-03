import type { NextApiRequest, NextApiResponse } from "next";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { Role } from "@/lib/schema";

const schema = z.object({
  email: z.string().email(),
  role: Role,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      try {
        const data = schema.parse(req.body);

        const user = await prisma.user.findUnique({
          where: {
            email: data.email,
          },
        });

        if (user) {
          return res.status(400).send({
            error: `member with this email already exist`,
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
            return res.status(400).send({
              error: `invitation with this email already exist`,
            });
          }
        }
        return res.status(400).send({
          error: `invalid body request`,
        });
      }
      break;
    case "GET":
      const invitations = await prisma.invitation.findMany();
      return res.status(200).json({
        invitations,
      });
    default:
      return res.status(405).send({
        error: `invalid method`,
      });
  }
}
