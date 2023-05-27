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
    <div className="flex justify-between items-center shadow-lg backdrop-blur-md fixed top-0 w-full p-2">
      <Hamburger />
      <h1 className="bg-clip-text text-transparent bg-gradient-to-tr from-indigo-700 to-pink-400 font-bold text-2xl ">
        KasirIn
      </h1>

      <NavigationMenu.Root className="NavigationMenuRoot hidden sm:flex">
        <NavigationMenu.List className="NavigationMenuList">
          <NavigationMenu.Item>
            <NavigationMenu.Link
              className="NavigationMenuLink"
              href="http://localhost:3000"
            >
              Menu
            </NavigationMenu.Link>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <NavigationMenu.Link
              className="NavigationMenuLink"
              href="http://localhost:3000/transaction"
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
          <button className="IconButton" aria-label="Update dimensions">
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
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
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
  );
}
