import Header from "@/components/shared/header";
import type { AppProps } from "next/app";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import "@/styles/globals.css";
import "@/styles/header.css";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  const [menuQuery, setMenuQuery] = useState("");

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <Header onQuery={setMenuQuery} />
        <main className="mt-20 max-w-7xl mx-auto">
          <Component query={menuQuery} {...pageProps} />
        </main>
      </SessionProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default MyApp;
