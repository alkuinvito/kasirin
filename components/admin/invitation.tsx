"use client";

import React, { FormEvent, useRef, useState } from "react";
import axios from "axios";
import * as Form from "@radix-ui/react-form";
import * as Select from "@radix-ui/react-select";
import styles from "@/styles/select.module.css";
import { z } from "zod";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Cross1Icon,
} from "@radix-ui/react-icons";
import { ToastProvider, ToastViewport } from "@radix-ui/react-toast";
import { Toast } from "../shared/toast";
import InvitationList from "./invitationList";

export default function Invitation() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("employee");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [openErr, setOpenErr] = useState(false);

  const ref = useRef() as React.MutableRefObject<any>;

  const handleDelete = async (email: string, callback: Function) => {
    var options = {
      method: "PATCH",
      url: "/api/admin/users/invitation",
      data: { email: email },
    };

    axios
      .request(options)
      .then(() => {
        setSuccess("Invitation deleted successfully");
        setOpen(true);
        callback();
      })
      .catch((err) => {
        const result = z.string().safeParse(err.response.data.error);
        if (result.success) {
          setError(result.data);
          setOpenErr(true);
        }
      });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    var options = {
      method: "POST",
      url: "/api/admin/users/invitation",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: { email: email, role: role },
    };
    axios
      .request(options)
      .then(() => {
        setSuccess("Invitation added successfully");
        setOpen(true);
        ref.current.refresh();
      })
      .catch((err) => {
        const result = z.string().safeParse(err.response.data.error);
        if (result.success) {
          setError(result.data);
          setOpenErr(true);
          setEmail("");
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
        <button onClick={() => setOpen(false)}>
          <Cross1Icon />
        </button>
      </Toast>
      <Toast severity="success" content={success} open={open} setOpen={setOpen}>
        <button onClick={() => setOpen(false)}>
          <Cross1Icon />
        </button>
      </Toast>
      <h2 className="mt-8 font-semibold text-xl">Invitations</h2>
      <div className="mt-4 p-4 max-w-lg rounded-lg bg-gray-100 dark:bg-zinc-900">
        <InvitationList onDelete={handleDelete} ref={ref} />
      </div>
      <Form.Root
        className="FormRoot flex flex-wrap gap-2 mt-4 max-w-lg"
        onSubmit={handleSubmit}
      >
        <Form.Field className="FormField grow" name="email">
          <Form.Control asChild>
            <input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className="w-full py-2 px-3 bg-gray-100 dark:bg-zinc-900 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-800 focus:bg-gray-200 dark:focus:bg-zinc-800"
              placeholder="new.user@gmail.com"
              type="email"
              required
            />
          </Form.Control>
        </Form.Field>

        <Form.Field className="FormField" name="role">
          <Form.Control asChild>
            <Select.Root value={role} onValueChange={setRole}>
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
                    <Select.Item className={styles.SelectItem} value="manager">
                      <Select.ItemText>Manager</Select.ItemText>
                      <Select.ItemIndicator
                        className={styles.SelectItemIndicator}
                      >
                        <CheckIcon />
                      </Select.ItemIndicator>
                    </Select.Item>
                    <Select.Item className={styles.SelectItem} value="employee">
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
          </Form.Control>
        </Form.Field>

        <Form.Submit asChild>
          <button className="flex gap-3 items-center py-2 px-3 bg-green-600 hover:bg-green-800 rounded-lg text-white font-medium cursor-pointer">
            Invite
          </button>
        </Form.Submit>
      </Form.Root>
      <ToastViewport className="fixed bottom-0 right-0 flex flex-col gap-3 w-96 max-w-[100vw] m-0 z-50 outline-none p-6" />
    </ToastProvider>
  );
}
