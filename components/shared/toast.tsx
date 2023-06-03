"use client";

import * as ToastPrimitive from "@radix-ui/react-toast";
import { ReactNode } from "react";

export const Toast = ({
  title,
  content,
  children,
  ...props
}: {
  title: string;
  content: string;
  children: ReactNode;
}) => {
  return (
    <ToastPrimitive.Root {...props}>
      {title && <ToastPrimitive.Title>{title}</ToastPrimitive.Title>}
      <ToastPrimitive.Description>{content}</ToastPrimitive.Description>
      {children && (
        <ToastPrimitive.Action altText="" asChild>
          {children}
        </ToastPrimitive.Action>
      )}
      <ToastPrimitive.Close aria-label="Close">
        <span aria-hidden>×</span>
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
  );
};
