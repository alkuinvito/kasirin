import { ReactNode } from "react";
import Head from "next/head";
import SideBar from "./sidebar";

export default function AdminLayout({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) {
  return (
    <div>
      <Head>
        <title>{title && `${title} - `}Kasirin Admin</title>
      </Head>
      <SideBar />
      <main className="pt-10 ml-72 md:px-6">
        <section className="max-w-6xl mx-auto">{children}</section>
      </main>
    </div>
  );
}
