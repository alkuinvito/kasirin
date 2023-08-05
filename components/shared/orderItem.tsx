import React, { useState } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { OrderModelSchema } from "@/lib/schema";
import {
  faChevronDown,
  faChevronUp,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { z } from "zod";
import _ from "lodash";
import Image from "next/image";

const Order = OrderModelSchema.deepPartial();
type Order = z.infer<typeof Order>;

export default function OrderItem({
  order,
  onDelete,
}: {
  order: Order;
  onDelete: Function;
}) {
  const [open, setOpen] = useState(false);

  const items = order.product?.variants?.map((val) => val.items);
  const detailed = _.intersectionBy(_.flatten(items), order.variants, "id");
  const subtotal =
    (order.product?.price || 0) +
    detailed.reduce((acc, obj) => {
      return acc + (obj?.price || 0);
    }, 0);

  return (
    <li key={order.id}>
      <Collapsible.Root open={open} onOpenChange={setOpen}>
        <div className="flex p-2 gap-4 items-center justify-between">
          <Image
            src={order.product?.image || ""}
            alt={order.product?.name || ""}
            width={32}
            height={32}
            className="w-8 h-8 object-cover rounded-lg"
          />
          <span className="grow self-start grid">
            <span className="text-sm font-semibold">{order.product?.name}</span>
            <span className="text-sm">
              {`${Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumSignificantDigits: 4,
              }).format(subtotal)} × ${order.quantity}`}
            </span>
          </span>
          {(detailed.length !== 0 || order.notes) && (
            <Collapsible.Trigger className="w-8 h-8 flex justify-center mx-auto items-center rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800 cursor-pointer transition">
              {open ? (
                <FontAwesomeIcon icon={faChevronUp} />
              ) : (
                <FontAwesomeIcon icon={faChevronDown} />
              )}
            </Collapsible.Trigger>
          )}
          <button
            onClick={() => onDelete(order.id)}
            className="w-8 h-8 flex justify-center mx-auto items-center rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800 cursor-pointer transition"
          >
            <FontAwesomeIcon icon={faTrashCan} />
          </button>
        </div>
        {(detailed.length !== 0 || order.notes) && (
          <Collapsible.Content>
            <div className="p-2 mx-2 grid rounded-b-lg bg-gray-200 dark:bg-zinc-800">
              {order.notes && (
                <span className="text-sm">
                  <i>{`Note: ${order.notes}`}</i>
                </span>
              )}
              {detailed.map((variant) => (
                <span
                  key={variant?.id}
                  className="flex justify-between text-sm font-medium"
                >
                  <span>{variant?.name}</span>
                  <span>
                    {Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      maximumSignificantDigits: 4,
                    }).format(variant?.price || 0)}
                  </span>
                </span>
              ))}
            </div>
          </Collapsible.Content>
        )}
      </Collapsible.Root>
    </li>
  );
}
