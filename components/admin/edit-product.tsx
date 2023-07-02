import React, { ReactNode, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";
import { ToastProvider, ToastViewport } from "@radix-ui/react-toast";
import { Toast } from "../shared/toast";
import axios from "axios";
import z from "zod";
import FieldErrors from "../shared/fieldErrors";
import { productSchema } from "@/lib/schema";
import Image from "next/image";

export default function EditProduct({
  product,
  onUpdate,
  trigger,
}: {
  product: z.infer<typeof productSchema>;
  onUpdate: Function;
  trigger: ReactNode;
}) {
  const defaultErrors = {
    formErrors: [],
    fieldErrors: {
      id: [],
      image: [],
      name: [],
      price: [],
      stock: [],
      categoryId: [],
      variants: [],
    },
  };

  const [success, setSuccess] = useState("");
  const [formErrors, setFormErrors] = useState(defaultErrors);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [openErr, setOpenErr] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(product);

  const handleSubmit = async (id: string) => {
    setError("");
    setFormErrors(defaultErrors);

    const options = {
      method: "POST",
      url: `/api/products/${id}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: {
        image: currentProduct.image,
        name: currentProduct.name,
        price: currentProduct.price,
        stock: currentProduct.stock,
      },
    };
    axios
      .request(options)
      .then(() => {
        setSuccess("Product updated successfully");
        setOpen(true);
        onUpdate();
      })
      .catch((err) => {
        if (err.response.status === 400) {
          setFormErrors(err.response.data.error);
          console.log(formErrors);
        } else if (err.response.status === 403) {
          const result = z.string().safeParse(err.response.data.error);
          if (result.success) {
            setError(result.data);
            setOpenErr(true);
          }
        }
      });
  };

  return (
    <ToastProvider swipeDirection="right">
      <Toast
        severity="error"
        content={error}
        open={openErr}
        setOpen={setOpenErr}
      >
        <button onClick={() => setOpenErr(false)}>
          <Cross1Icon />
        </button>
      </Toast>
      <Toast severity="success" content={success} open={open} setOpen={setOpen}>
        <button onClick={() => setOpen(false)}>
          <Cross1Icon />
        </button>
      </Toast>
      <Dialog.Root>
        <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-black/60 w-screen h-screen fixed top-0" />
          <Dialog.Content className="bg-white dark:bg-zinc-800 rounded-lg p-5 shadow-sm fixed w-[512px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Dialog.Title className="DialogTitle pb-3 font-semibold text-lg">
              Edit Product
            </Dialog.Title>
            <Dialog.Description className="DialogDescription">
              Make changes to your product here. Click save when you&apos;re
              done.
            </Dialog.Description>
            <div className="flex justify-between gap-4 items-center">
              <section>
                <fieldset className="grid pt-2">
                  <FieldErrors errors={formErrors?.fieldErrors.image} />
                  <Image
                    className="w-full rounded-lg"
                    src={product.image}
                    alt={product.name}
                    width={136}
                    height={136}
                  ></Image>
                </fieldset>
              </section>
              <section className="grow">
                <fieldset className="grid pt-2">
                  <label htmlFor="name">Name</label>
                  <FieldErrors errors={formErrors?.fieldErrors.name} />
                  <input
                    type="text"
                    className="w-full py-2 px-3 bg-gray-100 dark:bg-zinc-900 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-950 focus:bg-gray-200 dark:focus:bg-zinc-950"
                    id="name"
                    value={currentProduct.name}
                    onChange={(e) => {
                      currentProduct.name = e.target.value;
                    }}
                    autoComplete={"off"}
                  />
                </fieldset>
                <fieldset className="grid pt-2">
                  <label htmlFor="price">Price</label>
                  <FieldErrors errors={formErrors?.fieldErrors.price} />
                  <input
                    type="number"
                    className="w-full py-2 px-3 bg-gray-100 dark:bg-zinc-900 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-950 focus:bg-gray-200 dark:focus:bg-zinc-950"
                    id="price"
                    value={currentProduct.price}
                    onChange={(e) => {
                      currentProduct.price = parseInt(e.target.value);
                    }}
                  />
                </fieldset>
                <fieldset className="grid pt-2">
                  <label htmlFor="stock">Stock</label>
                  <FieldErrors errors={formErrors?.fieldErrors.stock} />
                  <input
                    className="w-full py-2 px-3 bg-gray-100 dark:bg-zinc-900 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-950 focus:bg-gray-200 dark:focus:bg-zinc-950"
                    id="stock"
                    value={currentProduct.stock}
                    onChange={(e) => {
                      currentProduct.stock = parseInt(e.target.value);
                    }}
                  />
                </fieldset>
              </section>
            </div>
            <div className="flex justify-between pt-5">
              <Dialog.Close asChild>
                <button className="p-2 text-red-600 rounded-lg cursor-pointer">
                  Delete Product
                </button>
              </Dialog.Close>
              <button
                onClick={() => {}}
                className=" py-2 px-3 bg-green-600 hover:bg-green-800 rounded-lg text-white font-medium cursor-pointer"
              >
                Save changes
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <ToastViewport className="fixed bottom-0 right-0 flex flex-col gap-3 w-96 max-w-[100vw] m-0 z-50 outline-none p-6" />
    </ToastProvider>
  );
}
