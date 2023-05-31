import Header from "@/components/shared/header";
import type { AppProps } from "next/app";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import "@/styles/globals.css";
import "@/styles/header.css";
import "@/styles/menuList.css";

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  return (
    <SessionProvider session={session}>
      <Header />
      <main className="mt-20 max-w-7xl mx-auto">
        <Component {...pageProps} />
      </main>
    </SessionProvider>
  );
}

export default MyApp;
