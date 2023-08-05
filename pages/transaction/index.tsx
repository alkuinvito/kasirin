import StatusBadge from "@/components/payment/statusBadge";
import MainLayout from "@/components/shared/MainLayout";
import TableFooter from "@/components/shared/tableFooter";
import { Transaction } from "@/lib/schema";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import dayjs from "dayjs";
import { useState } from "react";
import { z } from "zod";

const Transactions = z.object({
  transactions: Transaction.shape.transaction.array().optional(),
  page: z.number(),
  totalPage: z.number(),
  total: z.number(),
});

type Transactions = z.infer<typeof Transactions>;

const Params = z.object({
  page: z.number(),
  status: z.string(),
});

type Params = z.infer<typeof Params>;

export default function Page() {
  const [params, setParams] = useState<Params>({ page: 0, status: "" });

  const getTransactions = (params: Params) => {
    return axios.get<Transactions>(
      `/api/transactions?page=${params.page}&status=${params.status}`
    );
  };

  const { isLoading, isError, error, data, isFetching } = useQuery({
    queryKey: ["projects", params],
    queryFn: () => getTransactions(params),
    keepPreviousData: false,
  });

  const handleChangePage = (page: number) => {
    setParams((prev) => ({ ...prev, page: page }));
  };

  const handleChangeStatus = (current: string) => {
    setParams((prev) => ({ ...prev, page: 0, status: current }));
  };

  return (
    <MainLayout>
      <h2 className="font-semibold text-2xl">Transactions</h2>
      <div className="border border-solid border-gray-200 dark:border-zinc-800 rounded-lg">
        <div className="px-4 pt-2 border-b border-solid border-gray-200 dark:border-zinc-800">
          <button
            className={
              "py-2 px-4 min-w-[2rem] mr-2 rounded-t-lg text-center " +
              (params.status === ""
                ? "bg-indigo-300 dark:bg-indigo-900"
                : " hover:bg-indigo-100 dark:hover:bg-indigo-950 cursor-pointer")
            }
            onClick={() => handleChangeStatus("")}
            disabled={params.status === ""}
          >
            All
          </button>
          <button
            className={
              "py-2 px-4 min-w-[2rem] mr-2 rounded-t-lg text-center " +
              (params.status === "done"
                ? "bg-indigo-300 dark:bg-indigo-900"
                : " hover:bg-indigo-100 dark:hover:bg-indigo-950 cursor-pointer")
            }
            onClick={() => handleChangeStatus("done")}
            disabled={params.status === "done"}
          >
            Done
          </button>
          <button
            className={
              "py-2 px-4 min-w-[2rem] mr-2 rounded-t-lg text-center " +
              (params.status === "pending"
                ? "bg-indigo-300 dark:bg-indigo-900"
                : " hover:bg-indigo-100 dark:hover:bg-indigo-950 cursor-pointer")
            }
            onClick={() => handleChangeStatus("pending")}
            disabled={params.status === "pending"}
          >
            Pending
          </button>
          <button
            className={
              "py-2 px-4 min-w-[2rem] mr-2 rounded-t-lg text-center " +
              (params.status === "expired"
                ? "bg-indigo-300 dark:bg-indigo-900"
                : " hover:bg-indigo-100 dark:hover:bg-indigo-950 cursor-pointer")
            }
            onClick={() => handleChangeStatus("expired")}
            disabled={params.status === "expired"}
          >
            Expired
          </button>
        </div>
        <div className="p-4 ">
          <select className="py-2 px-3 bg-gray-100 dark:bg-zinc-900 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-800 focus:bg-gray-200 dark:focus:bg-zinc-800 appearance-none">
            <option>Cash</option>
            <option>Card</option>
            <option>E-wallet</option>
          </select>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="!font-medium bg-gray-100 dark:bg-zinc-900">
              <th className="p-4">Cashier</th>
              <th className="p-4">Date</th>
              <th className="p-4">Method</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {data?.data.transactions?.map((transaction) => (
              <tr
                key={transaction.id}
                className="hover:bg-gray-100 dark:hover:bg-zinc-900"
              >
                <td className="px-4 py-2">{transaction.user?.name}</td>
                <td className="grid px-4 py-2">
                  <span>{dayjs(transaction.date).format("DD MMM YYYY")}</span>
                  <span>{dayjs(transaction.date).format("HH:mm")}</span>
                </td>
                <td className="px-4 py-2">{transaction.method}</td>
                <td className="px-4 py-2">
                  {Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumSignificantDigits: 4,
                  }).format(transaction.total || 0)}
                </td>
                <td className="px-4 py-2">
                  <StatusBadge status={transaction.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="bg-gray-100 dark:bg-zinc-900 rounded-b-lg">
          <TableFooter
            visibleRowsLength={data?.data.transactions?.length}
            dataLength={data?.data.total}
            page={params.page}
            onChangePage={(num: number) => handleChangePage(num)}
          />
        </div>
      </div>
    </MainLayout>
  );
}
