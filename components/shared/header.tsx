"use client";

import React from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Hamburger from "./hamburger";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import * as Popover from "@radix-ui/react-popover";
import { ExitIcon, PersonIcon } from "@radix-ui/react-icons";
import { signOut } from "next-auth/react";
import { Role } from "@/lib/schema";
import Link from "next/link";
import { Session } from "next-auth";

function AdminBadge(props: { session: Session }) {
  if (
    props.session?.user?.role === Role.enum.owner ||
    props.session?.user?.role === Role.enum.manager
  ) {
    return (
      <Link
        href="/admin"
        className="rounded-lg px-2 py-1 mr-4 text-sm border-solid border border-indigo-700 text-indigo-700 hover:bg-indigo-700 hover:text-white transition-colors"
      >
        Admin
      </Link>
    );
  }
  return null;
}

export default function Header() {
  const { data: session } = useSession();
  return (
    <div className="z-30 shadow-lg backdrop-blur-md fixed top-0 w-full py-2 bg-white/50 dark:bg-slate-950/50">
      <div className="wrapper max-w-7xl w-full h-full flex justify-between items-center mx-auto">
        <Hamburger />
        <h1 className="bg-clip-text text-transparent bg-gradient-to-tr from-indigo-700 to-pink-400 font-bold text-3xl">
          KasirIn
        </h1>

        {session?.user ? (
          <>
            <nav className="flex gap-4 grow items-start justify-end mr-4">
              <Link href="/" className="hover:text-indigo-700">
                Dashboard
              </Link>
              <Link href="/transaction" className="hover:text-indigo-700">
                Transaction
              </Link>
            </nav>

            <AdminBadge session={session} />

            <Popover.Root>
              <Popover.Trigger asChild>
                <button
                  className="IconButton bg-gray-300 dark:bg-gray-900"
                  aria-label="Profile"
                >
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
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  className="PopoverContent bg-white dark:bg-slate-800 shadow-lg"
                  sideOffset={10}
                  align="end"
                  side="top"
                >
                  <div className="flex flex-col gap-4">
                    {session?.user?.name ? (
                      <div className="flex">
                        <h3 className="grow font-semibold">
                          {session?.user?.name}
                        </h3>
                        <button
                          onClick={() => signOut()}
                          className="text-red-800 cursor-pointer"
                        >
                          <ExitIcon />
                        </button>
                      </div>
                    ) : null}
                  </div>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </>
        ) : null}
      </div>
    </div>
  );
}
