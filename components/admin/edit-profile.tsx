import { Role, profileSchema } from "@/lib/schema";
import React, { ReactNode, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Select from "@radix-ui/react-select";
import styles from "@/styles/select.module.css";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Cross1Icon,
} from "@radix-ui/react-icons";
import { ToastProvider, ToastViewport } from "@radix-ui/react-toast";
import { Toast } from "../shared/toast";
import axios from "axios";
import z from "zod";
import FieldErrors from "../shared/fieldErrors";

export default function EditProfile({
  email,
  fullname,
  role,
  trigger,
  onUpdate,
}: {
  email: string;
  fullname: string;
  role: Role;
  trigger: ReactNode;
  onUpdate: Function;
}) {
  const defaultErrors = {
    formErrors: [],
    fieldErrors: {
      fullname: [],
      email: [],
      role: [],
    },
  };

  const [success, setSuccess] = useState("");
  const [formErrors, setFormErrors] = useState(defaultErrors);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [openErr, setOpenErr] = useState(false);
  const [currentFullname, setFullname] = useState(fullname);
  const [currentRole, setRole] = useState(role.toString());

  const handleSubmit = async () => {
    setError("");
    setFormErrors(defaultErrors);

    const options = {
      method: "POST",
      url: "/api/admin/users",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: { fullname: currentFullname, email: email, role: currentRole },
    };
    axios
      .request(options)
      .then(() => {
        setSuccess("Account updated successfully");
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
        className="text-white bg-red-500 dark:bg-red-800"
        title="Failed to update invitation"
        content={error}
        open={openErr}
        setOpen={setOpenErr}
      >
        <button onClick={() => setOpenErr(false)}>
          <Cross1Icon />
        </button>
      </Toast>
      <Toast
        className="text-white bg-green-500 dark:bg-green-800"
        title="Updated succesfully"
        content={success}
        open={open}
        setOpen={setOpen}
      >
        <button onClick={() => setOpen(false)}>
          <Cross1Icon />
        </button>
      </Toast>
      <Dialog.Root>
        <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-black/60 w-screen h-screen fixed top-0 z-40" />
          <Dialog.Content className="bg-white dark:bg-slate-950 rounded-lg p-5 shadow-sm fixed w-96 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
            <Dialog.Title className="DialogTitle pb-3">
              Edit profile
            </Dialog.Title>
            <Dialog.Description className="DialogDescription">
              Make changes to your profile here. Click save when you&apos;re
              done.
            </Dialog.Description>
            <fieldset className="grid pt-2">
              <label htmlFor="name">Fullname</label>
              <FieldErrors errors={formErrors?.fieldErrors.fullname} />
              <input
                className="w-full py-2 px-3 bg-gray-100 dark:bg-slate-900 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-800 focus:bg-gray-200 dark:focus:bg-slate-800"
                id="name"
                defaultValue={currentFullname}
                onChange={(e) => {
                  setFullname(e.target.value);
                }}
                autoComplete={"off"}
              />
            </fieldset>
            <fieldset className="grid pt-2">
              <label htmlFor="email">Email</label>
              <FieldErrors errors={formErrors?.fieldErrors.email} />
              <input
                className="w-full py-2 px-3 bg-gray-100 dark:bg-slate-900 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-800 focus:bg-gray-200 dark:focus:bg-slate-800"
                id="email"
                defaultValue={email}
                readOnly={true}
              />
            </fieldset>
            <fieldset className="grid pt-2">
              <label htmlFor="role">Role</label>
              <FieldErrors errors={formErrors?.fieldErrors.role} />

              <Select.Root value={currentRole} onValueChange={setRole}>
                <Select.Trigger
                  className={styles.SelectTrigger}
                  aria-label="Role"
                >
                  <Select.Value className={styles.SelectValue} />
                  <Select.Icon className={styles.SelectIcon}>
                    <ChevronDownIcon />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className={styles.SelectContent}>
                    <Select.ScrollUpButton
                      className={styles.SelectScrollUpButton}
                    >
                      <ChevronUpIcon />
                    </Select.ScrollUpButton>
                    <Select.Viewport className={styles.SelectViewport}>
                      <Select.Item className={styles.SelectItem} value="owner">
                        <Select.ItemText>Owner</Select.ItemText>
                        <Select.ItemIndicator
                          className={styles.SelectItemIndicator}
                        >
                          <CheckIcon />
                        </Select.ItemIndicator>
                      </Select.Item>
                      <Select.Item
                        className={styles.SelectItem}
                        value="manager"
                      >
                        <Select.ItemText>Manager</Select.ItemText>
                        <Select.ItemIndicator
                          className={styles.SelectItemIndicator}
                        >
                          <CheckIcon />
                        </Select.ItemIndicator>
                      </Select.Item>
                      <Select.Item
                        className={styles.SelectItem}
                        value="employee"
                      >
                        <Select.ItemText>Employee</Select.ItemText>
                        <Select.ItemIndicator
                          className={styles.SelectItemIndicator}
                        >
                          <CheckIcon />
                        </Select.ItemIndicator>
                      </Select.Item>
                    </Select.Viewport>
                    <Select.ScrollDownButton />
                    <Select.Arrow />
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </fieldset>
            <div className="flex justify-between pt-5">
              <Dialog.Close asChild>
                <button className="p-2 text-red-600 rounded-lg cursor-pointer">
                  Delete account
                </button>
              </Dialog.Close>
              <button
                onClick={() => {
                  handleSubmit();
                }}
                className="py-2 px-3 bg-green-600 hover:bg-green-800 rounded-lg text-white font-medium cursor-pointer"
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
