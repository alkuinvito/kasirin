import Image from "next/image";
import z from "zod";
import { productSchema } from "@/lib/schema";
import * as Switch from "@radix-ui/react-switch";

export default function MenuItem({
  product,
}: {
  product: z.infer<typeof productSchema>;
}) {
  return (
    <div className="flex flex-col rounded-lg" key={product.id}>
      <Image
        className="w-full h-28 rounded-lg object-cover"
        src={product.image}
        alt={product.name}
        width={100}
        height={100}
      ></Image>
      <div className="grid pt-2">
        <span className="">{product.name}</span>
        <span className="text-lg font-semibold">
          {Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumSignificantDigits: 3,
          }).format(product.price)}
        </span>
      </div>
    </div>
  );
}
