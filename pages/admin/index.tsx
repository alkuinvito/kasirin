import * as Form from "@radix-ui/react-form";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import * as Select from "@radix-ui/react-select";
import styles from "@/styles/select.module.css";
import { FormEvent, useState } from "react";

export default function Page() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    fetch("/api/admin/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        email: email,
        role: role,
      }),
    })
      .then((res) => res.json())
      .then(console.log)
      .catch(setError);
  };

  return (
    <>
      <h1 className="font-semibold text-2xl">User Management</h1>
      <Form.Root className="FormRoot" onSubmit={handleSubmit}>
        <Form.Field className="FormField" name="email">
          <div className="flex align-baseline justify-between">
            <Form.Label className="FormLabel">Email</Form.Label>
          </div>
          <Form.Control id="email" asChild>
            <input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className="font-medium py-2 px-3 bg-gray-100 dark:bg-slate-900 rounded-lg"
              placeholder="new-user@gmail.com"
              type="email"
              required
            />
          </Form.Control>
        </Form.Field>

        <Form.Field className="FormField" name="role">
          <div className="flex align-baseline justify-between">
            <Form.Label className="FormLabel">Role</Form.Label>
          </div>
          <Form.Control id="role" asChild>
            <Select.Root value={role} onValueChange={setRole}>
              <Select.Trigger
                className={styles.SelectTrigger}
                aria-label="Role"
              >
                <Select.Value placeholder="Select a role" />
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
            Add user
          </button>
        </Form.Submit>
      </Form.Root>
    </>
  );
}
