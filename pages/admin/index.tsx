import { Role, authOptions } from "@/lib/auth";
import type { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth/next";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  console.log(session);

  if (session?.user?.role !== Role.admin) {
    return {
      redirect: {
        destination: "/auth/signin?redirectUrl=/admin",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}

export default function Page() {
  return (
    <>
      <h1>This is protected admin page</h1>
    </>
  );
}
