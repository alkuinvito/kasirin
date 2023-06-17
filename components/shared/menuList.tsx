import React, { useState, useEffect } from "react";
import axios from "axios";
import MenuItem from "./menuItem";
import { menuSchema } from "@/lib/schema";
import styles from "@/styles/menus.module.css";
import { toSnakeCase } from "@/lib/helper";

export default function MenuList(props: { query: string }) {
  const [menus, setMenus] = useState(menuSchema.partial().parse({}));

  useEffect(() => {
    if (props.query !== "") {
      axios
        .get(`/api/products?q=${props.query}`, { withCredentials: true })
        .then((res) => {
          const data = menuSchema.safeParse(res.data);
          if (data.success) {
            setMenus(data.data);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
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
    }
  }, [props.query]);

  return (
    <ul>
      {menus?.categories?.map((category) => (
        <li key={category.id} id={toSnakeCase(category.name)} className="mb-4">
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
