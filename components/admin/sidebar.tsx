"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { faUser, faBoxesStacked } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SideBar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [inputs, setInputs] = useState("");

  function AdminNav(props: { pathname: string; className?: string }) {
    if (props.pathname === "/admin") {
      return (
        <nav className={props.className}>
          <Link
            href="/admin"
            className="text-indigo-700 transition-colors font-semibold flex items-center gap-2"
          >
            <div className="flex justify-center w-6">
              <FontAwesomeIcon icon={faUser} className="text-xl" />
            </div>
            <span>User Management</span>
          </Link>
          <Link
            href="/admin/products"
            className="hover:text-indigo-700 transition-colors flex items-center gap-2"
          >
            <div className="flex justify-center w-6">
              <FontAwesomeIcon icon={faBoxesStacked} className="text-xl" />
            </div>
            Products
          </Link>
        </nav>
      );
    } else if (props.pathname === "/admin/products") {
      return (
        <nav className={props.className}>
          <Link
            href="/admin"
            className="hover:text-indigo-700 transition-colors flex items-center gap-2"
          >
            <div className="flex justify-center w-6">
              <FontAwesomeIcon icon={faUser} className="text-xl" />
            </div>
            <span>User Management</span>
          </Link>
          <Link
            href="/admin/products"
            className="text-indigo-700 transition-colors font-semibold flex items-center gap-2"
          >
            <div className="flex justify-center w-6">
              <FontAwesomeIcon icon={faBoxesStacked} className="text-xl" />
            </div>
            Products
          </Link>
        </nav>
      );
    }
    return null;
  }

  return (
    <aside className="flex flex-col w-96 h-screen p-4 bg-indigo-900">
      <div>
        <Link href="/">
          <h1 className="bg-clip-text text-transparent bg-gradient-to-tr from-indigo-700 to-pink-400 font-bold text-3xl">
            KasirIn
          </h1>
        </Link>
        <h2 className="text-lg">Admin</h2>
        <AdminNav
          className="flex flex-col pt-10 text-xl"
          pathname={router.pathname}
        />
      </div>
    </aside>
  );
}
