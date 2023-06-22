import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return <div className="mt-20 max-w-7xl mx-auto">{children}</div>;
}
