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

export default function Header() {
  const { data: session } = useSession();
  return (
    <div className="z-30 shadow-lg backdrop-blur-md fixed top-0 w-full py-2 bg-white/50 dark:bg-slate-950/50">
      <div className="wrapper max-w-7xl w-full h-full flex justify-between items-center mx-auto">
        <Hamburger />
        <h1 className="bg-clip-text text-transparent bg-gradient-to-tr from-indigo-700 to-pink-400 font-semibold text-3xl">
          KasirIn
        </h1>

        <NavigationMenu.Root className="hidden sm:flex mx-auto p-[3px] justify-around rounded-lg bg-gray-400/10">
          <NavigationMenu.List className="NavigationMenuList py-2 px-8 outline-none select-none font-medium leading-none rounded text-lg flex items-center justify-between gap-[2px] data-[highlighted]:bg-gray-600/10 data-[state=open]:bg-gray-600/10">
            <NavigationMenu.Item>
              <NavigationMenu.Link
                className="NavigationMenuLink"
                href={process.env.NEXTAUTH_URL}
              >
                Dashboard
              </NavigationMenu.Link>
            </NavigationMenu.Item>

            <NavigationMenu.Item>
              <NavigationMenu.Link
                className="NavigationMenuLink"
                href={process.env.NEXTAUTH_URL + "/transaction"}
              >
                Transaction
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          </NavigationMenu.List>
        </NavigationMenu.Root>

        {session?.user?.role === Role.enum.owner ||
        session?.user?.role === Role.enum.manager ? (
          <Link
            href="/admin"
            className="rounded-lg px-2 py-1 mr-4 bg-gradient-to-tr from-indigo-500 to-pink-500 text-white dark:text-gray-300 font-semibold"
          >
            Admin
          </Link>
        ) : null}

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
      </div>
    </div>
  );
}
