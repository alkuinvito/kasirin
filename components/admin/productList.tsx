import { menuSchema } from "@/lib/schema";
import { PlusIcon, DotsVerticalIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import style from "@/styles/menus.module.css";
import MenuItem from "../shared/menuItem";
import { useState } from "react";
import EditProduct from "./edit-product";

export default function ProductList() {
  const getProducts = async () => {
    const response = await axios.get("/api/products", {
      withCredentials: true,
    });
    return menuSchema.parse(response.data);
  };

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["categories"],
    queryFn: () =>
      getProducts().then((data) => {
        setCategory(data.categories[0].id);
        return data;
      }),
  });

  const [category, setCategory] = useState("data?.categories[0].id");
  const filtered = data?.categories.find((c) => c.id === category);

  if (isLoading) {
    return (
      <>
        <ul className="flex gap-2 mb-4">
          <li className="animate-pulse rounded-lg px-2 py-1 w-24 h-7 pulse bg-gray-300 dark:bg-slate-700"></li>
          <li className="animate-pulse rounded-lg px-2 py-1 w-24 h-7 pulse bg-gray-300 dark:bg-slate-700"></li>
          <li className="animate-pulse rounded-lg px-2 py-1 w-24 h-7 pulse bg-gray-300 dark:bg-slate-700"></li>
          <li className="animate-pulse rounded-lg px-2 py-1 w-24 h-7 pulse bg-gray-300 dark:bg-slate-700"></li>
          <li className="animate-pulse rounded-lg px-2 py-1 w-24 h-7 pulse bg-gray-300 dark:bg-slate-700"></li>
        </ul>
        <ul className="flex gap-4">
          <li className="animate-pulse rounded-lg px-2 py-1 w-40 h-44 pulse bg-gray-300 dark:bg-slate-700"></li>
          <li className="animate-pulse rounded-lg px-2 py-1 w-40 h-44 pulse bg-gray-300 dark:bg-slate-700"></li>
          <li className="animate-pulse rounded-lg px-2 py-1 w-40 h-44 pulse bg-gray-300 dark:bg-slate-700"></li>
        </ul>
      </>
    );
  }

  if (error instanceof Error) {
    return <span>Error occured: {error.message}</span>;
  }

  return (
    <section>
      <ul className="flex gap-2 mb-4">
        {data?.categories.map((c) => (
          <li
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={
              c.id === category
                ? "rounded-lg px-2 py-1 text-sm border-solid border border-indigo-700 text-white bg-indigo-700 hover:bg-indigo-800 hover:text-white  transition-colors cursor-pointer"
                : "rounded-lg px-2 py-1 text-sm border-solid border border-indigo-700 text-indigo-700 hover:bg-indigo-700 hover:text-white transition-colors cursor-pointer"
            }
          >
            {c.name}
          </li>
        ))}

        <li className="rounded-lg px-2 py-1 text-sm border-solid border border-indigo-700 text-indigo-700 hover:bg-indigo-700 hover:text-white transition-colors cursor-pointer flex items-center">
          <PlusIcon />
        </li>
        <div className="grow"></div>
        <li className="rounded-lg px-2 py-1 text-gray-600 dark:text-slate-600 hover:bg-gray-300 hover:dark:bg-slate-800 cursor-pointer flex items-center transition-colors ">
          <DotsVerticalIcon />
        </li>
      </ul>
      <ul className={style.MenuList}>
        {filtered?.products.map((product) => (
          <li
            key={product.id}
            className="p-2 rounded-lg hover:text-indigo-600 transition-colors dark:bg-slate-800"
          >
            <EditProduct
              product={product}
              onUpdate={() => refetch()}
              trigger={
                <div className="cursor-pointer">
                  <MenuItem product={product} />
                </div>
              }
            />
          </li>
        ))}
        <li className="p-2 rounded-lg border-2 border-solid flex items-center justify-center border-gray-300 dark:border-slate-700 text-gray-400 dark:text-slate-700 cursor-pointer hover:bg-gray-300 hover:dark:bg-slate-800">
          <PlusIcon className="w-10 h-10" />
        </li>
      </ul>
    </section>
  );
}
