import React, { useState, useEffect } from "react";
import OrderList from "../components/shared/orderList";
import MenuList from "../components/shared/menuList";
import { Category, categorySchema } from "@/lib/schema";
import axios from "axios";
import { toSnakeCase } from "@/lib/helper";

function CategoryList(props: { categories: Category[] }) {
  if (props.categories.length > 0) {
    return (
      <ul className="flex gap-2">
        {props.categories.map((category) => (
          <li key={category.id}>
            <a
              href={"#" + toSnakeCase(category.name)}
              className="px-2 py-1 rounded-lg text-sm border-solid border border-indigo-700 text-indigo-700 hover:bg-indigo-700 hover:text-white"
            >
              {category.name}
            </a>
          </li>
        ))}
      </ul>
    );
  }
  return null;
}

export default function Home(props: { query: string }) {
  const defaultCategory: Category[] = [{ name: "" }];
  const [categories, setCategories] = useState(defaultCategory);

  useEffect(() => {
    axios
      .get("/api/categories", { withCredentials: true })
      .then((res) => {
        const data = categorySchema.array().safeParse(res.data.categories);
        if (data.success) {
          setCategories(data.data);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="flex scroll-smooth">
      <section className="grow">
        <CategoryList categories={categories} />
        <MenuList query={props.query}></MenuList>
      </section>
      <OrderList></OrderList>
    </div>
  );
}
