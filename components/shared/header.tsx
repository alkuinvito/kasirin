"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import Image from "next/image";
import Hamburger from "./hamburger";
import * as Popover from "@radix-ui/react-popover";
import { ExitIcon } from "@radix-ui/react-icons";
import { signOut } from "next-auth/react";
import { Role } from "@/lib/schema";
import Link from "next/link";
import { useRouter } from "next/router";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

function HomeNav(props: { pathname: String }) {
  if (props.pathname === "/") {
    return (
      <>
        <Link
          href="/"
          className="text-indigo-700 transition-colors font-semibold"
        >
          Dashboard
        </Link>
        <Link
          href="/transaction"
          className="hover:text-indigo-700 transition-colors"
        >
          Transaction
        </Link>
      </>
    );
  } else if (props.pathname === "/transaction") {
    return (
      <>
        <Link href="/" className="hover:text-indigo-700 transition-colors">
          Dashboard
        </Link>
        <Link
          href="/transaction"
          className="text-indigo-700 transition-colors font-semibold"
        >
          Transaction
        </Link>
      </>
    );
  }
  return null;
}

export default function Header({ children }: { children?: React.ReactNode }) {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="z-30 shadow-lg backdrop-blur-md fixed top-0 w-full py-2 bg-white/50 dark:bg-slate-950/50">
      <div className="wrapper max-w-7xl w-full h-full flex justify-between items-center mx-auto">
        <Hamburger />
        <Link href="/">
          <h1 className="bg-clip-text text-transparent bg-gradient-to-tr from-indigo-700 to-pink-400 font-bold text-3xl">
            KasirIn
          </h1>
        </Link>

        {children}

        {session?.user ? (
          <>
            <nav className="hidden md:flex lg:flex grow gap-4 items-start justify-end mr-4">
              <HomeNav pathname={router.pathname} />
            </nav>

            <AdminBadge session={session} />

            <Popover.Root>
              <Popover.Trigger asChild>
                <button
                  className="IconButton bg-gray-300 dark:bg-zinc-900"
                  aria-label="Profile"
                >
                  {session?.user?.image ? (
                    <Image
                      src={session?.user?.image}
                      width={36}
                      height={36}
                      alt="user profile"
                      className="w-[36px] h-[36px] rounded-full object-cover"
                    ></Image>
                  ) : (
                    <FontAwesomeIcon
                      icon={faCircleUser}
                      className="w-[36px] h-[36px]"
                    />
                  )}
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  className="PopoverContent bg-white dark:bg-zinc-800 shadow-lg"
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
