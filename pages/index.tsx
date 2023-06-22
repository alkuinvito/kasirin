import React, { useEffect, useState } from "react";
import OrderList from "../components/shared/orderList";
import styles from "@/styles/menus.module.css";
import MenuItem from "@/components/shared/menuItem";
import axios from "axios";
import { categorySchema, productSchema } from "@/lib/schema";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/shared/header";
import Layout from "@/components/shared/Layout";

export default function Home() {
  const [query, setQuery] = useState("");
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
    return z.object({ products: productSchema.array() }).parse(response.data);
  };

  const categoryQuery = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  const productQuery = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  });

  const [category, setCategory] = useState("all");
  const [filtered, setFiltered] = useState(productQuery.data);

  const handleChange = (id: string) => {
    const filteredProducts = z
      .object({
        products: productSchema.array(),
      })
      .safeParse({
        products: productQuery.data?.products.filter(
          (p) => p.categoryId === id
        ),
      });
    if (filteredProducts.success) {
      setFiltered(filteredProducts.data);
    } else {
      console.error(filteredProducts.error.flatten().formErrors);
    }
  };

  useEffect(() => {
    if (query != "") {
      axios
        .get(`/api/products?q=${query}`, { withCredentials: true })
        .then((res) => {
          setCategory("");
          const result = z
            .object({
              products: productSchema.array().nonempty(),
            })
            .safeParse(res.data);
          if (result.success) {
            setFiltered(result.data);
            console.log(result.data);
          } else {
            console.error(result.error.flatten());
          }
        });
    } else {
      setFiltered(productQuery.data);
    }
  }, [query, productQuery.data]);

  return (
    <main>
      <Header onQuery={setQuery} />
      <Layout>
        <div className="flex">
          <section className="grow">
            <ul className="flex gap mb-4">
              <li>
                <button
                  onClick={() => {
                    setCategory("all");
                    setFiltered(productQuery.data);
                  }}
                  className={
                    "all" === category
                      ? "rounded-lg px-4 py-2 mr-4 cursor-pointer font-semibold bg-indigo-700 hover:bg-indigo-800 text-white transition-colors"
                      : "rounded-lg px-4 py-2 mr-4 cursor-pointer font-semibold bg-gray-100 dark:bg-slate-900 hover:bg-indigo-800 hover:text-white transition-colors"
                  }
                >
                  All
                </button>
              </li>
              {categoryQuery.data?.categories.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => {
                      setCategory(c.id);
                      handleChange(c.id);
                    }}
                    className={
                      c.id === category
                        ? "rounded-lg px-4 py-2 mr-4 cursor-pointer font-semibold bg-indigo-700 hover:bg-indigo-800 text-white transition-colors"
                        : "rounded-lg px-4 py-2 mr-4 cursor-pointer font-semibold bg-gray-100 dark:bg-slate-900 hover:bg-indigo-800 hover:text-white transition-colors"
                    }
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
            <div className={styles.MenuList}>
              {filtered?.products.map((item) => (
                <MenuItem key={item.id} product={item}></MenuItem>
              ))}
            </div>
          </section>
          <section className="h-fit sticky top-20 ml-5">
            <OrderList></OrderList>
          </section>
        </div>
      </Layout>
    </main>
  );
}
