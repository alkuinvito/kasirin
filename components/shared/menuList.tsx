"use client";

import React from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import MenuItem, { Menu } from "./menuItem";

export interface Menus {
  name: string;
  menu: Menu[];
}

export default function MenuList() {
  let menus: Menus[] = [
    {
      name: "drinks",
      menu: [
        {
          image:
            "http://3.bp.blogspot.com/-US1FOxNnpr0/U4f3MBtDJLI/AAAAAAAARK0/aSSJTb1oUcY/s1600/Congyang_cap_tiga_orang.jpg",
          name: "Congyang",
          price: 65000,
        },
      ],
    },
    {
      name: "snacks",
      menu: [
        {
          image:
            "http://3.bp.blogspot.com/-iXlsFO9wIZc/Uu_BWwA4PgI/AAAAAAAADTg/8Dl3pbiTaAk/s1600/fries.jpg",
          name: "Kentang",
          price: 80000,
        },
      ],
    },
  ];

  return (
    <Accordion.Root
      className="AccordionRoot grow px-3"
      type="multiple"
      defaultValue={menus.map((category) => category.name)}
    >
      {menus.map((category) => (
        <Accordion.Item
          className="AccordionItem"
          value={category.name}
          key={category.name}
        >
          <Accordion.Trigger className="AccordionTrigger px-4 py-2 mb-6 w-full box-border rounded-lg bg-gray-100 dark:bg-slate-800 flex items-center">
            <h2 className="grow text-xl font-semibold">{category.name}</h2>
            <ChevronDownIcon className="AccordionChevron" aria-hidden />
          </Accordion.Trigger>
          <Accordion.Content className="AccordionContent">
            {category.menu.map((item) => (
              <MenuItem
                key={item.name}
                image={item.image}
                name={item.name}
                price={item.price}
              ></MenuItem>
            ))}
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
