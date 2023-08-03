import type { NextApiRequest, NextApiResponse } from "next";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { Role, UserModelSchema } from "@/lib/schema";
import { getToken } from "next-auth/jwt";
import z from "zod";
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
  const { id } = req.query;
  const query = z.string().cuid().safeParse(id);
  if (!query.success) {
    return res.status(400).json({
      error: "Invalid user id",
    });
  }

  const token = await getToken({ req });
  if (!token) {
    return res.status(401).json({
      error: "You must logged in to access/update profile",
    });
  }

  switch (req.method) {
    case "GET":
      const user = await prisma.user.findUnique({
        where: {
          id: query.data,
        },
      });
      const response = UserModelSchema.safeParse(user);
      if (response.success)
        return res.status(200).json({ user: response.data });
      return res.status(500).json({ error: "Failed to retrive user" });
    case "PATCH":
      if (token.role === Role.enum.owner) {
        const info = UserModelSchema.omit({ active: true }).safeParse(req.body);
        if (info.success) {
          try {
            const imgURL = info.data.image?.startsWith("http");
            if (!imgURL) {
              info.data.image = await UploadImg(info.data.image || "");
              if (!info.data.image)
                res.status(500).json({ error: "Failed to upload image" });
            }

            const updated = await prisma.user.update({
              where: {
                id: query.data,
              },
              data: {
                name: info.data.name,
                image: info.data.image,
                phone: info.data.phone,
                address: info.data.address,
                gender: info.data.gender,
                dob: info.data.dob,
                role: info.data.role,
              },
            });
            const response = UserModelSchema.parse(updated);
            return res.status(200).json({ user: response });
          } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
              if (e.code === "P2003") {
                return res.status(404).json({
                  error: "User with this id is not exist",
                });
              }
            }

            return res.status(500).json({
              error: "Failed to update user",
            });
          }
        }
        return res.status(400).json({
          error: info.error.flatten().fieldErrors,
        });
      }
      return res.status(403).json({
        error: "Only owner allowed to create/edit user",
      });
    case "DELETE":
      if (token.role === Role.enum.owner) {
        if (token.sub === query.data) {
          return res.status(400).json({ error: "Can not self-delete account" });
        }

        try {
          const deleted = await prisma.user.delete({
            where: {
              id: query.data,
            },
          });
          return res
            .status(200)
            .json({ message: `User ${deleted.email} deleted` });
        } catch (e) {
          if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2003") {
              return res.status(404).json({
                error: "User with this id is not exist",
              });
            }
          }

          return res.status(500).json({
            error: "Failed to delete user",
          });
        }
      }
      return res.status(403).json({
        error: "Only owner allowed to delete user",
      });
    default:
      return res.status(405).send({
        error: "Invalid allowed method",
      });
  }
}
