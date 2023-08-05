import MainLayout from "@/components/shared/MainLayout";
import PaymentDetail from "@/components/payment/paymentDetail";
import TransactionDetail from "@/components/shared/transactionDetail";
import { ToastProvider, ToastViewport } from "@radix-ui/react-toast";
import { Toast } from "@/components/shared/toast";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { Cross1Icon } from "@radix-ui/react-icons";
import ErrorWrapper from "@/components/shared/errorWrapper";
import { Transaction } from "@/lib/schema";
import { ParsedUrlQuery } from "querystring";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";

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
  const router = useRouter();
  const [toastErr, setToastErr] = useState("");
  const [openErr, setOpenErr] = useState(false);

  const handleUpdate = (success: boolean, message: string) => {
    if (success && props.transaction) {
      router.push(`/transaction/${props.transaction.id}/receipt`);
    } else {
      setToastErr(message);
      setOpenErr(true);
    }
  };

  if (!props.transaction) {
    return (
      <MainLayout>
        <ErrorWrapper desc="Looks like you are visiting expired or invalid transaction payment" />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <ToastProvider swipeDirection="right">
        <Toast
          severity="error"
          content={toastErr}
          open={openErr}
          setOpen={setOpenErr}
        >
          <button onClick={() => setOpenErr(false)}>
            <Cross1Icon />
          </button>
        </Toast>
        <div className="flex gap-4">
          <TransactionDetail tran={props} />
          <PaymentDetail tran={props} onUpdate={handleUpdate} />
        </div>
        <ToastViewport className="fixed bottom-0 right-0 flex flex-col gap-3 w-96 max-w-[100vw] m-0 z-50 outline-none p-6" />
      </ToastProvider>
    </MainLayout>
  );
}
