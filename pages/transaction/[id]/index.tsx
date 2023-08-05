import MainLayout from "@/components/shared/MainLayout";
import ErrorWrapper from "@/components/shared/errorWrapper";
import { FeeSchema, Transaction } from "@/lib/schema";
import axios from "axios";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { ParsedUrlQuery } from "querystring";
import TransactionDetail from "../../../components/shared/transactionDetail";
import { useQuery } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import * as Separator from "@radix-ui/react-separator";
import Link from "next/link";

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
  const getFees = async () => {
    const response = await axios.get("/api/transactions/fees", {
      withCredentials: true,
    });

    return FeeSchema.array().optional().parse(response.data);
  };

  const { data } = useQuery({
    queryKey: ["fees"],
    queryFn: () => getFees(),
  });

  if (!props.transaction) {
    return (
      <MainLayout>
        <ErrorWrapper redirectUrl="/transaction" />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-2">
        <Link href="/transaction" className="hover:text-indigo-700">
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Back to transaction
        </Link>
      </div>
      <TransactionDetail tran={props} />
      <div className="p-4 mt-4 w-1/3 float-right rounded-lg bg-gray-100 dark:bg-zinc-900">
        <span className="flex justify-between text-lg font-medium">
          Method<span>{props.transaction.method}</span>
        </span>
        <Separator.Root className="w-full h-[1px] my-2 bg-gray-200 dark:bg-zinc-700" />
        <span className="flex justify-between text-lg">
          Subtotal
          <span>
            {Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              maximumSignificantDigits: 4,
            }).format(props.transaction.subtotal || 0)}
          </span>
        </span>
        {(data?.length || 0) > 0
          ? data?.map((fee) => (
              <span key={fee.id} className="flex justify-between text-lg">
                {`${fee.name}${
                  fee.type === "percentage" ? ` (${fee.amount}%)` : ""
                }`}
                <span>
                  {Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumSignificantDigits: 4,
                  }).format(
                    fee.type === "percentage"
                      ? (props.transaction.subtotal || 0) * (fee.amount / 100)
                      : fee.amount
                  )}
                </span>
              </span>
            ))
          : null}
        <Separator.Root className="w-full h-[1px] my-2 bg-gray-200 dark:bg-zinc-700" />
        <span className="flex justify-between text-xl font-medium">
          Total
          <span>
            {Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              maximumSignificantDigits: 4,
            }).format(props.transaction.total || 0)}
          </span>
        </span>
      </div>
    </MainLayout>
  );
}
