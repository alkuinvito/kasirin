"use client";

import React from "react";
import Image from "next/image";
import Hamburger from "./hamburger";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import * as Popover from "@radix-ui/react-popover";
import { Cross2Icon } from "@radix-ui/react-icons";
import "@/app/components/styles/header.css";

export default function Header() {
  return (
    <div className="shadow-lg backdrop-blur-md fixed top-0 w-full py-2 bg-white/50 dark:bg-slate-950/50">
      <div className="wrapper max-w-7xl w-full h-full flex justify-between items-center mx-auto">
        <Hamburger />
        <h1 className="bg-clip-text text-transparent bg-gradient-to-tr from-indigo-700 to-pink-400 font-semibold text-3xl">
          KasirIn
        </h1>

        <NavigationMenu.Root className="hidden sm:flex mx-auto p-[3px] justify-around rounded-lg bg-gray-400/10">
          <NavigationMenu.List className="NavigationMenuList py-2 px-8 outline-none select-none font-medium leading-none rounded text-lg flex items-center justify-between gap-[2px] data-[highlighted]:bg-gray-600/10 data-[state=open]:bg-gray-600/10">
            <NavigationMenu.Item>
              <NavigationMenu.Link className="NavigationMenuLink" href="./">
                Dashboard
              </NavigationMenu.Link>
            </NavigationMenu.Item>

            <NavigationMenu.Item>
              <NavigationMenu.Link
                className="NavigationMenuLink"
                href="/transaction"
              >
                Transaction
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          </NavigationMenu.List>
        </NavigationMenu.Root>

        <Popover.Root>
          <p className="hidden md:block px-5 text-sm font-mono whitespace-nowrap">
            Rp 7.000.000
          </p>
          <Popover.Trigger asChild>
            <button className="IconButton" aria-label="Profile">
              <Image
                src={"https://github.com/alkuinvito.png"}
                width={30}
                height={30}
                alt="user profile"
              ></Image>
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content className="PopoverContent" sideOffset={5}>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                <p className="Text" style={{ marginBottom: 10 }}>
                  John Doe
                </p>
              </div>
              <Popover.Close className="PopoverClose" aria-label="Close">
                <Cross2Icon />
              </Popover.Close>
              <Popover.Arrow className="PopoverArrow" />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
    </div>
  );
}
