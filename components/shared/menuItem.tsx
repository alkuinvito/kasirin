import Image from "next/image";
import z from "zod";
import { productSchema } from "@/lib/schema";

export default function MenuItem({
  product,
}: {
  product: z.infer<typeof productSchema>;
}) {
  return (
    <div className="flex flex-col rounded-lg" key={product.id}>
      <Image
        className="w-full rounded-lg"
        src={product.image}
        alt={product.name}
        width={100}
        height={100}
      ></Image>
      <div className="grid pt-2">
        <span className="font-semibold">{product.name}</span>
        <span className="text-sm">{product.price}</span>
      </div>
    </div>
  );
}
