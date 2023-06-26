import { categorySchema, productSchema } from "@/lib/schema";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import styles from "@/styles/menus.module.css";
import MenuItem from "@/components/shared/menuItem";
import { useState } from "react";
import { z } from "zod";
import EditProduct from "./edit-product";
import {
  faPlus,
  faBasketShopping,
  faPencil,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddCategory from "./add-category";
import AddProduct from "./add-product";
import CategoryItem from "../shared/categoryItem";
import EditCategory from "./edit-category";

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

  const [category, setCategory] = useState({ id: "all", name: "all" });
  const filtered = productQuery.data?.products.filter(
    (product) => category.id === "all" || product.categoryId === category.id
  );

  if (categoryQuery.isLoading || productQuery.isLoading) {
    return (
      <section className="mt-4 max-w-4xl">
        <ul className="flex gap-2 mb-4">
          <li className="animate-pulse rounded-lg px-2 py-1 w-24 h-8 pulse bg-gray-300 dark:bg-slate-700"></li>
          <li className="animate-pulse rounded-lg px-2 py-1 w-24 h-8 pulse bg-gray-300 dark:bg-slate-700"></li>
          <li className="animate-pulse rounded-lg px-2 py-1 w-24 h-8 pulse bg-gray-300 dark:bg-slate-700"></li>
          <li className="animate-pulse rounded-lg px-2 py-1 w-24 h-8 pulse bg-gray-300 dark:bg-slate-700"></li>
          <li className="animate-pulse rounded-lg px-2 py-1 w-24 h-8 pulse bg-gray-300 dark:bg-slate-700"></li>
        </ul>
        <div className="mt-2 p-4 rounded-lg bg-gray-100 dark:bg-zinc-900">
          <ul className="flex gap-4">
            <li className="animate-pulse rounded-lg px-2 py-1 w-40 h-44 pulse bg-gray-300 dark:bg-slate-700"></li>
            <li className="animate-pulse rounded-lg px-2 py-1 w-40 h-44 pulse bg-gray-300 dark:bg-slate-700"></li>
            <li className="animate-pulse rounded-lg px-2 py-1 w-40 h-44 pulse bg-gray-300 dark:bg-slate-700"></li>
          </ul>
        </div>
      </section>
    );
  }

  if (categoryQuery.isError || productQuery.isError) {
    return <span>Something went wrong</span>;
  }

  if (categoryQuery.data.categories.length === 0) {
    return (
      <div className="flex flex-col items-center py-4">
        <div className="text-gray-400 dark:text-zinc-600 h-full flex flex-col items-center justify-center gap-1">
          <FontAwesomeIcon icon={faBasketShopping} className="text-5xl" />
          <span className="py-5 font-medium">
            You do not have any category yet
          </span>
        </div>
        <AddCategory
          onUpdate={() => categoryQuery.refetch()}
          trigger={
            <button>
              <CategoryItem className="rounded-lg px-4 py-2 cursor-pointer font-medium bg-gray-300 dark:bg-zinc-800 hover:bg-indigo-700 dark:hover:bg-indigo-900 hover:text-white transition-colors">
                <FontAwesomeIcon icon={faPlus} className="mr-4" />
                <span>Create category</span>
              </CategoryItem>
            </button>
          }
        />
      </div>
    );
  }

  return (
    <section className="mt-4 max-w-4xl">
      <div className="flex justify-between mb-4">
        <ul className="flex gap-3 grow">
          <li>
            <CategoryItem
              onClick={() => {
                setCategory({ id: "all", name: "all" });
              }}
              active={category.id === "all"}
            >
              All
            </CategoryItem>
          </li>
          {categoryQuery.data?.categories.map((c) => (
            <li key={c.id}>
              <CategoryItem
                onClick={() => {
                  setCategory({ id: c.id, name: c.name });
                }}
                active={category.id === c.id}
              >
                {c.name}
              </CategoryItem>
            </li>
          ))}
          <AddCategory
            onUpdate={() => categoryQuery.refetch()}
            trigger={
              <li>
                <CategoryItem>
                  <FontAwesomeIcon icon={faPlus} />
                </CategoryItem>
              </li>
            }
          />
        </ul>
        {category.id !== "all" ? (
          <EditCategory
            category={category}
            onUpdate={() => categoryQuery.refetch()}
            trigger={
              <button className="cursor-pointer">
                <FontAwesomeIcon icon={faPencil} className="p-2" />
              </button>
            }
          />
        ) : null}
      </div>

      <div className="mt-2 p-4 rounded-lg bg-gray-100 dark:bg-zinc-900">
        <ul className={styles.MenuList}>
          {filtered?.map((item) => (
            <li
              key={item.id}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors"
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
          {category.id === "all" ? null : (
            <AddProduct
              category={categoryQuery.data.categories.find(
                (c) => c.id === category.id
              )}
              onUpdate={() => productQuery.refetch()}
              trigger={
                <li className="h-48 p-2 rounded-lg border-2 border-solid flex items-center justify-center border-gray-300 dark:border-zinc-800 text-gray-400 dark:text-zinc-700 cursor-pointer hover:bg-gray-300 hover:dark:bg-zinc-800">
                  <FontAwesomeIcon icon={faPlus} className="w-10 h-10" />
                </li>
              }
            />
          )}
        </ul>
      </div>
    </section>
  );
}
