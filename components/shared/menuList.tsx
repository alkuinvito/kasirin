import React, { useState, useEffect } from "react";
import axios from "axios";
import MenuItem from "./menuItem";
import { menuSchema } from "@/lib/schema";
import styles from "@/styles/menus.module.css";

export default function MenuList() {
  const [menus, setMenus] = useState(menuSchema.partial().parse({}));

  useEffect(() => {
    axios
      .get("/api/products", { withCredentials: true })
      .then((res) => {
        const data = menuSchema.safeParse(res.data);
        if (data.success) {
          setMenus(data.data);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <ul>
      {menus?.categories?.map((category) => (
        <li key={category.id} id={category.id} className="mb-4">
          <h1 className="my-2 text-xl font-semibold">{category.name}</h1>
          <div className={styles.MenuList}>
            {category.products.map((item) => (
              <>
                <MenuItem product={item}></MenuItem>
              </>
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
}
