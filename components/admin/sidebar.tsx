"use client";

import React from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  faUser,
  faBoxesStacked,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { PersonIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import NavItem from "./navItem";
import { signOut } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SideBar() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <aside className="fixed left-o flex flex-col w-80 h-screen px-4 border-r border-gray-200 dark:border-zinc-800">
      <section className="py-8">
        <Link href="/">
          <h1 className="bg-clip-text text-transparent bg-gradient-to-tr from-indigo-700 to-pink-400 font-bold text-4xl text-center">
            KasirIn
          </h1>
        </Link>
      </section>
      <section className="grow">
        <nav className="flex flex-col gap-3">
          <NavItem
            icon={faUser}
            title="User Management"
            href="/admin"
            active={router.pathname === "/admin"}
          />
          <NavItem
            icon={faBoxesStacked}
            title="Products"
            href="/admin/products"
            active={router.pathname === "/admin/products"}
          />
        </nav>
      </section>
      <section className="py-6 flex gap-4 items-center">
        {session?.user?.image ? (
          <Image
            src={session?.user?.image}
            width={36}
            height={36}
            alt="user profile"
            className="rounded-full"
          ></Image>
        ) : (
          <PersonIcon />
        )}
        <span className="grow font-medium">{session?.user?.name}</span>
        <button
          onClick={() => signOut()}
          className="text-red-700 dark:text-red-800 cursor-pointer text-lg"
        >
          <FontAwesomeIcon icon={faArrowRightFromBracket} />
        </button>
      </section>
    </aside>
  );
}
