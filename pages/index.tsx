import React, { useMemo, useState } from "react";
import OrderList from "../components/shared/orderList";
import styles from "@/styles/menus.module.css";
import MenuItem from "@/components/shared/menuItem";
import axios from "axios";
import {
  categorySchema,
  productSchema,
  variantGroupSchema,
} from "@/lib/schema";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/shared/header";
import Layout from "@/components/shared/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import Pagination from "@/components/shared/pagination";

export default function Home() {
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [len, setLen] = useState(0);

  const getCategories = async () => {
    const response = await axios.get("/api/categories", {
      withCredentials: true,
    });
    return z
      .object({ categories: categorySchema.array() })
      .parse(response.data);
  };

  const getProducts = async () => {
    const response = await axios.get("/api/products", {
      withCredentials: true,
    });
    return z
      .object({
        products: productSchema
          .extend({
            variants: variantGroupSchema
              .pick({ name: true })
              .array()
              .optional(),
          })
          .array(),
      })
      .parse(response.data);
  };

  const categoryQuery = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  const productQuery = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  });

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const visibleRows = useMemo(() => {
    const filtered = productQuery.data?.products.filter(
      (p) => p.categoryId === category || category === "all"
    );
    setLen(filtered?.length || 0);

    if (query.length > 2) {
      return filtered
        ?.filter((a) => a.name.toLowerCase().includes(query))
        .slice(page * 25, page * 25 + 25);
    }
    return filtered?.slice(page * 25, page * 25 + 25);
  }, [page, productQuery.data?.products, query, category]);

  return (
    <main>
      <Header>
        <div className="w-full mx-4 flex gap-2">
          <select
            className="w-52 py-2 px-3 bg-gray-100 dark:bg-zinc-800/50 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-600/50 focus:bg-gray-200 dark:focus:bg-zinc-800 appearance-none"
            value={category}
            onChange={(e) => setCategory((e.target as HTMLSelectElement).value)}
          >
            <option key="all" value="all">
              All
            </option>
            {categoryQuery.data?.categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <div className="grow p-2 flex items-center backdrop-blur-md bg-gray-100/50 dark:bg-zinc-800/50 hover:bg-gray-200/50 hover:dark:bg-zinc-600/50 focus-within:bg-gray-200/50 focus-within:dark:bg-zinc-600/50 rounded-lg transition-colors">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="mr-2 text-gray-300 dark:text-gray-500"
            />
            <input
              type="text"
              name="q"
              placeholder="Search products..."
              className="bg-transparent focus:outline-none w-full"
              value={query}
              onChange={(e) => {
                setQuery((e.target as HTMLInputElement).value);
              }}
              autoComplete="off"
            />
            {query !== "" ? (
              <button onClick={() => setQuery("")}>
                <FontAwesomeIcon
                  className="text-gray-300 dark:text-zinc-600"
                  icon={faCircleXmark}
                />
              </button>
            ) : null}
          </div>
        </div>
      </Header>
      <Layout>
        <div className="flex">
          <section className="grow">
            <div className={styles.MenuList + " h-full"}>
              {visibleRows?.map((product) => (
                <MenuItem key={product.id} product={product} />
              ))}
            </div>
            <Pagination
              dataLength={len}
              page={page}
              onChangePage={handleChangePage}
            />
          </section>
          <section className="h-fit sticky top-20 ml-5">
            <OrderList></OrderList>
          </section>
        </div>
      </Layout>
    </main>
  );
}
