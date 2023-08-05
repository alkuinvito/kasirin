import { Transaction } from "@/lib/schema";
import dayjs from "dayjs";
import OrderItem from "@/components/payment/orderItem";
import * as Separator from "@radix-ui/react-separator";
import StatusBadge from "@/components/payment/statusBadge";

export default function TransactionDetail({ tran }: { tran: Transaction }) {
  return (
    <div className="p-4 grow rounded-lg bg-gray-100 dark:bg-zinc-900">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Transaction</h1>

          <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-800">
            #{tran?.transaction.id}
          </h3>
          <span className="font-medium dark:text-zinc-400">{`Cashier: ${tran?.transaction.user?.name}`}</span>
        </div>
        {tran?.transaction.date && (
          <div className="grid justify-items-end">
            <StatusBadge status={tran?.transaction.status} />
            <span>
              {dayjs(tran.transaction.date).format("ddd, D MMMM YYYY")}
            </span>
            <span>at {dayjs(tran.transaction.date).format("HH:mm:ss")}</span>
          </div>
        )}
      </div>
      <Separator.Root className="w-full h-[1px] my-1 bg-gray-200 dark:bg-zinc-700" />
      <div className="mt-3">
        {tran?.transaction.orders && (
          <ul className="grid gap-2">
            {tran.transaction.orders.map((order) => (
              <OrderItem key={order.id} order={order} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
