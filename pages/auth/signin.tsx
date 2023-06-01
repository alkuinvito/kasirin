import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getProviders, signIn } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="rounded-lg bg-slate-800 max-w-md p-4 mx-auto">
      {Object.values(providers).map((provider) => (
        <div
          key={provider.name}
          className="bg-slate-600 p-2 rounded-md cursor-pointer"
        >
          <button onClick={() => signIn(provider.id)}>
            Sign in with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  const { redirectUrl } = context.query;

  if (session) {
    return {
      redirect: { destination: redirectUrl === "/admin" ? "/admin" : "/" },
    };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}
