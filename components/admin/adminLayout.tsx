import { ReactNode } from "react";
import SideBar from "./sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <SideBar />
      <main className="pt-10 ml-72 md:px-6">
        <section className="max-w-6xl mx-auto">{children}</section>
      </main>
    </div>
  );
}
