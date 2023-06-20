import React, { useEffect, useState } from "react";
import OrderList from "../components/shared/orderList";
import styles from "@/styles/menus.module.css";
import MenuItem from "@/components/shared/menuItem";
import { menuSchema } from "@/lib/schema";
import axios from "axios";
import { GetServerSidePropsContext } from "next";
import type { MenuProps } from "@/lib/schema";
import { toSnakeCase } from "@/lib/helper";

export default function Home({ products, query }: MenuProps) {
  const [filtered, setFiltered] = useState(products?.categories);

  useEffect(() => {
    if (query != "") {
      axios
        .get(`/api/products?q=${query}`, { withCredentials: true })
        .then((res) => {
          setFiltered(res.data.categories);
        });
    } else {
      setFiltered(products.categories);
    }
  }, [query]);

  return (
    <div className="flex">
      <section className="grow">
        <ul>
          {filtered.map((category) => (
            <li
              id={toSnakeCase(category.name)}
              key={category.id}
              className="mb-4"
            >
              <h1 className="my-2 text-xl font-semibold">{category.name}</h1>
              <div className={styles.MenuList}>
                {category.products.map((item) => (
                  <MenuItem key={item.id} product={item}></MenuItem>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section className="h-fit sticky top-20 ml-5">
        <div>
          {products.categories.map((category) => (
            <a
              key={toSnakeCase(category.name)}
              className="rounded-lg px-2 py-1 mr-4 border-solid border border-indigo-700 text-indigo-700 hover:bg-indigo-700 hover:text-white transition-colors "
              href={`#${toSnakeCase(category.name)}`}
            >
              {category.name}
            </a>
          ))}
        </div>
        <OrderList></OrderList>
      </section>
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
