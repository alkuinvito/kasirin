import { ReactNode } from "react";
import SideBar from "./sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <SideBar />
      <main className="pt-10 ml-80 md:px-6">
        <section className="max-w-7xl mx-auto">{children}</section>
      </main>
    </div>
  );
}
