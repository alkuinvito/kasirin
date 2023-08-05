import { OrderModelSchema } from "@/lib/schema";
import { z } from "zod";
import OrderItem from "./orderItem";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useState } from "react";
import Spinner from "./spinner";

const ordersSchema = OrderModelSchema.deepPartial().array();
type Orders = z.infer<typeof ordersSchema>;

export default function OrderList({
  orders,
  onDelete,
  onSubmit,
}: {
  orders: Orders;
  onDelete: Function;
  onSubmit: Function;
}) {
  const [isLoading, setLoading] = useState(false);
  const handleSubmit = async () => {
    setLoading(true);
    axios
      .post("/api/transactions", { orders }, { withCredentials: true })
      .then((res) => {
        setLoading(false);
        onSubmit({ success: true, id: res.data.id });
      })
      .catch((err) => {
        setLoading(false);
        onSubmit({ success: false, message: err.response.data.error });
      });
  };

  const calculatePrice = () => {
    let total = 0;
    for (const order of orders) {
      const items = order.product?.variants?.map((val) => val.items);
      const detailed = _.intersectionBy(_.flatten(items), order.variants, "id");
      const subtotal =
        (order.product?.price || 0) +
        detailed.reduce((acc, obj) => {
          return acc + (obj?.price || 0);
        }, 0);
      total += subtotal * (order.quantity || 0);
    }
    return total;
  };

  return (
    <div className="w-96 h-80 p-4 flex-col bg-gray-100 dark:bg-zinc-900 rounded-lg hidden lg:flex">
      <h1 className="text-2xl font-bold">Order</h1>
      {orders.length > 0 && (
        <ul>
          {orders.map((order) => (
            <OrderItem key={order.id} order={order} onDelete={onDelete} />
          ))}
        </ul>
      )}
      <div className="grow overflow-auto max-h-80"></div>
      <div>
        <h2 className="text-xl font-semibold flex justify-between">
          <span>Total:</span>
          <span>
            {Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              maximumSignificantDigits: 4,
            }).format(calculatePrice())}
          </span>
        </h2>
      </div>
      <button
        onClick={handleSubmit}
        className={`p-2 mt-2 w-32 self-end flex items-center justify-center rounded-lg text-white font-medium transition-colors ${
          !isLoading && orders.length > 0
            ? "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 cursor-pointer"
            : "bg-gray-200 dark:bg-zinc-800"
        }`}
        disabled={false}
      >
        {isLoading ? (
          <Spinner className="m-[2px] h-5 w-5 text-indigo-600 animate-spin" />
        ) : (
          <span>
            Checkout
            <FontAwesomeIcon className="ml-2" icon={faArrowRight} />
          </span>
        )}
      </button>
    </div>
  );
}
