import MainLayout from "@/components/shared/MainLayout";
import ErrorWrapper from "@/components/shared/errorWrapper";
import { Transaction } from "@/lib/schema";
import axios from "axios";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { ParsedUrlQuery } from "querystring";
import TransactionDetail from "../../../components/shared/transactionDetail";

interface Params extends ParsedUrlQuery {
  id: string;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id } = context.params as Params;

  try {
    const result = await axios.get<Transaction>(
      `${process.env.NEXT_PUBLIC_APP_HOST}/api/transactions/${id}`,
      {
        headers: {
          cookie: context.req.headers.cookie,
        },
      }
    );
    const transaction = result.data.transaction;
    return { props: { transaction } };
  } catch (e) {
    return { props: {} };
  }
}

export default function Page(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  if (!props.transaction) {
    return (
      <MainLayout>
        <ErrorWrapper redirectUrl="/transaction" />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <TransactionDetail tran={props} />
    </MainLayout>
  );
}
