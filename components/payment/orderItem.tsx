import React from "react";
import { OrderModelSchema } from "@/lib/schema";
import { z } from "zod";
import _ from "lodash";
import Image from "next/image";

const Product = z.object({
  name: z.string(),
  image: z.string().url(),
});

const Variant = z.object({
  name: z.string(),
  price: z.number(),
});

const Order = OrderModelSchema.extend({
  product: Product,
  variants: Variant.array().optional(),
});
type Order = z.infer<typeof Order>;

export default function OrderItem({ order }: { order: Order }) {
  let subtotal = order.price || 0;

  if (order.variants) {
    subtotal += order.variants.reduce((acc, obj) => {
      return acc + obj.price;
    }, 0);
  }

  let total = subtotal * order.quantity;

  return (
    <li
      key={order.id}
      className="p-2 grid gap-2 border rounded-lg dark:border-zinc-700"
    >
      <div className="flex gap-4 items-center justify-between">
        <Image
          src={order.product?.image}
          alt={order.product?.name}
          width={48}
          height={48}
          className="w-12 h-12 object-cover rounded-lg"
        />
        <span className="grow self-start grid">
          <span className="font-semibold">{order.product?.name}</span>
          <span>
            {`${Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              maximumSignificantDigits: 4,
            }).format(subtotal)} × ${order.quantity}`}
          </span>
        </span>
        <span className="font-semibold">
          {Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumSignificantDigits: 4,
          }).format(total)}
        </span>
      </div>
      {((order.variants?.length || 0) > 0 || order.notes) && (
        <div>
          <div className="p-2 grid rounded-lg bg-gray-200 dark:bg-zinc-800">
            {order.notes && (
              <span className="text-sm">
                <i>{`Note: ${order.notes}`}</i>
              </span>
            )}
            {order.variants?.map((variant, i) => (
              <span
                key={i}
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
        </div>
      )}
    </li>
  );
}
