import "./globals.css";
import Header from "@/components/layout/header";
import { Inter } from "next/font/google";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "KasirIn",
  description:
    "KasirIn is a Point-of-Sale web application that focus on modular features",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Suspense fallback="...">
          <Header />
        </Suspense>
        <main className="mt-14">{children}</main>
      </body>
    </html>
  );
}
