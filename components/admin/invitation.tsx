"use client";

import { FormEvent, useState, useEffect } from "react";
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
import { InvitationModelSchema, InvitationModel } from "@/lib/schema";
import { ToastProvider, ToastViewport } from "@radix-ui/react-toast";
import { Toast } from "../shared/toast";

const getInvitations = async () => {
  const { data } = await axios.get("/api/admin/users/invitation", {
    withCredentials: true,
  });
  return z.array(InvitationModelSchema).parse(data.invitations);
};

const renderInvitations = (invitations: InvitationModel[]): JSX.Element => {
  if (invitations.length === 0) {
    return (
      <>
        <table className="w-full text-left">
          <tr className="border-y border-gray-300 dark:border-slate-700">
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2"></th>
          </tr>
        </table>
        <span className="mt-2 block text-center">No invitation to show</span>
      </>
    );
  }
  return (
    <table className="w-full text-left">
      <tr className="border-y border-gray-300 dark:border-slate-700">
        <th className="p-2">Email</th>
        <th className="p-2">Role</th>
        <th className="p-2"></th>
      </tr>
      {invitations.map((invitation) => (
        <tr
          key={invitation.id}
          className="border-y border-gray-300 dark:border-slate-700"
        >
          <td className="p-2">{invitation.email}</td>
          <td className="p-2">{invitation.role}</td>
          <td className="p-2">
            <button>Delete</button>
          </td>
        </tr>
      ))}
    </table>
  );
};

export default function Invitation() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [invitations, setInvitations] = useState(<></>);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getInvitations().then((res) => {
      setInvitations(renderInvitations(res));
    });
  }, []);

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
        getInvitations().then((res) => {
          setInvitations(renderInvitations(res));
        });
      })
      .catch((err) => {
        const result = z.string().safeParse(err.response.data.error);
        if (result.success) {
          setError(result.data);
          setOpen(true);
        }
      });
  };

  return (
    <ToastProvider swipeDirection="right">
      <Toast
        className="bg-red-800"
        title="Failed to create invitation"
        content={error}
        open={open}
        setOpen={setOpen}
      >
        <button onClick={() => setOpen(false)}>
          <Cross1Icon />
        </button>
      </Toast>
      <h2 className="mt-8 font-semibold text-xl">Invitations</h2>
      <div className="mt-4 p-4 max-w-lg rounded-lg bg-gray-100 dark:bg-slate-900">
        {invitations}
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
              className="w-full py-2 px-3 bg-gray-100 dark:bg-slate-900 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-800 focus:bg-gray-200 dark:focus:bg-slate-800"
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
                    <Select.Item className={styles.SelectItem} value="admin">
                      <Select.ItemText>Admin</Select.ItemText>
                      <Select.ItemIndicator
                        className={styles.SelectItemIndicator}
                      >
                        <CheckIcon />
                      </Select.ItemIndicator>
                    </Select.Item>
                    <Select.Item className={styles.SelectItem} value="user">
                      <Select.ItemText>User</Select.ItemText>
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
