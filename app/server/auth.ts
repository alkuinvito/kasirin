import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultUser,
} from "next-auth";
import { getProviders } from "next-auth/react";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/app/server/db";
import { GetUserByID } from "../api/auth/lib/repository";

export enum Role {
  user = "user",
  admin = "admin",
}

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
  callbacks: {
    async signIn({ user }) {
      GetUserByID(user.id)
        .then((result) => {
          if (result?.role) {
            switch (result.role) {
              case "admin":
                user.role = Role.admin;
                break;
              case "user":
                user.role = Role.user;
                break;
            }
            return true;
          }
        })
        .catch((error) => {
          console.error(error);
        });
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
};

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();
  console.log(`providers: {providers}`);

  return {
    props: { providers: providers ?? [] },
  };
}
