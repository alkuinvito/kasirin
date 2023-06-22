import { ReactNode } from "react";
import SideBar from "./sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <main className=" max-w-[1280px] mx-auto min-w-full">
      <div className="flex justify-center">
        <SideBar />
        <section className="w-full">{children}</section>
      </div>
    </main>
  );
}
