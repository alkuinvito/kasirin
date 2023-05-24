import { SessionProvider } from "next-auth/react";
import "./globals.css";
import Header from "@/components/layout/header";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { Session } from "next-auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "KasirIn",
  description:
    "KasirIn is a Point-of-Sale web application that focus on modular features",
};

export default function RootLayout({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session;
}) {
  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={inter.className}>
          <Suspense fallback="...">
            <Header />
          </Suspense>
          <main className="mt-14">{children}</main>
        </body>
      </html>
    </SessionProvider>
  );
}
