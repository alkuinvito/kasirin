import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultUser,
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/db";
import { Role } from "./schema";

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
    async signIn({ user, account }) {
      if (user.email) {
        const activeUser = await prisma.user.findUnique({
          where: {
            email: user.email,
          },
        });

        if (activeUser) {
          if (!activeUser.active && account) {
            try {
              const newAccount = await prisma.account.create({
                data: { ...account, userId: activeUser.id },
              });
              const updated = await prisma.user.update({
                where: {
                  id: activeUser.id,
                },
                data: {
                  active: true,
                  accounts: {
                    connect: {
                      id: newAccount.id,
                    },
                  },
                },
              });
            } catch (e) {
              console.error(e);
              return false;
            }
          }
          return true;
        }
      }

      const result = await prisma.user.count({
        where: {
          role: "owner",
        },
      });
      if (result === 0 && user.email) {
        user.role = Role.enum.owner;
        return true;
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
