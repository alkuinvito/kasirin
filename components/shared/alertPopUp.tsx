import React from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

export default function AlertPopUp({
  title,
  description,
  action,
  onAccept,
  variant = "green",
  children,
}: {
  title: string;
  description?: string;
  action: string;
  onAccept: Function;
  variant?: "red" | "green" | undefined;
  children: React.ReactNode;
}) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>{children}</AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="bg-black/40 w-screen h-screen fixed top-0" />
        <AlertDialog.Content className="bg-white dark:bg-zinc-800 rounded-lg p-5 shadow-sm fixed w-[480px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <AlertDialog.Title className="pb-3 font-medium">
            {title}
          </AlertDialog.Title>
          {description && (
            <AlertDialog.Description className="mb-8">
              {description}
            </AlertDialog.Description>
          )}
          <div style={{ display: "flex", gap: 25, justifyContent: "flex-end" }}>
            <AlertDialog.Cancel asChild>
              <button className="py-2 px-3 hover:bg-gray-100 dark:hover:bg-zinc-700/20 rounded-lg font-medium cursor-pointer transition-colors">
                Cancel
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                className={
                  variant === "green"
                    ? "py-2 px-3 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 rounded-lg text-white font-medium cursor-pointer transition-colors"
                    : "py-2 px-3 bg-red-600 hover:bg-red-700 dark:bg-red-800 dark:hover:bg-red-900 rounded-lg text-white font-medium cursor-pointer transition-colors"
                }
                onClick={() => onAccept()}
              >
                {action}
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
