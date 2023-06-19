import React, { useEffect, useState } from "react";
import OrderList from "../components/shared/orderList";
import styles from "@/styles/menus.module.css";
import MenuItem from "@/components/shared/menuItem";
import { menuSchema } from "@/lib/schema";
import axios from "axios";
import { GetServerSidePropsContext } from "next";
import type { MenuProps } from "@/lib/schema";

export default function Home({ products, query }: MenuProps) {
  const [category, setCategory] = useState(products?.categories[0].name);
  const [filtered, setFiltered] = useState(products?.categories[0]);

  const handleChange = (category: string) => {
    setCategory(category);
    const newFiltered = products.categories.find((c) => c.name === category);
    if (newFiltered !== undefined) {
      setFiltered(newFiltered);
    }
  };

  useEffect(() => {
    if (query != "") {
      axios
        .get(`/api/products?q=${query}`, { withCredentials: true })
        .then((res) => {
          setCategory(res.data.categories[0].name);
          setFiltered(res.data.categories[0]);
        });
    } else {
      handleChange(category);
    }
  }, [query]);

  return (
    <div className="flex">
      <section className="grow">
        <div className="flex gap-2">
          {products?.categories.map((c) => (
            <button
              key={c.id}
              onClick={() => handleChange(c.name)}
              className={
                c.name === category
                  ? "border border-solid px-2 py-1 rounded-lg cursor-pointer hover:bg-indigo-900 dark:hover:bg-indigo-800 text-white bg-indigo-700 border-indigo-700"
                  : "border border-solid px-2 py-1 rounded-lg cursor-pointer hover:bg-indigo-300 dark:hover:bg-indigo-950 text-indigo-700"
              }
            >
              {c.name}
            </button>
          ))}
        </div>
        <ul>
          {
            <li key={filtered.id} className="mb-4">
              <h1 className="my-2 text-xl font-semibold">{filtered.name}</h1>
              <div className={styles.MenuList}>
                {filtered.products.map((item) => (
                  <MenuItem key={item.id} product={item}></MenuItem>
                ))}
              </div>
            </li>
          }
        </ul>
      </section>
      <OrderList></OrderList>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  var options = {
    method: "GET",
    url: process.env.NEXTAUTH_URL + "/api/products",
    headers: {
      cookie: context.req.headers.cookie,
    },
  };

  const response = await axios.request(options);

  const products = menuSchema.safeParse(response.data);

  if (products.success) {
    return {
      props: {
        products: products.data,
      },
    };
  }

  return {
    props: {
      products: menuSchema.optional().parse({}),
    },
  };
}
