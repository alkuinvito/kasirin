import { Transaction } from "@/lib/schema";
import {
  faCreditCard,
  faMoneyBill1Wave,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import PaymentMethodBtn from "./paymentMethodBtn";
import { useState } from "react";
import * as Separator from "@radix-ui/react-separator";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FeeSchema } from "@/lib/schema";
import Spinner from "../shared/spinner";

export default function PaymentDetail({
  tran,
  onUpdate,
}: {
  tran: Transaction;
  onUpdate: Function;
}) {
  const [method, setMethod] = useState("cash");
  const [isLoading, setLoading] = useState(false);

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

  const handleSubmit = async () => {
    setLoading(true);
    axios
      .patch(
        `/api/transactions/${tran.transaction.id}`,
        { method: method },
        { withCredentials: true }
      )
      .then(() => {
        setLoading(false);
        onUpdate(true, "");
      })
      .catch((e) => {
        setLoading(false);
        console.error(e.response.data.error);
        onUpdate(false, e.response.data.error);
      });
  };

  return (
    <div>
      <div className="p-4 w-96 h-min rounded-lg bg-gray-100 dark:bg-zinc-900">
        <div className="grid">
          <h1 className="text-2xl font-semibold">Payment</h1>
          <div className="grid gap-2 m-4">
            <PaymentMethodBtn
              name="Cash"
              icon={faMoneyBill1Wave}
              active={method === "cash"}
              onClick={() => setMethod("cash")}
            />
            <PaymentMethodBtn
              name="Credit/Debit"
              icon={faCreditCard}
              active={method === "card"}
              onClick={() => setMethod("card")}
            />
            <PaymentMethodBtn
              name="E-wallet"
              icon={faWallet}
              active={method === "e-wallet"}
              onClick={() => setMethod("e-wallet")}
            />
          </div>
        </div>
        <Separator.Root className="w-full h-[1px] my-1 bg-gray-200 dark:bg-zinc-700" />
        <div className="grid py-2">
          <span className="flex justify-between text-lg">
            Subtotal
            <span>
              {Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumSignificantDigits: 4,
              }).format(tran.transaction.subtotal || 0)}
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
                        ? (tran.transaction.subtotal || 0) * (fee.amount / 100)
                        : fee.amount
                    )}
                  </span>
                </span>
              ))
            : null}
        </div>
        <Separator.Root className="w-full h-[1px] my-1 bg-gray-200 dark:bg-zinc-700" />
        <span className="flex justify-between text-xl font-medium">
          Total{" "}
          <span>
            {Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              maximumSignificantDigits: 4,
            }).format(tran.transaction.total || 0)}
          </span>
        </span>
      </div>
      <button
        className={
          "mt-4 p-2 w-full box-border flex items-center justify-center rounded-lg text-white font-medium text-center " +
          (isLoading
            ? "bg-indigo-700 dark:bg-indigo-900"
            : " bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-800 dark:hover:bg-indigo-900 cursor-pointer transition-colors")
        }
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <Spinner className="m-1 animate-spin h-4 w-4 text-white" />
        ) : (
          <span>Proceed</span>
        )}
      </button>
    </div>
  );
}
