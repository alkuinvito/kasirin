"use client";

import * as ToastPrimitive from "@radix-ui/react-toast";
import { Dispatch, SetStateAction, ReactNode } from "react";
import styles from "@/styles/toast.module.css";
import { Severity } from "@/lib/schema";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

type ToastProps = {
  severity: Severity;
  content: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  className?: string;
  children: ReactNode;
};

export const Toast = ({
  severity,
  content,
  open,
  setOpen,
  className,
  children,
  ...props
}: ToastProps) => {
  switch (severity) {
    case Severity.enum.success:
      return (
        <ToastPrimitive.Root
          className={
            styles.ToastRoot +
            " text-white bg-green-500 dark:bg-green-700 " +
            className
          }
          open={open}
          onOpenChange={setOpen}
          {...props}
        >
          <ToastPrimitive.Description className={styles.ToastDescription}>
            <FontAwesomeIcon icon={faCircleCheck} className="mr-2" />
            {content}
          </ToastPrimitive.Description>
          {children && (
            <ToastPrimitive.Action
              className={styles.ToastAction}
              altText="Close"
              asChild
            >
              {children}
            </ToastPrimitive.Action>
          )}
        </ToastPrimitive.Root>
      );
    case Severity.enum.error:
      return (
        <ToastPrimitive.Root
          className={
            styles.ToastRoot +
            " text-white bg-red-500 dark:bg-red-700 " +
            className
          }
          open={open}
          onOpenChange={setOpen}
          {...props}
        >
          <ToastPrimitive.Description className={styles.ToastDescription}>
            <FontAwesomeIcon icon={faTriangleExclamation} className="mr-2" />
            {content}
          </ToastPrimitive.Description>
          {children && (
            <ToastPrimitive.Action
              className={styles.ToastAction}
              altText="Close"
              asChild
            >
              {children}
            </ToastPrimitive.Action>
          )}
        </ToastPrimitive.Root>
      );
    default:
      return (
        <ToastPrimitive.Root
          className={
            styles.ToastRoot +
            " text-white bg-green-500 dark:bg-green-700 " +
            className
          }
          open={open}
          onOpenChange={setOpen}
          {...props}
        >
          <ToastPrimitive.Description className={styles.ToastDescription}>
            <FontAwesomeIcon icon={faCircleCheck} className="mr-2" />
            {content}
          </ToastPrimitive.Description>
          {children && (
            <ToastPrimitive.Action
              className={styles.ToastAction}
              altText="Close"
              asChild
            >
              {children}
            </ToastPrimitive.Action>
          )}
        </ToastPrimitive.Root>
      );
  }
};
