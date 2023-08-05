import Head from "next/head";
import Header from "./header";

export default function MainLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <>
      <Head>
        <title>{title && `${title} - `}Kasirin</title>
      </Head>
      <main>
        <Header />
        <section className="mt-20 max-w-7xl mx-auto">{children}</section>
      </main>
    </>
  );
}
