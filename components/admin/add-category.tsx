import React, { ReactNode, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";
import { ToastProvider, ToastViewport } from "@radix-ui/react-toast";
import { Toast } from "../shared/toast";
import axios from "axios";
import z from "zod";
import FieldErrors from "../shared/fieldErrors";

export default function AddCategory({
  onUpdate,
  children,
}: {
  onUpdate: Function;
  children: ReactNode;
}) {
  const defaultErrors = {
    name: [],
  };

  const [success, setSuccess] = useState("");
  const [formErrors, setFormErrors] = useState(defaultErrors);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [openErr, setOpenErr] = useState(false);
  const [currentName, setName] = useState("");

  const handleSubmit = async () => {
    setError("");
    setFormErrors(defaultErrors);

    const options = {
      method: "POST",
      url: `/api/categories`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: {
        name: currentName,
      },
    };
    axios
      .request(options)
      .then(() => {
        setSuccess("Category added successfully");
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
        <Dialog.Trigger asChild>{children}</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-black/60 w-screen h-screen fixed top-0" />
          <Dialog.Content className="bg-white dark:bg-zinc-800 rounded-lg p-5 shadow-sm fixed w-[512px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Dialog.Title className="DialogTitle pb-3 text-lg font-semibold">
              Create new category
            </Dialog.Title>
            <div className="flex justify-between gap-4 items-center">
              <section className="grow">
                <fieldset className="grid pt-2">
                  <label htmlFor="name">Name</label>
                  <FieldErrors errors={formErrors?.name} />
                  <input
                    className="outline-none w-full py-2 px-3 bg-gray-100 dark:bg-zinc-900 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-950 focus:bg-gray-200 dark:focus:bg-zinc-950"
                    id="name"
                    value={currentName}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    autoComplete={"off"}
                  />
                </fieldset>
              </section>
            </div>
            <div className="flex justify-end pt-5">
              <button
                onClick={handleSubmit}
                className="py-2 px-3 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 rounded-lg text-white font-medium cursor-pointer transition-colors"
              >
                Create category
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <ToastViewport className="fixed bottom-0 right-0 flex flex-col gap-3 w-96 max-w-[100vw] m-0 z-50 outline-none p-6" />
    </ToastProvider>
  );
}
