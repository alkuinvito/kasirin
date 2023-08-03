import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/db";
import { UserModelSchema } from "@/lib/schema";
import { Prisma } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { Role } from "@/lib/schema";
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
  switch (req.method) {
    case "GET":
      const users = await prisma.user.findMany();
      const response = UserModelSchema.array().safeParse(users);
      if (response.success)
        return res.status(200).json({ users: response.data });
      return res.status(500).json({ error: "Failed to retrive users" });
    case "POST":
      const token = await getToken({ req });
      if (token?.role === Role.enum.owner) {
        const userInput = UserModelSchema.omit({
          id: true,
          active: true,
        }).safeParse(req.body);
        if (!userInput.success) {
          return res.status(400).json({
            error: userInput.error.flatten().fieldErrors,
          });
        }

        try {
          const imgURL = userInput.data.image?.startsWith("http");
          if (!imgURL) {
            userInput.data.image = await UploadImg(userInput.data.image || "");
            if (!userInput.data.image)
              res.status(500).json({ error: "Failed to upload image" });
          }

          const added = await prisma.user.create({
            data: { ...userInput.data, active: false },
          });

          const response = UserModelSchema.parse(added);
          return res.status(200).json({ user: response });
        } catch (e) {
          console.log(e);
          if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2002") {
              return res.status(400).json({
                error: "User with this email or phone already exist",
              });
            }
          }
          return res.status(500).json({ error: "Failed to create user" });
        }
      }
      return res.status(403).json({
        error: "Only owner can add user",
      });
    default:
      return res.status(405).send({
        error: "Invalid allowed method",
      });
  }
}
