import { ReactNode } from "react";
import SideBar from "./sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex justify-center">
      <SideBar />
      <section className="grow">
        <div className="max-w-[1520px] mx-auto mt-10">{children}</div>
      </section>
    </main>
  );
}
