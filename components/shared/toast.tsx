"use client";

import * as ToastPrimitive from "@radix-ui/react-toast";
import { Dispatch, SetStateAction, ReactNode } from "react";
import styles from "@/styles/toast.module.css";
import { Cross1Icon } from "@radix-ui/react-icons";

type ToastProps = {
  title: string;
  content: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  className?: string;
  children: ReactNode;
};

export const Toast = ({
  title,
  content,
  open,
  setOpen,
  className,
  children,
  ...props
}: ToastProps) => {
  return (
    <ToastPrimitive.Root
      className={styles.ToastRoot + " " + className}
      open={open}
      onOpenChange={setOpen}
      {...props}
    >
      {title && (
        <ToastPrimitive.Title className={styles.ToastTitle}>
          {title}
        </ToastPrimitive.Title>
      )}
      <ToastPrimitive.Description className={styles.ToastDescription}>
        {content}
      </ToastPrimitive.Description>
      {children && (
        <ToastPrimitive.Action
          className={styles.ToastAction}
          altText={title}
          asChild
        >
          {children}
        </ToastPrimitive.Action>
      )}
      <ToastPrimitive.Close aria-label="Close" className="cursor-pointer">
        <Cross1Icon aria-hidden />
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
  );
};
