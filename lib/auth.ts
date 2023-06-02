import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultUser,
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/db";
import { z } from "zod";

export const Role = z.enum(["admin", "user"]);
type Role = z.infer<typeof Role>;

interface IUser extends DefaultUser {
  role?: Role;
}
declare module "next-auth" {
  interface User extends IUser {}
  interface Session {
    user?: User;
  }
}
declare module "next-auth/jwt" {
  interface JWT extends IUser {}
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user }) {
      if (user.role === Role.enum.admin || user.role === Role.enum.user) {
        return true;
      }

      const result = await prisma.user.count({
        where: {
          role: "admin",
        },
      });
      if (result === 0) {
        user.role = Role.enum.admin;
        return true;
      }

      if (user.email) {
        const invited = await prisma.invitation.findUnique({
          where: {
            email: user.email,
          },
        });
        if (invited) {
          user.role = Role.parse(invited.role);
          await prisma.invitation.delete({
            where: {
              email: user.email,
            },
          });
          return true;
        }
      }

      return false;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
};

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
