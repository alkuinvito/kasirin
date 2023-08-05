import React, { ReactNode, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import z from "zod";
import { OrderModelSchema, productSchema } from "@/lib/schema";
import { useForm } from "react-hook-form";
import Image from "next/image";

const Product = productSchema.deepPartial().optional();
type Product = z.infer<typeof Product>;

export default function AddOrder({
  product,
  onUpdate,
  children,
}: {
  product: Product;
  onUpdate: Function;
  children: ReactNode;
}) {
  const { register, handleSubmit } = useForm();
  const [order, setOrder] = useState(
    OrderModelSchema.deepPartial().parse({
      productId: product?.id,
      quantity: 1,
      variants: [],
    })
  );
  const [open, setOpen] = useState(false);
  const variant = new Map();

  const handleVariantChange = (variantId: string, itemId: string) => {
    if (itemId) {
      variant.set(variantId, itemId);
    } else {
      variant.delete(variantId);
    }
  };

  const handleUpdate = () => {
    const variantsArr = Array.from(variant.values());
    const variantsObj = variantsArr.map((val) => ({ id: val }));

    onUpdate({ ...order, variants: variantsObj });
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/60 w-screen h-screen fixed top-0" />
        <Dialog.Content className="bg-white dark:bg-zinc-800 rounded-lg p-5 shadow-sm fixed w-[640px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Dialog.Title className="DialogTitle pb-3 text-lg font-semibold">
            Add New Order
          </Dialog.Title>
          <form onSubmit={handleSubmit(handleUpdate)}>
            <div className="flex gap-4">
              <div>
                <Image
                  src={product?.image || ""}
                  alt={product?.name || ""}
                  width={240}
                  height={240}
                  className="w-[240px] h-auto max-h-[240px] object-cover"
                />
                <fieldset className="grid mt-2">
                  <label htmlFor="note">Note</label>
                  <textarea
                    {...register("note")}
                    id="note"
                    className="resize-none h-16 p-2 bg-gray-100 dark:bg-zinc-900 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-950 focus:bg-gray-200 dark:focus:bg-zinc-950"
                    onInput={(e) =>
                      setOrder((prev) => ({
                        ...prev,
                        notes: (e.target as HTMLInputElement).value,
                      }))
                    }
                  />
                </fieldset>
              </div>
              <div className="grow">
                <div className="mb-4">
                  <h2 className="text-xl font-bold">{product?.name}</h2>
                  <h2 className="text-lg">
                    {product?.price &&
                      Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        maximumSignificantDigits: 3,
                      }).format(product.price)}
                  </h2>
                  <span>
                    <i>Stock: {product?.stock}</i>
                  </span>
                </div>
                <fieldset className="mb-2">
                  <label htmlFor="stock">
                    Qty<span className="text-red-600">&nbsp;*</span>
                  </label>
                  <input
                    {...(register("stock"),
                    { required: true, min: 1, max: product?.stock })}
                    type="number"
                    className="w-full py-2 px-3 bg-gray-100 dark:bg-zinc-900 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-950 focus:bg-gray-200 dark:focus:bg-zinc-950"
                    id="stock"
                    value={order.quantity || 1}
                    min={1}
                    max={product?.stock || 32}
                    onChange={(e) => {
                      setOrder((prev) => ({
                        ...prev,
                        quantity: parseInt(e.target.value),
                      }));
                    }}
                    required={true}
                  />
                </fieldset>
                {product?.variants && (
                  <>
                    {product.variants.map((variant, i) => (
                      <fieldset key={i} className="mb-2">
                        <label htmlFor={variant.id}>
                          {variant.name}
                          {variant.required && (
                            <span className="text-red-600">&nbsp;*</span>
                          )}
                        </label>
                        <select
                          {...(register(variant.id || ""),
                          { required: variant.required })}
                          id={variant.id}
                          className="w-full py-2 px-3 bg-gray-100 dark:bg-zinc-900 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-950 focus:bg-gray-200 dark:focus:bg-zinc-950 appearance-none"
                          required={variant.required}
                          onChange={(e) =>
                            handleVariantChange(
                              variant.id as string,
                              e.target.value
                            )
                          }
                        >
                          <option value="">-</option>
                          {variant.items?.map((item) => (
                            <option key={item.id} value={item.id}>
                              {`${item.name} - ${item.price}`}
                            </option>
                          ))}
                        </select>
                      </fieldset>
                    ))}
                  </>
                )}
              </div>
            </div>
            <div className="w-full mt-2 flex justify-end">
              <input
                type="submit"
                value="Add"
                className="py-2 px-3 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 rounded-lg text-white font-medium cursor-pointer transition-colors"
              />
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
