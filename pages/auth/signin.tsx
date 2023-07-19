import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { signIn } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

export default function SignIn({}: InferGetServerSidePropsType<
  typeof getServerSideProps
>) {
  return (
    <div className="flex h-96 items-center">
      <div className="bg-white shadow-2xl w-72 h-72 rounded-lg mx-auto flex flex-col dark:bg-slate-900">
        <h1 className="bg-clip-text text-transparent bg-gradient-to-tr from-indigo-700 to-pink-400 font-bold text-3xl text-center pt-9">
          KasirIn
        </h1>
        <p className="text-center p-3">
          Make your business easier with Kasirin
        </p>
        <div className="p-4 rounded-lg text-center mt-10">
          <div>
            <button
              onClick={() => signIn("google")}
              className="py-2 px-5 w-fit box-border rounded-md text-center text-white bg-blue-600 hover:bg-blue-800 font-semibold cursor-pointer shadow-lg"
            >
              <FontAwesomeIcon icon={faGoogle} className="mr-2" />
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  const { callbackUrl } = context.query;

  if (session) {
    return {
      redirect: {
        permanent: false,
        destination: callbackUrl?.includes("/admin") ? "/admin" : "/",
      },
    };
  }

  return {
    props: {},
  };
}
