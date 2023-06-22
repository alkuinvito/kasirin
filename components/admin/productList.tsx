import { categorySchema, productSchema } from "@/lib/schema";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import styles from "@/styles/menus.module.css";
import MenuItem from "@/components/shared/menuItem";
import { useEffect, useState } from "react";
import { z } from "zod";
import EditProduct from "./edit-product";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import AddCategory from "./add-category";
import AddProduct from "./add-product";

export default function ProductList() {
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
  const filtered = productQuery.data?.products.filter(
    (product) => category === "all" || product.categoryId === category
  );

  if (categoryQuery.isLoading || productQuery.isLoading) {
    return (
      <>
        <ul className="flex gap-2 mb-4">
          <li className="animate-pulse rounded-lg px-2 py-1 w-24 h-8 pulse bg-gray-300 dark:bg-slate-700"></li>
          <li className="animate-pulse rounded-lg px-2 py-1 w-24 h-8 pulse bg-gray-300 dark:bg-slate-700"></li>
          <li className="animate-pulse rounded-lg px-2 py-1 w-24 h-8 pulse bg-gray-300 dark:bg-slate-700"></li>
          <li className="animate-pulse rounded-lg px-2 py-1 w-24 h-8 pulse bg-gray-300 dark:bg-slate-700"></li>
          <li className="animate-pulse rounded-lg px-2 py-1 w-24 h-8 pulse bg-gray-300 dark:bg-slate-700"></li>
        </ul>
        <ul className="flex gap-4">
          <li className="animate-pulse rounded-lg px-2 py-1 w-40 h-44 pulse bg-gray-300 dark:bg-slate-700"></li>
          <li className="animate-pulse rounded-lg px-2 py-1 w-40 h-44 pulse bg-gray-300 dark:bg-slate-700"></li>
          <li className="animate-pulse rounded-lg px-2 py-1 w-40 h-44 pulse bg-gray-300 dark:bg-slate-700"></li>
        </ul>
      </>
    );
  }

  if (categoryQuery.isError || productQuery.isError) {
    return <span>Something went wrong</span>;
  }

  return (
    <section>
      <ul className="flex gap mb-4">
        <li>
          <button
            onClick={() => {
              setCategory("all");
            }}
            className={
              "all" === category
                ? "rounded-lg px-4 py-2 mr-4 cursor-pointer font-semibold bg-indigo-700 hover:bg-indigo-800 text-white transition-colors"
                : "rounded-lg px-4 py-2 mr-4 cursor-pointer font-semibold bg-gray-200 dark:bg-slate-800 hover:bg-indigo-800 hover:text-white transition-colors"
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
              }}
              className={
                c.id === category
                  ? "rounded-lg px-4 py-2 mr-4 cursor-pointer font-semibold bg-indigo-700 hover:bg-indigo-800 text-white transition-colors"
                  : "rounded-lg px-4 py-2 mr-4 cursor-pointer font-semibold bg-gray-200 dark:bg-slate-800 hover:bg-indigo-800 hover:text-white transition-colors"
              }
            >
              {c.name}
            </button>
          </li>
        ))}
        <AddCategory
          onUpdate={() => categoryQuery.refetch()}
          trigger={
            <li className="rounded-lg px-4 py-2 flex items-center mr-4 cursor-pointer bg-gray-200 dark:bg-slate-800 hover:bg-indigo-800 hover:text-white transition-colors">
              <FontAwesomeIcon icon={faPlus} />
            </li>
          }
        />
        <div className="grow"></div>
        <li className="rounded-lg px-3 py-2 text-gray-600 dark:text-slate-600 hover:bg-gray-300 hover:dark:bg-slate-800 cursor-pointer flex items-center transition-colors ">
          <DotsVerticalIcon />
        </li>
      </ul>

      <ul className={styles.MenuList}>
        {filtered?.map((item) => (
          <li
            key={item.id}
            className="p-2 rounded-lg hover:text-indigo-600 transition-colors"
          >
            <EditProduct
              product={item}
              onUpdate={() => productQuery.refetch()}
              trigger={
                <div className="cursor-pointer">
                  <MenuItem product={item} />
                </div>
              }
            />
          </li>
        ))}
        {category === "all" ? null : (
          <AddProduct
            category={categoryQuery.data.categories.find(
              (c) => c.id === category
            )}
            onUpdate={() => productQuery.refetch()}
            trigger={
              <li className="p-2 rounded-lg border-2 border-solid flex items-center justify-center border-gray-300 dark:border-slate-700 text-gray-400 dark:text-slate-700 cursor-pointer hover:bg-gray-300 hover:dark:bg-slate-800">
                <FontAwesomeIcon icon={faPlus} className="w-10 h-10" />
              </li>
            }
          />
        )}
      </ul>
    </section>
  );
}
