import { prisma } from "@/lib/db";

/** GetUserByID find a user using the given user id
 */
export async function GetUserByID(uid: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: uid,
    },
  });
  return user;
}