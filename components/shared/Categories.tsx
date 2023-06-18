import { Category } from "@/lib/schema";
import React from "react";

export default function Categories(props: {
  categories: Category[];
  handleChange: (id: string) => Promise<void>;
}) {
  return (
    <>
      {props.categories.map((c) => (
        <div className="" key={c.id} onClick={() => props.handleChange(c.id)}>
          {c.name}
        </div>
      ))}
    </>
  );
}
